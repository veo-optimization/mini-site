// ============================================
// ОБРОБКА ТА ВАЛІДАЦІЯ ДАНИХ КЛІЄНТА
// ============================================
// Цей файл містить функції для обробки простих даних клієнта
// та перетворення їх у правильні формати для використання на сторінці

/**
 * Форматує номер телефону для відображення
 * @param {string} phone - Номер телефону (10 цифр, починається з 0)
 * @returns {string} - Відформатований номер (+380XXXXXXXXX)
 */
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    // Видаляємо всі пробіли та дефіси
    const cleaned = phoneNumber.replace(/\s|-/g, '');
    // Якщо номер починається з 0 і має 10 цифр, додаємо +380
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return "+380" + cleaned.substring(1);
    }
    // Якщо вже є +380, повертаємо як є
    if (cleaned.startsWith('+380')) {
        return cleaned;
    }
    // Якщо починається з 380, додаємо +
    if (cleaned.startsWith('380') && cleaned.length === 12) {
        return '+' + cleaned;
    }
    return phoneNumber;
}

/**
 * Створює Viber URL з номера телефону
 * @param {string} phoneNumber - Номер телефону
 * @returns {string} - Viber URL
 */
function createViberUrl(phoneNumber) {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    return `viber://chat?number=${encodeURIComponent(formattedNumber)}`;
}

/**
 * Валідує IBAN
 * @param {string} iban - IBAN для перевірки
 * @returns {boolean} - true якщо валідний
 */
function validateIBAN(iban) {
    if (!iban) return false;
    // Видаляємо пробіли
    const cleaned = iban.replace(/\s/g, '');
    // Перевіряємо формат: UA + 2 цифри + 4 літери + 19 цифр = 29 символів
    return /^UA\d{2}[A-Z]{4}\d{19}$/.test(cleaned);
}

/**
 * Валідує ЄДРПОУ
 * @param {string} edrpou - ЄДРПОУ для перевірки
 * @returns {boolean} - true якщо валідний
 */
function validateEDRPOU(edrpou) {
    if (!edrpou) return false;
    // Видаляємо пробіли та дефіси
    const cleaned = edrpou.replace(/\s|-/g, '');
    // ЄДРПОУ має бути 8 або 10 цифр
    return /^\d{8}(\d{2})?$/.test(cleaned);
}

/**
 * Валідує номер телефону
 * @param {string} phone - Номер телефону
 * @returns {boolean} - true якщо валідний
 */
function validatePhone(phone) {
    if (!phone) return false;
    const cleaned = phone.replace(/\s|-/g, '');
    // Може бути: 10 цифр (починається з 0), 12 цифр (починається з 380), або 13 символів (починається з +380)
    return /^(0\d{9}|380\d{9}|\+380\d{9})$/.test(cleaned);
}

/**
 * Обробляє дані клієнта та встановлює глобальні константи
 * Викликається автоматично при завантаженні сторінки
 */
function processClientData() {
    // Перевіряємо, чи дані клієнта визначені
    if (typeof CLIENT_DATA === 'undefined') {
        console.error('CLIENT_DATA не визначено. Переконайтеся, що дані клієнта завантажені.');
        return;
    }
    
    const data = CLIENT_DATA;
    
    // Встановлюємо глобальні константи з даних клієнта
    window.SHOP_NAME = data.shopName || '';
    window.FOP_NAME = data.fopName || '';
    window.EDRPOU = data.edrpou || '';
    window.IBAN = data.iban || '';
    window.BANK_NAME = data.bankName || '';
    window.PAYMENT_PURPOSE = data.paymentPurpose || '';
    
    // Контакти
    window.TELEGRAM_USERNAME = data.telegramUsername || '';
    window.VIBER_PHONE = data.viberPhone || '';
    window.TELEGRAM_SHOWCASE = data.telegramShowcase || '';
    window.INSTAGRAM_USERNAME = data.instagramUsername || '';
    window.BIGGO_LIVE_URL = data.biggoLiveUrl || '';
    
    // Календар
    window.GOOGLE_CALENDAR_URL_OR_ID = data.googleCalendarUrl || '';
    window.GOOGLE_CALENDAR_API_KEY = data.googleCalendarApiKey || '';
    
    // Умови оплати
    window.PAYMENT_OPTIONS = data.paymentOptions || [];
    
    // Умови доставки
    window.DELIVERY_METHOD = data.deliveryMethod || '';
    window.DELIVERY_TIME = data.deliveryTime || '';
    window.DELIVERY_NOTE = data.deliveryNote || '';
    
    // Умови повернення
    window.EXCHANGE_DAYS = data.exchangeDays || 0;
    window.RETURN_DAYS = data.returnDays || 0;
    window.RETURN_CONDITIONS = data.returnConditions || [];
    window.RETURN_MONEY_TIME = data.returnMoneyTime || '';
    window.RETURN_DELIVERY_COST = data.returnDeliveryCost || '';
    
    // Шаблон після оплати
    window.AFTER_PAYMENT_TEMPLATE = data.afterPaymentTemplate || '';
    
    // Валідація даних (опціонально, можна закоментувати для продакшену)
    if (data.iban && !validateIBAN(data.iban)) {
        console.warn('⚠️ IBAN може бути невалідним:', data.iban);
    }
    if (data.edrpou && !validateEDRPOU(data.edrpou)) {
        console.warn('⚠️ ЄДРПОУ може бути невалідним:', data.edrpou);
    }
    if (data.viberPhone && !validatePhone(data.viberPhone)) {
        console.warn('⚠️ Номер телефону може бути невалідним:', data.viberPhone);
    }
}

// Автоматично обробляємо дані при завантаженні скрипта
// Якщо CLIENT_DATA вже визначено, обробляємо одразу
if (typeof CLIENT_DATA !== 'undefined') {
    processClientData();
} else {
    // Якщо дані ще не завантажені, чекаємо на DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof CLIENT_DATA !== 'undefined') {
                processClientData();
            }
        });
    }
}

