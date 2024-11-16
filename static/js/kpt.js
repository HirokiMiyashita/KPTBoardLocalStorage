// Initialize Feather icons
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    loadCards();
});

// Local Storage Management
function saveCards() {
    const containers = ['keep', 'problem', 'try'];
    const data = {};
    
    containers.forEach(type => {
        const container = document.getElementById(`${type}-container`);
        const cards = container.querySelectorAll('.kpt-card');
        data[type] = Array.from(cards).map(card => ({
            id: card.id,
            text: card.querySelector('.card-text').value
        }));
    });
    
    localStorage.setItem('kptData', JSON.stringify(data));
}

function loadCards() {
    const data = JSON.parse(localStorage.getItem('kptData') || '{"keep":[],"problem":[],"try":[]}');
    
    Object.entries(data).forEach(([type, cards]) => {
        cards.forEach(card => {
            createCard(type, card.text, card.id);
        });
    });
}

// Card Management
function addCard(type) {
    createCard(type, '');
    saveCards();
}

function createCard(type, text, id = null) {
    const template = document.getElementById('card-template');
    const container = document.getElementById(`${type}-container`);
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector('.kpt-card');
    
    card.id = id || `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    card.setAttribute('ondragstart', 'drag(event)');
    
    const textarea = card.querySelector('.card-text');
    textarea.value = text;
    textarea.addEventListener('input', saveCards);
    
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        card.remove();
        saveCards();
    });
    
    container.appendChild(card);
    feather.replace();
}

// Drag and Drop Functionality
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const cardId = ev.dataTransfer.getData('text');
    const card = document.getElementById(cardId);
    const dropZone = ev.target.closest('[id$="-container"]');
    
    if (dropZone && card) {
        dropZone.appendChild(card);
        saveCards();
    }
}
