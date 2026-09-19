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
modal.id = 'submission-modal';
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
modal.setAttribute('aria-labelledby', 'submission-modal-title');
modal.hidden = true;
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

// Keep the modal outside Vue's #app tree so Vue cannot replace it.
document.documentElement.appendChild(modal);

const closeModal = () => {
    modal.classList.remove('is-open');
    modal.hidden = true;
};

const openModal = (event) => {
    event.preventDefault();
    modal.hidden = false;
    modal.classList.add('is-open');
};

// The router renders the Submit Record link after app.mount(), so direct
// getElementById() lookup can happen too early. Event delegation works
// regardless of when Vue renders or rerenders the link.
document.addEventListener('click', (event) => {
    const openButton = event.target.closest?.('#submit-record-button');

    if (openButton) {
        openModal(event);
        return;
    }

    if (
        event.target === modal ||
        event.target.closest?.('#submission-modal-close') ||
        event.target.closest?.('#submission-modal-close-button')
    ) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
});
