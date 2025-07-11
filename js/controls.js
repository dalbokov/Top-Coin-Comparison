// ============================
// CONTROLS MODULE
// ============================

const Controls = {
    init() {
        this.setupMethodTabs();
        this.setupTimeButtons();
        this.setupDropdowns();
        this.setupCustomButton();
    },

    setupMethodTabs() {
        const tabs = document.querySelectorAll('.method-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                AppState.currentMethod = e.target.dataset.method;
                this.toggleMethodControls(AppState.currentMethod);
                Chart.updateData(); // refresh chart when method changes
            });
        });
    },

    setupTimeButtons() {
        const buttons = document.querySelectorAll('.time-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                AppState.currentPeriod = parseInt(e.target.dataset.period);
                Chart.updateData();
            });
        });
    },

    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', (e) => {
                if (e.target.id === 'coins-count') {
                    AppState.currentCoins = parseInt(e.target.value);
                }
                Chart.updateData();
            });
        });
    },

    setupCustomButton() {
        const btn = document.getElementById('custom-select');
        btn.addEventListener('click', () => {
            Modal.show();
        });
    },

    toggleMethodControls(method) {
        const marketCapGroup = document.getElementById('market-cap-group');
        const categoryGroup = document.getElementById('category-group');

        if (method === 'market-cap') {
            marketCapGroup.style.display = 'flex';
            categoryGroup.style.display = 'none';
        } else {
            marketCapGroup.style.display = 'none';
            categoryGroup.style.display = 'flex';
        }
    }
};
