const localKey = 'portfolio-projects-hw5';
const remoteUrl = 'https://api.jsonbin.io/v3/b/69336c6a43b1c97be9da96fd/latest';
const accessKey = '$2a$10$r2fmCTetqzn7ZABJqS00AezPV8YhrokNMZeX07kFMsoLkXPOSO6nq';

const seedLocal = [
    {
        id: 'atlas-cli',
        title: 'Atlas-CLI Infrastructure Toolkit',
        meta: 'Go • Cloud automation',
        description: 'CLI to scaffold cloud environments across AWS and GCP with ArgoCD, Prometheus, and Grafana bootstrapping.',
        link: 'https://github.com/ryanjwong',
        linkLabel: 'View repository',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
        alt: 'Laptop on a desk with cloud icons',
        tags: ['Go', 'Kubernetes', 'CI/CD']
    },
    {
        id: 'anon-lambda',
        title: 'Anonymous Web Services',
        meta: 'Node.js • P2P compute',
        description: 'Peer-to-peer code execution platform using UDP holepunching with a custom CLI for submitting workloads.',
        link: 'https://github.com/ryanjwong',
        linkLabel: 'Project notes',
        image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=900&q=80',
        alt: 'Circuit board close-up',
        tags: ['Node.js', 'Networking', 'CLI']
    },
    {
        id: 'dashboards',
        title: 'Observability Dashboards',
        meta: 'Grafana • Prometheus',
        description: 'Multi-cluster GPU fleet monitoring with alerting, latency heatmaps, and traffic tracing views.',
        link: 'https://github.com/ryanjwong',
        linkLabel: 'View dashboards',
        image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80',
        alt: 'Abstract data visualization',
        tags: ['Grafana', 'Prometheus', 'Kubernetes']
    }
];

const statusEl = document.getElementById('status-text');
const containerEl = document.getElementById('cards-container');
const loadLocalBtn = document.getElementById('load-local');
const loadRemoteBtn = document.getElementById('load-remote');

function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
}

function getLocalData() {
    const stored = localStorage.getItem(localKey);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(localKey, JSON.stringify(seedLocal));
    return seedLocal;
}

function renderCards(data) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('project-card');
        card.data = item;
        containerEl.appendChild(card);
    });
}

async function loadRemote() {
    try {
        setStatus('Loading remote data...');
        const res = await fetch(remoteUrl, {
            headers: { 'X-Access-Key': accessKey }
        });
        if (!res.ok) throw new Error(`Remote request failed: ${res.status}`);
        const json = await res.json();
        let data = json.record ?? json;
        if (!Array.isArray(data) && data && Array.isArray(data.record)) {
            data = data.record;
        }
        if (!Array.isArray(data)) data = [];
        renderCards(data);
        setStatus(data.length ? `Remote data loaded (${data.length})` : 'Remote data empty');
    } catch (err) {
        setStatus('Remote load failed');
        console.error(err);
    }
}

function loadLocal() {
    const data = getLocalData();
    renderCards(data);
    setStatus('Local data loaded');
}

if (loadLocalBtn) loadLocalBtn.addEventListener('click', loadLocal);
if (loadRemoteBtn) loadRemoteBtn.addEventListener('click', loadRemote);

document.addEventListener('DOMContentLoaded', () => {
    loadLocal();
});

