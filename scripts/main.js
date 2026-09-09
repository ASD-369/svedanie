// ==============================
// ГЛАВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
// ==============================

let userData = {
    date: '',
    time: '',
    food: []
};

let isTransitioning = false;

// ==============================
// УПРАВЛЕНИЕ ЭТАПАМИ
// ==============================

function showStep(stepId) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    const step = document.getElementById(stepId);
    if (step) {
        step.classList.add('active');
        updateProgress(stepId);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(stepId) {
    const stepMap = {
        'step-envelope': 0,
        'step-question': 20,
        'step-celebration': 40,
        'step-datetime': 60,
        'step-food': 80,
        'step-final': 100
    };
    
    const progress = stepMap[stepId] || 0;
    const remain = 100 - progress;
    
    document.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = progress + '%';
    });
    
    document.querySelectorAll('.progress-remain').forEach(el => {
        el.style.width = remain + '%';
    });
}

// ==============================
// ОЧИСТКА ТОЛЬКО СЕРДЕЧЕК ИЗ-ПОД КНОПОК
// ==============================

function clearButtonHearts() {
    const container = document.getElementById('hearts-container');
    if (container) {
        // Удаляем только те сердечки, которые ещё летят (не фоновые)
        const hearts = container.querySelectorAll('.heart-particle');
        hearts.forEach(heart => {
            // Проверяем, что это не фоновое сердечко (летит из-под кнопки)
            if (heart.style.animationName === 'floatHeartFromPoint') {
                heart.remove();
            }
        });
    }
}

// ==============================
// ЭТАПЫ
// ==============================

function openEnvelope(event) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    if (window.createHeartsFromButton) {
        window.createHeartsFromButton(event, 15);
    }
    
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
    
    setTimeout(() => {
        clearButtonHearts(); // Очищаем только сердечки из-под кнопки
        showStep('step-question');
        isTransitioning = false;
    }, 900);
}

function answerYes(event) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    if (window.createHeartsFromButton) {
        window.createHeartsFromButton(event, 25);
    }
    
    setTimeout(() => {
        clearButtonHearts();
        showStep('step-celebration');
        isTransitioning = false;
    }, 800);
}

function answerNo(event) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    if (window.createHeartsFromButton) {
        window.createHeartsFromButton(event, 10);
    }
    
    setTimeout(() => {
        document.getElementById('modal-sad').classList.add('show');
        isTransitioning = false;
    }, 400);
}

function goToDateTime(event) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    if (window.createHeartsFromButton) {
        window.createHeartsFromButton(event, 20);
    }
    
    setTimeout(() => {
        clearButtonHearts();
        showStep('step-datetime');
        isTransitioning = false;
    }, 800);
}

function saveDateTime(event) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const dateInput = document.getElementById('datePicker');
    const timeInput = document.getElementById('timePicker');
    
    if (!dateInput.value || !timeInput.value) {
        showError('Пожалуйста, выбери дату и время! 💕');
        isTransitioning = false;
        return;
    }
    
    if (window.createHeartsFromButton) {
        window.createHeartsFromButton(event, 15);
    }
    
    userData.date = formatDate(dateInput.value);
    userData.time = timeInput.value;
    
    setTimeout(() => {
        clearButtonHearts();
        showStep('step-food');
        isTransitioning = false;
    }, 800);
}

function saveFood(event) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const selectedFoods = document.querySelectorAll('.food-item.selected');
    
    if (selectedFoods.length === 0) {
        showError('Выбери хотя бы одно блюдо! 🍕');
        isTransitioning = false;
        return;
    }
    
    if (window.createHeartsFromButton) {
        window.createHeartsFromButton(event, 20);
    }
    
    userData.food = Array.from(selectedFoods).map(item => item.dataset.value);
    
    sendNotificationToTelegram(userData);
    
    setTimeout(() => {
        clearButtonHearts();
        showFinalStep();
        isTransitioning = false;
    }, 800);
}

function showFinalStep() {
    document.getElementById('finalDate').textContent = userData.date;
    document.getElementById('finalTime').textContent = userData.time;
    document.getElementById('finalFoodList').textContent = userData.food.join(', ');
    
    showStep('step-final');
    
    if (window.startFinalHearts) {
        window.startFinalHearts();
    }
}

// ==============================
// ВСПОМОГАТЕЛЬНЫЕ
// ==============================

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function closeModal() {
    document.getElementById('modal-sad').classList.remove('show');
}

function showError(message) {
    const errorModal = document.getElementById('modal-error');
    document.getElementById('errorMessage').textContent = message;
    errorModal.classList.add('show');
}

function closeErrorModal() {
    document.getElementById('modal-error').classList.remove('show');
}

// ==============================
// ИНИЦИАЛИЗАЦИЯ
// ==============================

document.addEventListener('DOMContentLoaded', () => {
    showStep('step-envelope');
    updateProgress('step-envelope');
    
    // ЗАПУСКАЕМ ФОНОВЫЕ СЕРДЕЧКИ ОДИН РАЗ
    if (window.startBackgroundHearts) {
        window.startBackgroundHearts();
    }
    
    document.querySelectorAll('.food-item').forEach(item => {
        item.addEventListener('click', function(e) {
            this.classList.toggle('selected');
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeErrorModal();
    }
});