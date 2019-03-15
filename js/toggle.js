// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    try {
        var storage = window[type], x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && storage.length !== 0;
    }
}

class Toggle {
    constructor(el) {
        this.container = el;
        this.id = 'developer-toggle-' + el.dataset.toggle;
        this.items = [].slice.call(el.querySelectorAll("." + el.dataset.toggle));
        this.lastIndex = storageAvailable ? parseInt(localStorage.getItem(this.id) || -1, 4) : -1;
        this.index = this.getRandomIndex();
        
        if (storageAvailable) {
            localStorage.setItem(this.id, this.index);
        }
        
        this.items.forEach(function (el, i) {
            if (i !== this.index) {
                el.style.display = 'none';
            }
        }.bind(this));
    }
    getRandomIndex() {
        var newRandomIndex = Math.floor(Math.random() * this.items.length);
        return (newRandomIndex === this.lastIndex) ? this.getRandomIndex() : newRandomIndex;
    }
}

[].slice.call(document.querySelectorAll('[data-toggle]'))
    .forEach(function (toggleContainer) {
        new Toggle(toggleContainer);
    });
