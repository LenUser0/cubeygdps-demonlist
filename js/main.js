import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
});

const app = Vue.createApp({
    data: () => ({ store }),
});
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);

app.mount('#app');

const modal = document.getElementById('submission-modal');
const openButton = document.getElementById('submit-record-button');
const closeButton = document.getElementById('submission-modal-close');
const closeButtonBottom = document.getElementById('submission-modal-close-button');

if (modal && openButton && closeButton && closeButtonBottom) {
    const closeModal = () => modal.classList.remove('is-open');

    openButton.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.add('is-open');
    });

    closeButton.addEventListener('click', closeModal);
    closeButtonBottom.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}
