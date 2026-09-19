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

const modal = document.createElement('div');
modal.className = 'submission-modal';
modal.hidden = true;
modal.id = 'submission-modal';
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
modal.setAttribute('aria-labelledby', 'submission-modal-title');
modal.innerHTML = `
    <div class="submission-modal__box">
        <button
            class="submission-modal__close"
            id="submission-modal-close"
            type="button"
            aria-label="Close"
        >&times;</button>
        <h2 id="submission-modal-title">Submit a Record</h2>
        <p>
            Records can be submitted through the CubeyGDPS Discord server.
            Go to the <strong>#dl-submissions</strong> channel and include
            at least the following information in your message:
        </p>
        <ul>
            <li>Level name</li>
            <li>Level creator</li>
            <li>Level verifier</li>
            <li>Level publisher</li>
            <li>Link to your completion video</li>
            <li>Level ID</li>
        </ul>
        <div class="submission-modal__actions">
            <button
                class="submission-modal__button submission-modal__button--close"
                id="submission-modal-close-button"
                type="button"
            >Close</button>
            <a
                class="submission-modal__button submission-modal__button--discord"
                href="https://discord.com/invite/V8VujbJnUS"
                target="_blank"
                rel="noopener noreferrer"
            >Open Discord Server</a>
        </div>
    </div>
`;
document.body.appendChild(modal);

const openButton = document.getElementById('submit-record-button');
const closeButton = document.getElementById('submission-modal-close');
const closeButtonBottom = document.getElementById('submission-modal-close-button');

const closeModal = () => {
    modal.classList.remove('is-open');
    modal.hidden = true;
};

if (openButton) {
    openButton.addEventListener('click', (event) => {
        event.preventDefault();
        modal.hidden = false;
        modal.classList.add('is-open');
    });
}

closeButton?.addEventListener('click', closeModal);
closeButtonBottom?.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
});
