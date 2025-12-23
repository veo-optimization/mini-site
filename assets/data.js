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
    // Перевіряємо формат: UA + 2 цифри (контрольна сума) + 4 символи (код банку, може бути літери або цифри) + 19 цифр (номер рахунку) = 29 символів
    return /^UA\d{2}[A-Z0-9]{4}\d{19}$/.test(cleaned);
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
 * Парсить прості рядки з псевдонімами (c1 - значення) і конвертує їх у CLIENT_DATA
 * @param {string} constantsText - Текст з константами у форматі "c1 - значення\nc2 - значення"
 * @returns {object} - Об'єкт CLIENT_DATA
 */
function parseClientConstants(constantsText) {
    const data = {};
    const lines = constantsText.split('\n').filter(line => line.trim());
    const constants = {};
    
    // Парсимо всі константи
    lines.forEach(line => {
        const match = line.match(/^c(\d+)([a-z]|_count|_type)?\s*-\s*(.+)$/);
        if (match) {
            const num = match[1];
            const suffix = match[2] || '';
            const value = match[3].trim();
            const key = `c${num}${suffix}`;
            constants[key] = value;
        }
    });
    
    // Мапінг констант на поля CLIENT_DATA
    let counter = 1;
    
    // c1 - shopName
    if (constants[`c${counter}`]) {
        data.shopName = constants[`c${counter}`];
        counter++;
    }
    
    // c2 - shopDescription
    if (constants[`c${counter}`]) {
        data.shopDescription = constants[`c${counter}`];
        counter++;
    }
    
    // c3 - fopName
    if (constants[`c${counter}`]) {
        data.fopName = constants[`c${counter}`];
        counter++;
    }
    
    // c4 - edrpou
    if (constants[`c${counter}`]) {
        data.edrpou = constants[`c${counter}`];
        counter++;
    }
    
    // c5 - iban
    if (constants[`c${counter}`]) {
        data.iban = constants[`c${counter}`];
        counter++;
    }
    
    // c6 - bankName
    if (constants[`c${counter}`]) {
        data.bankName = constants[`c${counter}`];
        counter++;
    }
    
    // c7 - paymentPurpose
    if (constants[`c${counter}`]) {
        data.paymentPurpose = constants[`c${counter}`];
        counter++;
    }
    
    // c8 - cardNumber
    if (constants[`c${counter}`]) {
        data.cardNumber = constants[`c${counter}`];
        counter++;
    }
    
    // c9 - cardBankName
    if (constants[`c${counter}`]) {
        data.cardBankName = constants[`c${counter}`];
        counter++;
    }
    
    // c10 - telegramUsername або telegramPhone
    if (constants[`c${counter}`]) {
        const telegramType = constants[`c${counter}_type`];
        if (telegramType === 'phone') {
            data.telegramPhone = constants[`c${counter}`];
        } else {
            data.telegramUsername = constants[`c${counter}`];
        }
        counter++;
    }
    
    // c11 - viberPhone
    if (constants[`c${counter}`]) {
        data.viberPhone = constants[`c${counter}`];
        counter++;
    }
    
    // c12 - telegramShowcase
    if (constants[`c${counter}`]) {
        data.telegramShowcase = constants[`c${counter}`];
        counter++;
    }
    
    // c13 - instagramUsername
    if (constants[`c${counter}`]) {
        data.instagramUsername = constants[`c${counter}`];
        counter++;
    }
    
    // c14 - biggoLiveUrl
    if (constants[`c${counter}`]) {
        data.biggoLiveUrl = constants[`c${counter}`];
        counter++;
    }
    
    // c15 - facebookPage
    if (constants[`c${counter}`]) {
        data.facebookPage = constants[`c${counter}`];
        counter++;
    }
    
    // c16 - tiktokUsername
    if (constants[`c${counter}`]) {
        data.tiktokUsername = constants[`c${counter}`];
        counter++;
    }
    
    // c17 - youtubeChannel
    if (constants[`c${counter}`]) {
        data.youtubeChannel = constants[`c${counter}`];
        counter++;
    }
    
    // c18 - whatsappPhone
    if (constants[`c${counter}`]) {
        data.whatsappPhone = constants[`c${counter}`];
        counter++;
    }
    
    // c19 - googleCalendarUrl
    if (constants[`c${counter}`]) {
        data.googleCalendarUrl = constants[`c${counter}`];
        counter++;
    }
    
    // c20+ - storeLocations (масив локацій)
    if (constants[`c${counter}_count`]) {
        const count = parseInt(constants[`c${counter}_count`]);
        data.storeLocations = [];
        for (let i = 0; i < count; i++) {
            const char = String.fromCharCode(97 + i); // a, b, c, ...
            if (constants[`c${counter}${char}`]) {
                const locationData = constants[`c${counter}${char}`].split('|');
                if (locationData.length === 2) {
                    data.storeLocations.push({
                        name: locationData[0],
                        url: locationData[1]
                    });
                }
            }
        }
        counter++;
    }
    
    // paymentOptions (масив)
    if (constants[`c${counter}_count`]) {
        const count = parseInt(constants[`c${counter}_count`]);
        data.paymentOptions = [];
        for (let i = 0; i < count; i++) {
            const char = String.fromCharCode(97 + i); // a, b, c, ...
            if (constants[`c${counter}${char}`]) {
                data.paymentOptions.push(constants[`c${counter}${char}`]);
            }
        }
        counter++;
    }
    
    // deliveryMethod
    if (constants[`c${counter}`]) {
        data.deliveryMethod = constants[`c${counter}`];
        counter++;
    }
    
    // deliveryTime
    if (constants[`c${counter}`]) {
        data.deliveryTime = constants[`c${counter}`];
        counter++;
    }
    
    // deliveryNote
    if (constants[`c${counter}`]) {
        data.deliveryNote = constants[`c${counter}`];
        counter++;
    }
    
    // exchangeDays
    if (constants[`c${counter}`]) {
        data.exchangeDays = parseInt(constants[`c${counter}`]) || 0;
        counter++;
    }
    
    // returnDays
    if (constants[`c${counter}`]) {
        data.returnDays = parseInt(constants[`c${counter}`]) || 0;
        counter++;
    }
    
    // returnConditions (масив)
    if (constants[`c${counter}_count`]) {
        const count = parseInt(constants[`c${counter}_count`]);
        data.returnConditions = [];
        for (let i = 0; i < count; i++) {
            const char = String.fromCharCode(97 + i); // a, b, c, ...
            if (constants[`c${counter}${char}`]) {
                data.returnConditions.push(constants[`c${counter}${char}`]);
            }
        }
        counter++;
    }
    
    // returnMoneyTime
    if (constants[`c${counter}`]) {
        data.returnMoneyTime = constants[`c${counter}`];
        counter++;
    }
    
    // returnDeliveryCost
    if (constants[`c${counter}`]) {
        data.returnDeliveryCost = constants[`c${counter}`];
        counter++;
    }
    
    // afterPaymentTemplate
    if (constants[`c${counter}`]) {
        data.afterPaymentTemplate = constants[`c${counter}`].replace(/\\n/g, '\n');
        counter++;
    }
    
    return data;
}

/**
 * Обробляє дані клієнта та встановлює глобальні константи
 * Викликається автоматично при завантаженні сторінки
 */
function processClientData() {
    // Перевіряємо, чи є CLIENT_CONSTANTS (простий текст з псевдонімами)
    if (typeof CLIENT_CONSTANTS !== 'undefined' && CLIENT_CONSTANTS) {
        // Якщо є простий текст з константами, парсимо його
        const parsedData = parseClientConstants(CLIENT_CONSTANTS);
        window.CLIENT_DATA = parsedData;
    }
    
    // Перевіряємо, чи дані клієнта визначені
    if (typeof CLIENT_DATA === 'undefined') {
        console.error('CLIENT_DATA не визначено. Переконайтеся, що дані клієнта завантажені.');
        return;
    }
    
    const data = CLIENT_DATA;
    
    // Встановлюємо глобальні константи з даних клієнта
    window.SHOP_NAME = data.shopName || '';
    window.SHOP_DESCRIPTION = data.shopDescription || '';
    window.FOP_NAME = data.fopName || '';
    window.EDRPOU = data.edrpou || '';
    window.IBAN = data.iban || '';
    window.BANK_NAME = data.bankName || '';
    window.PAYMENT_PURPOSE = data.paymentPurpose || '';
    
    // Контакти
    // Telegram може бути username або номер телефону
    if (data.telegramPhone) {
        // Якщо є номер телефону, використовуємо його
        window.TELEGRAM_PHONE = data.telegramPhone;
        window.TELEGRAM_USERNAME = ''; // Очищаємо username
    } else {
        // Якщо є username, використовуємо його
        window.TELEGRAM_USERNAME = data.telegramUsername || '';
        window.TELEGRAM_PHONE = '';
    }
    window.VIBER_PHONE = data.viberPhone || '';
    window.TELEGRAM_SHOWCASE = data.telegramShowcase || '';
    window.INSTAGRAM_USERNAME = data.instagramUsername || '';
    window.BIGGO_LIVE_URL = data.biggoLiveUrl || '';
    window.FACEBOOK_PAGE = data.facebookPage || '';
    window.TIKTOK_USERNAME = data.tiktokUsername || '';
    window.YOUTUBE_CHANNEL = data.youtubeChannel || '';
    window.WHATSAPP_PHONE = data.whatsappPhone || '';
    
    // Календар
    window.GOOGLE_CALENDAR_URL_OR_ID = data.googleCalendarUrl || '';
    window.GOOGLE_CALENDAR_API_KEY = data.googleCalendarApiKey || '';
    
    // Локації магазинів на Google Maps
    window.STORE_LOCATIONS = data.storeLocations || [];
    
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

