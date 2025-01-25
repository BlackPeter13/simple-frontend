import { getCachedData, setCachedData } from './utils/cache.js';

const API_ENDPOINT = 'http://radioactive.sytes.net:3001/api/v1/BCA/';
const CACHE_KEY = 'bca_cache';
const CACHE_TTL = 300000; // 5 minutes

const elements = {
    grid: document.getElementById('grid'),
    loader: document.getElementById('loader'),
    error: document.getElementById('error'),
    search: document.getElementById('search'),
    skeleton: document.getElementById('skeleton')
};

let refreshTimeout;
let cachedData = [];

// Initialization
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
    loadInitialData();
}

function setupEventListeners() {
    elements.search.addEventListener('input', debounce(handleSearch, 300));
}

async function loadInitialData() {
    try {
        showLoadingState();
        const data = await fetchWithCache();
        cachedData = data;
        displayData(data);
        scheduleAutoRefresh();
        announce('Data loaded successfully');
    } catch (error) {
        handleDataError(error);
    }
}

async function fetchWithCache() {
    const cached = getCachedData(CACHE_KEY, CACHE_TTL);
    if (cached) {
        return cached;
    }

    const response = await fetch(API_ENDPOINT);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    setCachedData(CACHE_KEY, data);
    return data;
}

function displayData(items) {
    elements.grid.innerHTML = items.slice(0, 50).map(createCardHTML).join('');
    elements.skeleton.style.display = 'none';
}

function createCardHTML(item) {
    return `
        <div class="card" role="article" aria-labelledby="title-${item.id}">
            <h3 id="title-${item.id}">${item.name || 'Unnamed Item'}</h3>
            <p>ID: ${item.id}</p>
            ${item.description ? `<p>${item.description}</p>` : ''}
            ${item.price ? `<p>Price: $${item.price.toFixed(2)}</p>` : ''}
            ${item.date ? `<p>Date: ${new Date(item.date).toLocaleDateString()}</p>` : ''}
        </div>
    `;
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = cachedData.filter(item =>
        item.name?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm)
    );
    displayData(filtered);
    announce(`${filtered.length} items found`);
}

function showLoadingState() {
    elements.loader.style.display = 'block';
    elements.error.style.display = 'none';
    elements.skeleton.style.display = 'grid';
}

function handleDataError(error) {
    console.error('Data loading error:', error);
    elements.error.style.display = 'block';
    elements.loader.style.display = 'none';
    elements.skeleton.style.display = 'none';
    announce('Error loading data. Please try again.');
}

function scheduleAutoRefresh() {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
        fetchData();
        scheduleAutoRefresh();
    }, CACHE_TTL);
}

function announce(message) {
    const status = document.getElementById('status');
    status.textContent = message;
    setTimeout(() => status.textContent = '', 5000);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Public API
window.fetchData = async function() {
    try {
        showLoadingState();
        const data = await fetchWithCache();
        cachedData = data;
        displayData(data);
        announce('Data refreshed successfully');
    } catch (error) {
        handleDataError(error);
    }
};
