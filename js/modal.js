// ============================
// CUSTOM COIN PICKER MODAL
// ============================

const CoinPickerModal = {
    modalEl: null,
    listEl: null,
    searchInput: null,
    selectedSet: new Set(),

    async init() {
        this.createModal();
        await this.loadCoinList();
        this.attachEvents();
    },

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'coin-picker-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                padding: 20px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            ">
                <h3 style="margin-bottom: 15px;">Select Coins (max 10)</h3>
                <input type="text" id="coin-search" placeholder="Search..." style="
                    width: 100%;
                    padding: 8px 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                " />
                <div id="coin-list" style="max-height: 300px; overflow-y: auto;"></div>
                <div style="margin-top: 15px; text-align: right;">
                    <button id="coin-cancel" style="margin-right: 10px;">Cancel</button>
                    <button id="coin-confirm" disabled>Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        this.modalEl = modal;
        this.listEl = modal.querySelector('#coin-list');
        this.searchInput = modal.querySelector('#coin-search');
        modal.querySelector('#coin-cancel').addEventListener('click', () => this.close());
        modal.querySelector('#coin-confirm').addEventListener('click', () => this.confirm());
    },

    async loadCoinList() {
        const coins = await CoinGeckoAPI.getTopCoins(250);
        this.allCoins = coins;

        this.renderList();
        this.searchInput.addEventListener('input', () => this.renderList());
    },

    renderList() {
        const term = this.searchInput.value.toLowerCase();
        this.listEl.innerHTML = '';

        this.allCoins
            .filter(coin => coin.name.toLowerCase().includes(term) || coin.symbol.toLowerCase().includes(term))
            .slice(0, 100)
            .forEach(coin => {
                const item = document.createElement('div');
                const isChecked = this.selectedSet.has(coin.id);
                item.innerHTML = `
                    <label style="display: flex; align-items: center; gap: 10px; padding: 4px 0;">
                        <input type="checkbox" value="${coin.id}" ${isChecked ? 'checked' : ''} />
                        ${coin.name} (${coin.symbol.toUpperCase()})
                    </label>
                `;
                item.querySelector('input').addEventListener('change', (e) => {
                    if (e.target.checked) {
                        if (this.selectedSet.size < 10) {
                            this.selectedSet.add(coin.id);
                        } else {
                            e.target.checked = false;
                        }
                    } else {
                        this.selectedSet.delete(coin.id);
                    }
                    this.updateConfirmButton();
                });
                this.listEl.appendChild(item);
            });

        this.updateConfirmButton();
    },

    updateConfirmButton() {
        const confirmBtn = this.modalEl.querySelector('#coin-confirm');
        confirmBtn.disabled = this.selectedSet.size === 0;
    },

    confirm() {
        const selectedIds = Array.from(this.selectedSet);
        AppState.currentMethod = 'custom';
        AppState.customCoins = this.allCoins.filter(c => selectedIds.includes(c.id)).map(c => ({
            id: c.id,
            symbol: c.symbol,
            color: getRandomColor()
        }));
        this.close();
        Chart.updateData();
    },

    open() {
        this.modalEl.style.display = 'flex';
    },

    close() {
        this.modalEl.style.display = 'none';
        this.searchInput.value = '';
        this.renderList();
    }
};
