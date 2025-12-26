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
    // Перевіряємо формат: UA + 2 цифри (контрольна сума) + 4 символи (код банку, може бути літери або цифри) + 19 або 21 цифра (номер рахунку)
    // Формат: UA + 2 цифри + 4 символи (літери або цифри) + 19 або 21 цифра
    // Перевіряємо обидва варіанти: 19 або 21 цифра після коду банку
    return /^UA\d{2}[A-Z0-9]{4}\d{19}$/i.test(cleaned) || /^UA\d{2}[A-Z0-9]{4}\d{21}$/i.test(cleaned);
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
    // Розбиваємо на рядки, фільтруємо порожні та обробляємо пробіли
    const lines = constantsText.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//')); // Видаляємо порожні рядки та коментарі
    const constants = {};
    
    // Парсимо всі константи
    lines.forEach(line => {
        // Більш гнучкий регулярний вираз, який обробляє різні формати
        // Дозволяє пробіли на початку, після "c", перед і після "-"
        const match = line.match(/^\s*c(\d+)([a-z]|_count|_type)?\s*-\s*(.+)$/);
        if (match) {
            const num = match[1];
            const suffix = match[2] || '';
            const value = match[3].trim();
            const key = `c${num}${suffix}`;
            constants[key] = value;
        } else {
            // Додатковий лог для діагностики (можна видалити після тестування)
            console.warn('Не вдалося розпарсити рядок:', line);
        }
    });
    
    // Мапінг констант на поля CLIENT_DATA
    // Кожна константа закріплена за конкретним полем за фіксованим номером
    
    // c1 - shopName
    if (constants['c1']) {
        data.shopName = constants['c1'];
    }
    
    // c2 - shopDescription
    if (constants['c2']) {
        data.shopDescription = constants['c2'];
    }
    
    // c3 - workingHours
    if (constants['c3']) {
        data.workingHours = constants['c3'];
    }
    
    // c4 - categories (масив)
    if (constants['c4_count']) {
        const count = parseInt(constants['c4_count']);
        data.categories = [];
        for (let i = 0; i < count; i++) {
            const char = String.fromCharCode(97 + i); // a, b, c, ...
            if (constants[`c4${char}`]) {
                data.categories.push(constants[`c4${char}`]);
            }
        }
    }
    
    // c5 - fopName
    if (constants['c5']) {
        data.fopName = constants['c5'];
    }
    
    // c6 - edrpou
    if (constants['c6']) {
        data.edrpou = constants['c6'];
    }
    
    // c7 - iban
    if (constants['c7']) {
        data.iban = constants['c7'];
    }
    
    // c8 - bankName
    if (constants['c8']) {
        data.bankName = constants['c8'];
    }
    
    // c9 - paymentPurpose
    if (constants['c9']) {
        data.paymentPurpose = constants['c9'];
    }
    
    // c10 - cardNumber
    if (constants['c10']) {
        data.cardNumber = constants['c10'];
    }
    
    // c11 - cardHolderName
    if (constants['c11']) {
        data.cardHolderName = constants['c11'];
    }
    
    // c12 - cardBankName
    if (constants['c12']) {
        data.cardBankName = constants['c12'];
    }
    
    // c13 - telegramUsername або telegramPhone
    if (constants['c13']) {
        const telegramType = constants['c13_type'];
        if (telegramType === 'phone') {
            data.telegramPhone = constants['c13'];
        } else {
            data.telegramUsername = constants['c13'];
        }
    }
    
    // c14 - viberPhone
    if (constants['c14']) {
        data.viberPhone = constants['c14'];
    }
    
    // c15 - telegramShowcase
    if (constants['c15']) {
        data.telegramShowcase = constants['c15'];
    }
    
    // c16 - instagramUsername
    if (constants['c16']) {
        data.instagramUsername = constants['c16'];
    }
    
    // c17 - biggoLiveUrl
    if (constants['c17']) {
        data.biggoLiveUrl = constants['c17'];
    }
    
    // c18 - facebookPage
    if (constants['c18']) {
        data.facebookPage = constants['c18'];
    }
    
    // c19 - tiktokUsername
    if (constants['c19']) {
        data.tiktokUsername = constants['c19'];
    }
    
    // c20 - youtubeChannel
    if (constants['c20']) {
        data.youtubeChannel = constants['c20'];
    }
    
    // c21 - whatsappPhone
    if (constants['c21']) {
        data.whatsappPhone = constants['c21'];
    }
    
    // c22 - googleCalendarUrl
    if (constants['c22']) {
        data.googleCalendarUrl = constants['c22'];
    }
    
    // c23 - storeLocations (масив локацій)
    if (constants['c23_count']) {
        const count = parseInt(constants['c23_count']);
        data.storeLocations = [];
        for (let i = 0; i < count; i++) {
            const char = String.fromCharCode(97 + i); // a, b, c, ...
            if (constants[`c23${char}`]) {
                const locationData = constants[`c23${char}`].split('|');
                if (locationData.length === 2) {
                    data.storeLocations.push({
                        name: locationData[0],
                        url: locationData[1]
                    });
                }
            }
        }
    }
    
    // c24 - paymentOptions (масив)
    if (constants['c24_count']) {
        const count = parseInt(constants['c24_count']);
        data.paymentOptions = [];
        for (let i = 0; i < count; i++) {
            const char = String.fromCharCode(97 + i); // a, b, c, ...
            if (constants[`c24${char}`]) {
                data.paymentOptions.push(constants[`c24${char}`]);
            }
        }
    }
    
    // c25 - deliveryMethod
    if (constants['c25']) {
        data.deliveryMethod = constants['c25'];
    }
    
    // c26 - deliveryTime
    if (constants['c26']) {
        data.deliveryTime = constants['c26'];
    }
    
    // c27 - deliveryNote
    if (constants['c27']) {
        data.deliveryNote = constants['c27'];
    }
    
    // c28 - exchangeDays
    if (constants['c28']) {
        data.exchangeDays = parseInt(constants['c28']) || 0;
    }
    
    // c29 - returnDays
    if (constants['c29']) {
        data.returnDays = parseInt(constants['c29']) || 0;
    }
    
    // c30 - returnConditions (масив)
    if (constants['c30_count']) {
        const count = parseInt(constants['c30_count']);
        data.returnConditions = [];
        for (let i = 0; i < count; i++) {
            const char = String.fromCharCode(97 + i); // a, b, c, ...
            if (constants[`c30${char}`]) {
                data.returnConditions.push(constants[`c30${char}`]);
            }
        }
    }
    
    // c31 - returnMoneyTime
    if (constants['c31']) {
        data.returnMoneyTime = constants['c31'];
    }
    
    // c32 - returnDeliveryCost
    if (constants['c32']) {
        data.returnDeliveryCost = constants['c32'];
    }
    
    // c33 - afterPaymentTemplate
    if (constants['c33']) {
        data.afterPaymentTemplate = constants['c33'].replace(/\\n/g, '\n');
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
    window.WORKING_HOURS = data.workingHours || '';
    window.CATEGORIES = data.categories || [];
    window.FOP_NAME = data.fopName || '';
    window.EDRPOU = data.edrpou || '';
    window.IBAN = data.iban || '';
    window.BANK_NAME = data.bankName || '';
    window.PAYMENT_PURPOSE = data.paymentPurpose || '';
    
    // Оплата на картку
    window.CARD_NUMBER = data.cardNumber || '';
    window.CARD_HOLDER_NAME = data.cardHolderName || '';
    window.CARD_BANK_NAME = data.cardBankName || '';
    
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

