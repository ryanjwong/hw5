const projectCardTemplate = document.createElement('template');
projectCardTemplate.innerHTML = `
<style>
:host {
    display: block;
}
.card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px var(--shadow);
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px var(--shadow);
}
.media {
    position: relative;
    aspect-ratio: 4 / 3;
    background: var(--header-bg);
    overflow: hidden;
}
.media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.content {
    display: grid;
    gap: 0.5rem;
    padding: 1rem 1.1rem 1.25rem;
}
.title {
    margin: 0;
    font-size: 1.2rem;
    color: var(--text-color);
}
.meta {
    color: var(--link-hover);
    font-size: 0.95rem;
}
.description {
    margin: 0;
    color: var(--text-color);
}
.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0;
    margin: 0;
    list-style: none;
}
.tag {
    padding: 0.35rem 0.6rem;
    background: var(--header-bg);
    border-radius: 999px;
    font-size: 0.85rem;
    color: var(--text-color);
    border: 1px solid var(--border-color);
}
.link {
    justify-self: start;
    padding: 0.6rem 1rem;
    background-color: var(--button-bg);
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s ease, transform 0.1s ease;
}
.link:hover {
    background-color: var(--button-hover);
    transform: translateY(-1px);
}
.link:active {
    transform: translateY(0);
}
</style>
<article class="card">
    <div class="media">
        <picture>
            <img>
        </picture>
    </div>
    <div class="content">
        <h2 class="title"></h2>
        <div class="meta"></div>
        <p class="description"></p>
        <ul class="tags"></ul>
        <a class="link" target="_blank" rel="noopener"></a>
    </div>
</article>
`;

class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(projectCardTemplate.content.cloneNode(true));
        this.titleEl = this.shadowRoot.querySelector('.title');
        this.metaEl = this.shadowRoot.querySelector('.meta');
        this.descEl = this.shadowRoot.querySelector('.description');
        this.tagsEl = this.shadowRoot.querySelector('.tags');
        this.linkEl = this.shadowRoot.querySelector('.link');
        this.imgEl = this.shadowRoot.querySelector('img');
    }

    set data(value) {
        this._data = value;
        this.render();
    }

    get data() {
        return this._data;
    }

    render() {
        if (!this._data) return;
        const { title, description, link, linkLabel, image, alt, meta, tags } = this._data;
        this.titleEl.textContent = title || '';
        this.metaEl.textContent = meta || '';
        this.descEl.textContent = description || '';
        this.linkEl.textContent = linkLabel || 'Read more';
        this.linkEl.href = link || '#';
        this.imgEl.src = image || '';
        this.imgEl.alt = alt || '';
        this.tagsEl.innerHTML = '';
        if (Array.isArray(tags)) {
            tags.forEach(tag => {
                const li = document.createElement('li');
                li.className = 'tag';
                li.textContent = tag;
                this.tagsEl.appendChild(li);
            });
        }
    }
}

customElements.define('project-card', ProjectCard);

