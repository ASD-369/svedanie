// ==============================
// СИСТЕМА ЛЕТАЮЩИХ СЕРДЕЧЕК
// ==============================

const CONFIG = {
    hearts: ['❤️', '💕', '💗', '💖', '💝'],
    sparkles: ['❤️', '💕', '💗', '💖', '💝'],
    maxElements: 100
};

let backgroundInterval = null;
let finalInterval = null;
let activeElements = [];

window.activeElements = activeElements;

// ==============================
// 1. ФОНОВЫЕ СЕРДЕЧКИ (СВЕРХУ ВНИЗ)
// ==============================

function createFallingHeart() {
    const container = document.getElementById('hearts-container');
    if (!container) return;
    
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    
    const isHeart = Math.random() > 0.3;
    const symbols = isHeart ? CONFIG.hearts : CONFIG.sparkles;
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    const size = 15 + Math.random() * 25;
    heart.style.fontSize = size + 'px';
    
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '-5%';
    
    const duration = 4 + Math.random() * 6;
    heart.style.animationDuration = duration + 's';
    heart.style.animationName = 'floatHeart';
    heart.style.animationTimingFunction = 'linear';
    heart.style.animationDelay = (Math.random() * 2) + 's';
    
    container.appendChild(heart);
    activeElements.push(heart);
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
        const index = activeElements.indexOf(heart);
        if (index > -1) {
            activeElements.splice(index, 1);
        }
    }, duration * 1000 + 2000);
}

// ==============================
// 2. СЕРДЕЧКИ ИЗ-ПОД КНОПКИ (ВЕЕРОМ)
// ==============================

function createHeartsFromButton(event, count = 15) {
    let x, y;
    
    if (event && event.target) {
        const rect = event.target.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    } else if (event && event.clientX !== undefined) {
        x = event.clientX;
        y = event.clientY;
    } else {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
    }
    
    if (activeElements.length > CONFIG.maxElements) {
        const excess = activeElements.length - CONFIG.maxElements;
        for (let i = 0; i < excess && i < activeElements.length; i++) {
            const el = activeElements[i];
            if (el.parentNode) {
                el.remove();
            }
        }
        activeElements = activeElements.slice(excess);
    }
    
    let created = 0;
    const interval = setInterval(() => {
        if (created >= count) {
            clearInterval(interval);
            return;
        }
        
        const angle = (created / count) * Math.PI * 2;
        const radius = 30 + Math.random() * 60;
        const randomX = x + Math.cos(angle) * radius + (Math.random() - 0.5) * 40;
        const randomY = y + Math.sin(angle) * radius - 30 + (Math.random() - 0.5) * 40;
        
        const el = document.createElement('div');
        el.className = 'heart-particle';
        
        const symbols = CONFIG.hearts;
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        const size = 18 + Math.random() * 22;
        el.style.fontSize = size + 'px';
        
        el.style.left = randomX + 'px';
        el.style.top = randomY + 'px';
        
        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 200 - 100;
        el.style.setProperty('--offsetX', offsetX + 'px');
        el.style.setProperty('--offsetY', offsetY + 'px');
        
        const duration = 0.6 + Math.random() * 0.8;
        el.style.animationDuration = duration + 's';
        el.style.animationName = 'floatHeartFromPoint';
        
        document.getElementById('hearts-container').appendChild(el);
        activeElements.push(el);
        
        setTimeout(() => {
            if (el.parentNode) {
                el.remove();
            }
            const index = activeElements.indexOf(el);
            if (index > -1) {
                activeElements.splice(index, 1);
            }
        }, duration * 1000 + 100);
        
        created++;
    }, 30);
}

// ==============================
// 3. ЗАПУСК ФОНОВЫХ СЕРДЕЧЕК (НА ВСЕХ ЭТАПАХ)
// ==============================

function startBackgroundHearts() {
    if (backgroundInterval) {
        clearInterval(backgroundInterval);
    }
    
    // Сразу создаём несколько сердечек
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createFallingHeart(), i * 400);
    }
    
    // Постоянный поток
    backgroundInterval = setInterval(() => {
        const count = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
            setTimeout(() => createFallingHeart(), i * 300);
        }
    }, 1200);
}

// ==============================
// 4. ФИНАЛЬНЫЙ ДОЖДЬ
// ==============================

function startFinalHearts() {
    if (finalInterval) {
        clearInterval(finalInterval);
    }
    if (backgroundInterval) {
        clearInterval(backgroundInterval);
    }
    
    let count = 0;
    finalInterval = setInterval(() => {
        const heartsCount = 3 + Math.floor(Math.random() * 4);
        for (let i = 0; i < heartsCount; i++) {
            setTimeout(() => createFallingHeart(), i * 150);
        }
        
        count++;
        if (count > 60) {
            clearInterval(finalInterval);
            startBackgroundHearts();
        }
    }, 400);
}

// ==============================
// 5. ОСТАНОВКА
// ==============================

function stopAllHearts() {
    if (backgroundInterval) {
        clearInterval(backgroundInterval);
        backgroundInterval = null;
    }
    if (finalInterval) {
        clearInterval(finalInterval);
        finalInterval = null;
    }
    
    activeElements.forEach(el => {
        if (el.parentNode) {
            el.remove();
        }
    });
    activeElements = [];
}

// ==============================
// 6. ПОЛНАЯ ОЧИСТКА
// ==============================

function clearAllHearts() {
    if (backgroundInterval) {
        clearInterval(backgroundInterval);
        backgroundInterval = null;
    }
    if (finalInterval) {
        clearInterval(finalInterval);
        finalInterval = null;
    }
    
    activeElements.forEach(el => {
        if (el.parentNode) {
            el.remove();
        }
    });
    activeElements = [];
    
    const container = document.getElementById('hearts-container');
    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}

// ==============================
// ЭКСПОРТ
// ==============================

window.createHeartsFromButton = createHeartsFromButton;
window.startBackgroundHearts = startBackgroundHearts;
window.startFinalHearts = startFinalHearts;
window.stopAllHearts = stopAllHearts;
window.clearAllHearts = clearAllHearts;