'use strict';

// Style für sichtbaren Fokus
const style = document.createElement('style');
style.textContent = `
    [tv-focus] {
        outline: none;
    }

    [tv-focus]:focus {
        outline: 3px solid #00aaff !important;
    }
`;
document.head.appendChild(style);

// Hole alle klickbaren sichtbaren Elemente
function getFocusableElements() {
    const selectors = 'a, button, input, [role="button"], [onclick], .clickable';
    return Array.from(document.querySelectorAll(selectors)).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 30 && rect.height > 20 && rect.top >= 0 && rect.left >= 0 && el.offsetParent !== null;
    });
}

// Indexieren & markieren
function markFocusable() {
    getFocusableElements().forEach((el, i) => {
        el.setAttribute('tv-focus', i);
        el.setAttribute('tabindex', '0');
    });
}

markFocusable();

// MutationObserver für dynamische Inhalte
const observer = new MutationObserver(markFocusable);
observer.observe(document.body, { childList: true, subtree: true });

// Pfeiltasten-Navigation nach Position
document.addEventListener('keydown', (event) => {
    const all = getFocusableElements();
    if (!all.length) return;

    const current = document.activeElement;
    const index = all.indexOf(current);
    if (index === -1) {
        all[0].focus();
        return;
    }

    const currentRect = current.getBoundingClientRect();
    let next;

    function score(el) {
        const r = el.getBoundingClientRect();
        switch (event.code) {
            case 'ArrowDown': return r.top > currentRect.top && Math.abs(r.left - currentRect.left) < 100;
            case 'ArrowUp': return r.top < currentRect.top && Math.abs(r.left - currentRect.left) < 100;
            case 'ArrowRight': return r.left > currentRect.left && Math.abs(r.top - currentRect.top) < 100;
            case 'ArrowLeft': return r.left < currentRect.left && Math.abs(r.top - currentRect.top) < 100;
        }
    }

    const candidates = all.filter(el => el !== current && score(el));
    if (candidates.length > 0) {
        next = candidates.sort((a, b) => {
            const da = a.getBoundingClientRect();
            const db = b.getBoundingClientRect();
            const distA = Math.hypot(da.top - currentRect.top, da.left - currentRect.left);
            const distB = Math.hypot(db.top - currentRect.top, db.left - currentRect.left);
            return distA - distB;
        })[0];
    }

    if (next) {
        event.preventDefault();
        next.focus();
    }

    if (event.code === 'Enter') {
        current.click();
    }
});
