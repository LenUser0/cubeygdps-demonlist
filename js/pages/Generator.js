export default {
    components: { Spinner },
    template: `
        <main class="page-generator">
            <section class="generator-card">
                <h1>Moderator JSON Generator</h1>
                <p class="generator-warning"><strong>Unprotected page:</strong> this static GitHub Pages site cannot authenticate moderators. Do not enter secrets. Only trusted GitHub collaborators can publish changes.</p>
                <div class="generator-tabs">
                    <button type="button" :class="{ active: kind === 'level' }" @click="kind = 'level'">Level JSON</button>
                    <button type="button" :class="{ active: kind === 'record' }" @click="kind = 'record'">Record JSON</button>
                </div>

                <form @submit.prevent>
                    <template v-if="kind === 'level'">
                        <label>Level ID <input type="number" min="0" step="1" v-model="form.id"></label>
                        <label>Level name <input type="text" v-model="form.name"></label>
                        <label>Author / publisher <input type="text" v-model="form.author"></label>
                        <label>Creators (comma-separated) <input type="text" v-model="form.creators"></label>
                        <label>Verifier <input type="text" v-model="form.verifier"></label>
                        <label>Verification video URL <input type="url" v-model="form.verification"></label>
                        <label>Showcase video URL (optional) <input type="url" v-model="form.showcase"></label>
                        <label>Percent to qualify <input type="number" min="0" max="100" v-model="form.percentToQualify"></label>
                        <label>Password (optional) <input type="text" v-model="form.password"></label>
                    </template>
                    <template v-else>
                        <label>Player name <input type="text" v-model="form.user"></label>
                        <label>Completion video URL <input type="url" v-model="form.link"></label>
                        <label>Progress (%) <input type="number" min="1" max="100" v-model="form.percent"></label>
                        <label>FPS <input type="number" min="1" step="1" v-model="form.fps"></label>
                        <label>Record date <input type="date" v-model="form.date"></label>
                        <label class="generator-check"><input type="checkbox" v-model="form.mobile"> Mobile</label>
                        <label class="generator-check"><input type="checkbox" v-model="form.cbf"> CBF</label>
                    </template>
                </form>

                <p v-if="!isValid" class="generator-error">{{ errors.join(' ') }}</p>
                <div class="generator-actions">
                    <button type="button" :disabled="!isValid" @click="generate">Generate JSON</button>
                    <button type="button" :disabled="!generatedJson" @click="copyJson">Copy JSON</button>
                </div>
                <p v-if="copyMessage" role="status">{{ copyMessage }}</p>
                <h2>JSON output</h2>
                <pre class="generator-output">{{ generatedJson || 'Complete the required fields to generate JSON.' }}</pre>

                <h2>Live preview</h2>
                <div class="generator-preview" v-if="isValid && kind === 'level'">
                    <h3>{{ clean(form.name) }}</h3>
                    <p>By {{ clean(form.author) }}</p>
                    <p>Creators: {{ clean(form.creators).split(',').map(s => s.trim()).filter(Boolean).join(', ') }}</p>
                    <p>Qualify: {{ form.percentToQualify }}%</p>
                </div>
                <div class="generator-preview" v-else-if="isValid">
                    <p><strong>{{ clean(form.percent) }}%</strong> · <strong>{{ clean(form.user) }}</strong><span v-if="form.date && isFreshDate(form.date)" class="record-new">New!</span></p>
                    <p>{{ form.fps }} FPS<span v-if="form.cbf"> + CBF</span><span v-if="form.mobile"> · Mobile</span></p>
                </div>
                <p v-else class="generator-muted">A preview appears when all required fields are valid.</p>
            </section>
        </main>
    `,
    data: () => ({
        kind: 'level',
        generatedJson: '',
        copyMessage: '',
        form: {
            id: '', name: '', author: '', creators: '', verifier: '',
            verification: '', showcase: '', percentToQualify: 100, password: '',
            user: '', link: '', percent: 100, fps: 60, date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
            mobile: false, cbf: false,
        },
    }),
    computed: {
        errors() {
            const e = [];
            const f = this.form;
            const requiredText = this.kind === 'level'
                ? [['Level name', f.name], ['Author', f.author], ['Creators', f.creators]]
                : [['Player name', f.user], ['Video URL', f.link], ['Date', f.date]];
            for (const [label, value] of requiredText) {
                if (!String(value ?? '').trim()) e.push(label + ' is required.');
            }
            if (this.kind === 'level') {
                if (f.id === '' || !Number.isInteger(Number(f.id)) || Number(f.id) < 0) e.push('A valid non-negative level ID is required.');
                if (!Number.isFinite(Number(f.percentToQualify)) || Number(f.percentToQualify) < 0 || Number(f.percentToQualify) > 100) e.push('Qualify percentage must be between 0 and 100.');
                if (f.verification && !this.validUrl(f.verification)) e.push('Verification URL is invalid.');
                if (f.showcase && !this.validUrl(f.showcase)) e.push('Showcase URL is invalid.');
            } else {
                if (!this.validUrl(f.link)) e.push('Video URL must be a valid HTTP(S) URL.');
                if (!Number.isFinite(Number(f.percent)) || Number(f.percent) < 1 || Number(f.percent) > 100) e.push('Progress must be between 1 and 100.');
                if (!Number.isInteger(Number(f.fps)) || Number(f.fps) < 1) e.push('FPS must be a positive whole number.');
                if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(f.date) || Number.isNaN(new Date(f.date + 'T00:00:00').getTime())) e.push('A valid date is required.');
            }
            return e;
        },
        isValid() {
            return this.errors.length === 0;
        },
    },
    watch: {
        kind() { this.generatedJson = ''; this.copyMessage = ''; },
        form: { deep: true, handler() { this.generatedJson = ''; this.copyMessage = ''; } },
    },
    methods: {
        clean(value) { return String(value ?? '').trim(); },
        validUrl(value) {
            try {
                const url = new URL(value);
                return url.protocol === 'https:' || url.protocol === 'http:';
            } catch { return false; }
        },
        isFreshDate(date) {
            const age = Date.now() - new Date(date + 'T00:00:00').getTime();
            return age >= 0 && age < 7 * 24 * 60 * 60 * 1000;
        },
        generate() {
            if (!this.isValid) return;
            const f = this.form;
            let output;
            if (this.kind === 'level') {
                output = {
                    id: Number(f.id),
                    name: this.clean(f.name),
                    author: this.clean(f.author),
                    creators: this.clean(f.creators).split(',').map(s => s.trim()).filter(Boolean),
                    percentToQualify: Number(f.percentToQualify),
                    records: [],
                };
                if (this.clean(f.verifier)) output.verifier = this.clean(f.verifier);
                if (this.clean(f.verification)) output.verification = this.clean(f.verification);
                if (this.clean(f.showcase)) output.showcase = this.clean(f.showcase);
                if (this.clean(f.password)) output.password = this.clean(f.password);
            } else {
                output = {
                    user: this.clean(f.user),
                    link: this.clean(f.link),
                    percent: Number(f.percent),
                    fps: Number(f.fps),
                    mobile: Boolean(f.mobile),
                    cbf: Boolean(f.cbf),
                    date: f.date,
                };
            }
            this.generatedJson = JSON.stringify(output, null, 4);
        },
        async copyJson() {
            if (!this.generatedJson) return;
            try {
                await navigator.clipboard.writeText(this.generatedJson);
                this.copyMessage = 'Copied to clipboard!';
            } catch {
                this.copyMessage = 'Clipboard access failed. Select and copy the JSON manually.';
            }
        },
    },
};
