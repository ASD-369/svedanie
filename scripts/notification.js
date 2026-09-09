// ==============================
// ОТПРАВКА В TELEGRAM
// ==============================

const TELEGRAM_CONFIG = {
    token: '8565110654:AAH6S5fU2kTYFd3P1BMKQAN0NHwMxHOX0HQ',
    chatId: '630776421'
};

function sendNotificationToTelegram(data) {
    console.log('📤 Отправка уведомления...');
    console.log('📅 Данные:', data);

    const message = `
🎉 <b>Настя согласилась на свидание!</b>

📅 <b>Дата:</b> ${data.date}
⏰ <b>Время:</b> ${data.time}
🍕 <b>Еда:</b> ${data.food.join(', ')}

❤️ <b>От Никиты с любовью!</b>
    `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('📨 Ответ от Telegram:', data);
        if (data.ok) {
            console.log('✅ Уведомление отправлено! ❤️');
            alert('💕 Уведомление отправлено Никите! ❤️');
        } else {
            console.error('❌ Ошибка:', data.description);
            alert('❌ Ошибка отправки: ' + data.description);
            showLocalNotification(data);
        }
    })
    .catch(error => {
        console.error('❌ Ошибка сети:', error);
        alert('❌ Ошибка сети! Проверь интернет.');
        showLocalNotification(data);
    });
}

function showLocalNotification(data) {
    try {
        const savedData = JSON.parse(localStorage.getItem('invitationData') || '[]');
        savedData.push({
            date: data.date,
            time: data.time,
            food: data.food,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('invitationData', JSON.stringify(savedData));
        console.log('💾 Данные сохранены локально');
    } catch (e) {
        console.error('Не удалось сохранить данные:', e);
    }
    alert('💕 Спасибо! Никита уже знает твой выбор! ❤️');
}

// ТЕСТОВАЯ ФУНКЦИЯ
function testTelegram() {
    console.log('🧪 Тестовая отправка...');
    sendNotificationToTelegram({
        date: '15.09.2026',
        time: '19:30',
        food: ['Пицца', 'Суши']
    });
}