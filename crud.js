693365e943b1c97be9da8f19const localKey = 'portfolio-projects-hw5';
const remoteReadUrl = 'https://api.jsonbin.io/v3/b/69336680d0ea881f40159cb0/latest';
const remoteWriteUrl = 'https://api.jsonbin.io/v3/b/69336680d0ea881f40159cb0';
const accessKey = '$2a$10$r2fmCTetqzn7ZABJqS00AezPV8YhrokNMZeX07kFMsoLkXPOSO6nq';

const localForm = document.getElementById('local-form');
const remoteForm = document.getElementById('remote-form');
const localStatus = document.getElementById('local-status');
const remoteStatus = document.getElementById('remote-status');
const localPreview = document.getElementById('local-preview');
const remotePreview = document.getElementById('remote-preview');

function setStatus(el, text) {
    if (el) el.textContent = text;
}

function tagsFromInput(value) {
    return value
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
}

function formToItem(form) {
    const formData = new FormData(form);
    return {
        id: formData.get('id') || '',
        title: formData.get('title') || '',
        meta: formData.get('meta') || '',
        description: formData.get('description') || '',
        link: formData.get('link') || '',
        linkLabel: formData.get('linkLabel') || 'Learn more',
        image: formData.get('image') || '',
        alt: formData.get('alt') || '',
        tags: tagsFromInput(formData.get('tags') || '')
    };
}

function updatePreview(container, item) {
    if (!container) return;
    container.innerHTML = '';
    const card = document.createElement('project-card');
    card.data = item;
    container.appendChild(card);
}

function getLocalData() {
    const stored = localStorage.getItem(localKey);
    if (!stored) return [];
    return JSON.parse(stored);
}

function saveLocalData(data) {
    localStorage.setItem(localKey, JSON.stringify(data));
}

function localCreate() {
    const item = formToItem(localForm);
    const data = getLocalData().filter(entry => entry.id !== item.id);
    data.push(item);
    saveLocalData(data);
    setStatus(localStatus, 'Local entry created');
    updatePreview(localPreview, item);
}

function localUpdate() {
    const item = formToItem(localForm);
    const data = getLocalData();
    const idx = data.findIndex(entry => entry.id === item.id);
    if (idx === -1) {
        setStatus(localStatus, 'Local entry not found');
        return;
    }
    data[idx] = item;
    saveLocalData(data);
    setStatus(localStatus, 'Local entry updated');
    updatePreview(localPreview, item);
}

function localDelete() {
    const item = formToItem(localForm);
    const data = getLocalData();
    const filtered = data.filter(entry => entry.id !== item.id);
    saveLocalData(filtered);
    setStatus(localStatus, 'Local entry deleted');
    localPreview.innerHTML = '';
}

async function fetchRemoteData() {
    const res = await fetch(remoteReadUrl, { headers: { 'X-Access-Key': accessKey } });
    if (!res.ok) throw new Error(`Remote fetch failed: ${res.status}`);
    const json = await res.json();
    const data = json.record || json;
    if (!Array.isArray(data)) throw new Error('Remote data not array');
    return data;
}

async function writeRemoteData(data) {
    const res = await fetch(remoteWriteUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': accessKey
        },
        body: JSON.stringify({ record: data })
    });
    if (!res.ok) throw new Error(`Remote write failed: ${res.status}`);
}

async function remoteCreate() {
    try {
        const item = formToItem(remoteForm);
        const data = (await fetchRemoteData()).filter(entry => entry.id !== item.id);
        data.push(item);
        await writeRemoteData(data);
        setStatus(remoteStatus, 'Remote entry created');
        updatePreview(remotePreview, item);
    } catch (err) {
        setStatus(remoteStatus, 'Remote create failed');
        console.error(err);
    }
}

async function remoteUpdate() {
    try {
        const item = formToItem(remoteForm);
        const data = await fetchRemoteData();
        const idx = data.findIndex(entry => entry.id === item.id);
        if (idx === -1) {
            setStatus(remoteStatus, 'Remote entry not found');
            return;
        }
        data[idx] = item;
        await writeRemoteData(data);
        setStatus(remoteStatus, 'Remote entry updated');
        updatePreview(remotePreview, item);
    } catch (err) {
        setStatus(remoteStatus, 'Remote update failed');
        console.error(err);
    }
}

async function remoteDelete() {
    try {
        const item = formToItem(remoteForm);
        const data = await fetchRemoteData();
        const filtered = data.filter(entry => entry.id !== item.id);
        await writeRemoteData(filtered);
        setStatus(remoteStatus, 'Remote entry deleted');
        remotePreview.innerHTML = '';
    } catch (err) {
        setStatus(remoteStatus, 'Remote delete failed');
        console.error(err);
    }
}

function fillDefaults() {
    document.getElementById('local-id').value = 'atlas-cli';
    document.getElementById('local-title').value = 'Atlas-CLI Infrastructure Toolkit';
    document.getElementById('local-meta').value = 'Go • Cloud automation';
    document.getElementById('local-description').value = 'CLI to scaffold cloud environments across AWS and GCP with ArgoCD, Prometheus, and Grafana bootstrapping.';
    document.getElementById('local-link').value = 'https://github.com/ryanjwong';
    document.getElementById('local-linklabel').value = 'View repository';
    document.getElementById('local-image').value = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80';
    document.getElementById('local-alt').value = 'Laptop on a desk with cloud icons';
    document.getElementById('local-tags').value = 'Go, Kubernetes, CI/CD';

    document.getElementById('remote-id').value = 'remote-sample';
    document.getElementById('remote-title').value = 'Remote Sample Project';
    document.getElementById('remote-meta').value = 'JSONBin dataset';
    document.getElementById('remote-description').value = 'Data managed through JSONBin for HW5 remote CRUD.';
    document.getElementById('remote-link').value = 'https://hw5-cd4.pages.dev/';
    document.getElementById('remote-linklabel').value = 'Visit site';
    document.getElementById('remote-image').value = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80';
    document.getElementById('remote-alt').value = 'Developer desk with code on screen';
    document.getElementById('remote-tags').value = 'Remote, JSONBin, Demo';
}

document.getElementById('local-create')?.addEventListener('click', localCreate);
document.getElementById('local-update')?.addEventListener('click', localUpdate);
document.getElementById('local-delete')?.addEventListener('click', localDelete);

document.getElementById('remote-create')?.addEventListener('click', remoteCreate);
document.getElementById('remote-update')?.addEventListener('click', remoteUpdate);
document.getElementById('remote-delete')?.addEventListener('click', remoteDelete);

document.addEventListener('DOMContentLoaded', fillDefaults);

