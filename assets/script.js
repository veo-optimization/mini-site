// Функція для форматування номера
function formatPhoneNumber(phoneNumber) {
    if (phoneNumber.length === 10 && phoneNumber.startsWith('0')) {
        return "+380" + phoneNumber.substring(1);
    }
    return phoneNumber;
}

// Функція для створення Viber URL
function createViberUrl(phoneNumber) {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    return `viber://chat?number=${encodeURIComponent(formattedNumber)}`;
}

// Функція для копіювання в буфер обміну
function copyToClipboard(text, buttonId, successMessage, skipButtonChange) {
    if (!checkSecurity()) return;
    navigator.clipboard.writeText(text).then(function() {
        // Якщо skipButtonChange = true, не змінюємо кнопку (для соціальних мереж, де є бейдж)
        if (!skipButtonChange) {
            const button = document.getElementById(buttonId);
            if (button) {
                // Зберігаємо всі оригінальні значення
                const originalHTML = button.innerHTML;
                const originalBackground = button.style.background || '';
                const originalColor = button.style.color || '';
                
                // Зберігаємо всі розміри та стилі
                const computedStyle = window.getComputedStyle(button);
                const originalWidth = computedStyle.width;
                const originalHeight = computedStyle.height;
                const originalMinWidth = computedStyle.minWidth;
                const originalMinHeight = computedStyle.minHeight;
                const originalPadding = computedStyle.padding;
                const originalBoxSizing = computedStyle.boxSizing;
                
                // Змінюємо текст та колір кнопки
                if (successMessage) {
                    button.innerHTML = successMessage;
                } else {
                    button.innerHTML = '✓ Скопійовано!';
                }
                button.style.background = '#2196F3';
                button.style.color = '#ffffff';
                
                // Фіксуємо всі розміри, щоб кнопка не змінювалася
                button.style.width = originalWidth;
                button.style.height = originalHeight;
                button.style.minWidth = originalMinWidth;
                button.style.minHeight = originalMinHeight;
                button.style.padding = originalPadding;
                button.style.boxSizing = originalBoxSizing;
                
                // Повертаємо оригінальний вигляд через 2 секунди
                setTimeout(function() {
                    button.innerHTML = originalHTML;
                    button.style.background = originalBackground;
                    button.style.color = originalColor;
                    button.style.width = '';
                    button.style.height = '';
                    button.style.minWidth = '';
                    button.style.minHeight = '';
                    button.style.padding = '';
                    button.style.boxSizing = '';
                }, 2000);
            }
        }
    }).catch(function(err) {
        alert('Не вдалося скопіювати');
    });
}

function copyIBAN() {
    copyToClipboard(IBAN, 'copyIbanButton', '✓ IBAN скопійовано', false);
}

function copyEDRPOU() {
    copyToClipboard(EDRPOU, 'copyEdrpouButton', '✓ ЄДРПОУ скопійовано', false);
}

function copyPaymentPurpose() {
    copyToClipboard(PAYMENT_PURPOSE, 'copyPurposeButton', '✓ Призначення скопійовано');
}

function copyTelegramUsername() {
    if (!checkSecurity()) return;
    if (typeof TELEGRAM_PHONE !== 'undefined' && TELEGRAM_PHONE) {
        // Якщо є номер телефону, копіюємо номер
        const phone = formatPhoneNumber(TELEGRAM_PHONE);
        copyToClipboard(phone, 'copyTelegramButton', '', true);
        showCopySuccess('telegramCopyBadge');
    } else if (typeof TELEGRAM_USERNAME !== 'undefined' && TELEGRAM_USERNAME) {
        // Якщо є username, копіюємо username
        copyToClipboard('@' + TELEGRAM_USERNAME, 'copyTelegramButton', '', true);
        showCopySuccess('telegramCopyBadge');
    }
}

function copyViberPhone() {
    if (!checkSecurity()) return;
    const formattedNumber = formatPhoneNumber(VIBER_PHONE);
    copyToClipboard(formattedNumber, 'copyViberPhoneButton', '', true);
    showCopySuccess('viberCopyBadge');
}

// ============================================
// МОДАЛЬНЕ ВІКНО ДЛЯ КОНТАКТІВ
// ============================================

let currentContactData = null;

function showContactModal(messengerName, contactValue, contactType) {
    if (!checkSecurity()) return;
    
    // Для BIGGO LIVE показуємо юзернейм замість повного URL
    let displayValue = contactValue;
    if (contactType === 'biggo' && BIGGO_LIVE_URL) {
        const username = getBiggoLiveUsername();
        displayValue = username || contactValue;
    }
    
    currentContactData = {
        name: messengerName,
        value: contactValue, // Зберігаємо повне посилання для копіювання/відкриття
        displayValue: displayValue, // Для відображення
        type: contactType
    };
    
    const modal = document.getElementById('contactModal');
    const modalTitle = document.getElementById('modalMessengerName');
    const modalValue = document.getElementById('modalContactValue');
    const modalIcon = document.getElementById('modalIcon');
    const modalOpenBtn = document.querySelector('.modal-open-btn');
    
    modalTitle.textContent = messengerName;
    
    // Для BIGGO LIVE показуємо юзернейм та інструкцію
    if (contactType === 'biggo' && BIGGO_LIVE_URL) {
        const username = getBiggoLiveUsername();
        modalValue.innerHTML = '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 12px;">' + (username || '') + '</div><div style="font-size: 13px; color: #b0b0b0; line-height: 1.5;">Скопіюйте юзернейм та знайдіть користувача в додатку BIGGO LIVE</div></div>';
        // Приховуємо кнопку "Відкрити" для BIGGO LIVE
        if (modalOpenBtn) {
            modalOpenBtn.style.display = 'none';
        }
    } else {
        modalValue.textContent = displayValue;
        // Показуємо кнопку "Відкрити" для інших типів
        if (modalOpenBtn) {
            modalOpenBtn.style.display = 'flex';
        }
    }
    
    // Встановлюємо іконку в залежності від типу
    if (contactType === 'telegram') {
        modalIcon.innerHTML = '<img src="https://simpleicons.org/icons/telegram.svg" alt="Telegram" width="32" height="32">';
    } else if (contactType === 'viber') {
        modalIcon.innerHTML = '<img src="https://simpleicons.org/icons/viber.svg" alt="Viber" width="32" height="32">';
    } else if (contactType === 'instagram') {
        modalIcon.innerHTML = '<img src="https://simpleicons.org/icons/instagram.svg" alt="Instagram" width="32" height="32">';
    } else if (contactType === 'biggo') {
        // Використовуємо букву "B" для BIGGO LIVE
        modalIcon.innerHTML = '<div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #FF6B35; border-radius: 8px; color: white; font-weight: 700; font-size: 20px; font-family: Arial, sans-serif;">B</div>';
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        currentContactData = null;
    }, 300);
}

function modalCopyContact() {
    if (!currentContactData || !checkSecurity()) return;
    let textToCopy = currentContactData.value;
    
    // Для BIGGO LIVE копіюємо тільки чистий юзернейм (без @)
    if (currentContactData.type === 'biggo') {
        const username = getBiggoLiveUsername();
        textToCopy = username || currentContactData.value;
    } else if (currentContactData.type === 'telegram' && (textToCopy.includes('t.me/+') || textToCopy.includes('@'))) {
        // Для Telegram invite links копіюємо повне посилання
        if (textToCopy.includes('t.me/+')) {
            // Це invite link - переконуємося, що це повне посилання
            if (!textToCopy.startsWith('http')) {
                textToCopy = 'https://' + textToCopy.replace(/^t\.me/, 't.me');
            }
        }
    }
    secureCopy(textToCopy, 'modalCopyButton', '✓ Скопійовано!', false);
}

function modalOpenContact() {
    if (!currentContactData || !checkSecurity()) return;
    
    if (currentContactData.type === 'telegram') {
        // Перевіряємо, чи це invite link, номер телефону або username
        if (currentContactData.value.includes('t.me/') || currentContactData.value.startsWith('http')) {
            // Це посилання (invite link або повне посилання)
            const link = currentContactData.value.startsWith('http') ? currentContactData.value : 'https://' + currentContactData.value;
            window.open(link, '_blank');
        } else if (currentContactData.value.match(/^\+?\d{10,}$/)) {
            // Це номер телефону
            const phone = formatPhoneNumber(currentContactData.value);
            window.open('https://t.me/+' + phone.replace('+', ''), '_blank');
        } else {
            // Це username
            window.open('https://t.me/' + currentContactData.value.replace('@', ''), '_blank');
        }
    } else if (currentContactData.type === 'viber') {
        const viberUrl = createViberUrl(currentContactData.value.replace('+380', '0').replace(/\s/g, ''));
        window.location.href = viberUrl;
    } else if (currentContactData.type === 'instagram') {
        window.open('https://instagram.com/' + currentContactData.value.replace('@', ''), '_blank');
    } else if (currentContactData.type === 'biggo') {
        // Для BIGGO LIVE не відкриваємо посилання, а показуємо модальне вікно з юзернеймом
        // Модальне вікно вже відкрите, тому просто не закриваємо його
        return;
    }
    
    closeContactModal();
}

function openTelegram() {
    if (!checkSecurity()) return;
    if (typeof TELEGRAM_PHONE !== 'undefined' && TELEGRAM_PHONE) {
        // Якщо є номер телефону, використовуємо посилання з номером
        const phone = formatPhoneNumber(TELEGRAM_PHONE);
        window.open('https://t.me/+' + phone.replace('+', ''), '_blank');
    } else if (typeof TELEGRAM_USERNAME !== 'undefined' && TELEGRAM_USERNAME) {
        // Якщо є username, використовуємо стандартне посилання
        window.open('https://t.me/' + TELEGRAM_USERNAME, '_blank');
    }
}

function openViber() {
    if (!checkSecurity()) return;
    const viberUrl = createViberUrl(VIBER_PHONE.replace('+380', '0').replace(/\s/g, ''));
    window.location.href = viberUrl;
}

// Функція для визначення, чи є посилання invite link
function isTelegramInviteLink(link) {
    if (!link) return false;
    return link.includes('t.me/+') || link.startsWith('https://t.me/+') || link.startsWith('t.me/+');
}

// Функція для отримання повного посилання Telegram
function getTelegramShowcaseLink() {
    if (!TELEGRAM_SHOWCASE) return null;
    if (isTelegramInviteLink(TELEGRAM_SHOWCASE)) {
        // Якщо це вже повне посилання, повертаємо як є
        if (TELEGRAM_SHOWCASE.startsWith('http')) {
            return TELEGRAM_SHOWCASE;
        }
        // Якщо без https://, додаємо
        return 'https://' + TELEGRAM_SHOWCASE.replace(/^t\.me/, 't.me');
    }
    // Якщо це username, формуємо стандартне посилання
    return 'https://t.me/' + TELEGRAM_SHOWCASE;
}

// Функція для отримання тексту для відображення/копіювання
function getTelegramShowcaseDisplayText() {
    if (!TELEGRAM_SHOWCASE) return null;
    if (isTelegramInviteLink(TELEGRAM_SHOWCASE)) {
        return getTelegramShowcaseLink();
    }
    return '@' + TELEGRAM_SHOWCASE;
}

function openTelegramShowcase() {
    if (!checkSecurity() || !TELEGRAM_SHOWCASE) return;
    const link = getTelegramShowcaseLink();
    if (link) {
        window.open(link, '_blank');
    }
}

function copyTelegramShowcase() {
    if (!checkSecurity() || !TELEGRAM_SHOWCASE) return;
    const textToCopy = getTelegramShowcaseLink();
    if (textToCopy) {
        secureCopy(textToCopy, 'copyTelegramShowcaseButton', '', true);
        showCopySuccess('showcaseCopyBadge');
    }
}

function openInstagram() {
    if (!checkSecurity() || !INSTAGRAM_USERNAME) return;
    window.open('https://instagram.com/' + INSTAGRAM_USERNAME, '_blank');
}

function copyInstagramUsername() {
    if (!checkSecurity() || !INSTAGRAM_USERNAME) return;
    secureCopy('@' + INSTAGRAM_USERNAME, 'copyInstagramButton', '', true);
    showCopySuccess('instagramCopyBadge');
}

// Функція для витягування юзернейму з URL BIGGO LIVE
function getBiggoLiveUsername() {
    if (!BIGGO_LIVE_URL) return '';
    try {
        const url = new URL(BIGGO_LIVE_URL);
        const pathParts = url.pathname.split('/');
        const userIndex = pathParts.indexOf('user');
        if (userIndex !== -1 && pathParts[userIndex + 1]) {
            return pathParts[userIndex + 1];
        }
        // Якщо формат інший, спробуємо витягти останню частину
        return pathParts[pathParts.length - 1] || '';
    } catch (e) {
        // Якщо не вдалося розпарсити URL, спробуємо регулярний вираз
        const match = BIGGO_LIVE_URL.match(/\/user\/([^\/\?]+)/);
        return match ? match[1] : '';
    }
}

function openBiggoLive() {
    if (!checkSecurity() || !BIGGO_LIVE_URL) return;
    // Для BIGGO LIVE показуємо модальне вікно з можливістю скопіювати юзернейм
    const username = getBiggoLiveUsername();
    if (username) {
        showContactModal('BIGGO LIVE', BIGGO_LIVE_URL, 'biggo');
    }
}

function copyBiggoLive() {
    if (!checkSecurity() || !BIGGO_LIVE_URL) return;
    secureCopy(BIGGO_LIVE_URL, 'copyBiggoLiveButton', '', true);
    showCopySuccess('biggoLiveCopyBadge');
}

function showCopySuccess(badgeId) {
    const badge = document.getElementById(badgeId);
    if (badge) {
        badge.classList.add('show');
        setTimeout(function() {
            badge.classList.remove('show');
        }, 2000);
    }
}

// ============================================
// СИСТЕМА ЗАХИСТУ КОДУ
// ============================================

// Функція перевірки безпеки
function checkSecurity() {
    try {
        // Перевірка footer
        const footerCredit = document.getElementById('footerCreditBlock');
        if (!footerCredit || footerCredit.offsetParent === null) {
            blockPage();
            return false;
        }
        
        // Перевірка наявності тексту про автора
        const footerText = footerCredit.textContent || '';
        if (!footerText.includes('VEO FORCE') || !footerText.includes('2025')) {
            blockPage();
            return false;
        }
        
        // Перевірка якорів
        const anchors = [
            'veoAnchor1', 'veoAnchor2', 'veoAnchor3', 
            'veoAnchor4', 'veoAnchor5', 'veoAnchor6'
        ];
        
        for (let i = 0; i < anchors.length; i++) {
            const anchor = document.getElementById(anchors[i]);
            if (!anchor) {
                blockPage();
                return false;
            }
            
            // Перевірка тексту якоря
            const anchorText = anchor.textContent || anchor.innerText || '';
            if (anchorText.trim() !== 'VEO FORCE') {
                blockPage();
                return false;
            }
            
            // Перевірка, що елемент не прихований через display:none
            const style = window.getComputedStyle(anchor);
            if (style.display === 'none' || style.visibility === 'hidden') {
                blockPage();
                return false;
            }
        }
        
        return true;
    } catch (e) {
        blockPage();
        return false;
    }
}

// Блокування сторінки
function blockPage() {
    // Блокуємо всі функції
    window.copyToClipboard = function() { return false; };
    window.openTelegram = function() { return false; };
    window.openViber = function() { return false; };
    window.copyIBAN = function() { return false; };
    window.copyEDRPOU = function() { return false; };
    window.copyPaymentPurpose = function() { return false; };
    window.copyTelegramUsername = function() { return false; };
    window.copyViberPhone = function() { return false; };
    window.openTelegramShowcase = function() { return false; };
    window.copyTelegramShowcase = function() { return false; };
    window.openInstagram = function() { return false; };
    window.copyInstagramUsername = function() { return false; };
    
    // Показуємо повідомлення про помилку
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#E8E8E8;font-family:Montserrat,sans-serif;"><div style="text-align:center;padding:40px;background:white;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.2);"><h1 style="color:#d32f2f;margin-bottom:20px;">⚠️ Помилка завантаження</h1><p style="color:#666;font-size:18px;">Сторінка пошкоджена або модифікована.<br>Будь ласка, використовуйте оригінальну версію.</p></div></div>';
}

// Перевірка безпеки перед виконанням функцій
function secureCopy(text, buttonId, successMessage, skipButtonChange) {
    if (!checkSecurity()) return;
    copyToClipboard(text, buttonId, successMessage, skipButtonChange);
}

// Оригінальні функції копіювання з захистом
function copyIBAN() {
    if (!checkSecurity()) return;
    secureCopy(IBAN, 'copyIbanButton');
}

function copyEDRPOU() {
    if (!checkSecurity()) return;
    secureCopy(EDRPOU, 'copyEdrpouButton');
}

function copyPaymentPurpose() {
    if (!checkSecurity()) return;
    secureCopy(PAYMENT_PURPOSE, 'copyPurposeButton', '✓ Призначення скопійовано', false);
}

function copyPaymentTemplate() {
    if (!checkSecurity()) return;
    const templateElement = document.getElementById('paymentTemplateDisplay');
    if (!templateElement) {
        console.error('Шаблон не знайдено');
        return;
    }
    const templateText = templateElement.innerText || templateElement.textContent || (typeof AFTER_PAYMENT_TEMPLATE !== 'undefined' ? AFTER_PAYMENT_TEMPLATE : '');
    if (templateText) {
        copyToClipboard(templateText, 'copyTemplateButton', '✓ Шаблон скопійовано', false);
    } else {
        alert('Шаблон порожній');
    }
}

// ============================================
// КАЛЕНДАР ПРЯМИХ ЕФІРІВ
// ============================================

// Функція витягування Calendar ID з URL
function extractCalendarId(urlOrId) {
    if (!urlOrId) {
        console.error('extractCalendarId: URL не надано');
        return null;
    }
    
    console.log('extractCalendarId: обробка URL:', urlOrId);
    
    // Якщо це вже Calendar ID (містить @), повертаємо як є
    if (urlOrId.includes('@') && !urlOrId.startsWith('http')) {
        console.log('extractCalendarId: знайдено Calendar ID без URL');
        return urlOrId;
    }
    
    // Якщо це URL, витягуємо Calendar ID
    try {
        // Для embed URL: https://calendar.google.com/calendar/embed?src=...
        if (urlOrId.includes('/embed?')) {
            const url = new URL(urlOrId);
            const src = url.searchParams.get('src');
            if (src) {
                const calendarId = decodeURIComponent(src);
                console.log('extractCalendarId: витягнуто з embed URL:', calendarId);
                return calendarId;
            }
        }
        
        // Для iCal URL: https://calendar.google.com/calendar/ical/.../public/basic.ics
        if (urlOrId.includes('/ical/')) {
            // Витягуємо Calendar ID з URL (між /ical/ та /public/)
            // Може бути закодований (%40 замість @)
            const match = urlOrId.match(/\/ical\/([^\/]+)\//);
            if (match && match[1]) {
                // Декодуємо URL-кодування
                let calendarId = decodeURIComponent(match[1]);
                console.log('extractCalendarId: витягнуто з iCal URL (після декодування):', calendarId);
                
                // Перевіряємо, чи містить @ (якщо ні, можливо потрібно додати @group.calendar.google.com)
                if (!calendarId.includes('@')) {
                    console.warn('extractCalendarId: Calendar ID не містить @, можливо неповний');
                }
                
                return calendarId;
            } else {
                console.error('extractCalendarId: не вдалося знайти Calendar ID в iCal URL');
            }
        }
        
        // Якщо це простий Calendar ID
        console.log('extractCalendarId: повертаємо як простий Calendar ID');
        return urlOrId;
    } catch (e) {
        console.error('extractCalendarId: помилка парсингу URL:', e);
        console.error('extractCalendarId: stack:', e.stack);
        return null;
    }
}

// Завантаження подій з Google Calendar
async function loadCalendarEvents() {
    // Завжди показуємо блок календаря
    const calendarSection = document.getElementById('calendarSection');
    if (calendarSection) {
        calendarSection.style.display = 'block';
    }
    
    if (!GOOGLE_CALENDAR_URL_OR_ID || GOOGLE_CALENDAR_URL_OR_ID.trim() === '') {
        console.log('Calendar URL не вказано');
        showCalendarNotSynced();
        return;
    }
    
    const calendarIdRaw = extractCalendarId(GOOGLE_CALENDAR_URL_OR_ID);
    if (!calendarIdRaw) {
        console.error('Не вдалося витягти Calendar ID з:', GOOGLE_CALENDAR_URL_OR_ID);
        showCalendarNotSynced();
        return;
    }
    
    console.log('✅ Calendar ID витягнуто:', calendarIdRaw);
    
    // Перевіряємо, чи Calendar ID містить @ (повинен бути формат: id@group.calendar.google.com)
    if (!calendarIdRaw.includes('@')) {
        console.warn('⚠️ Calendar ID не містить @, можливо неповний:', calendarIdRaw);
    }
    
    const calendarId = encodeURIComponent(calendarIdRaw);
    console.log('📝 Calendar ID закодовано:', calendarId);
    
    try {
        // Спочатку спробуємо через Google Calendar API (якщо є ключ)
        if (GOOGLE_CALENDAR_API_KEY) {
            const now = new Date();
            const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
            
            const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
                `timeMin=${now.toISOString()}&` +
                `timeMax=${fiveDaysLater.toISOString()}&` +
                `singleEvents=true&` +
                `orderBy=startTime&` +
                `maxResults=50&` +
                `key=${GOOGLE_CALENDAR_API_KEY}`;
            
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.items && data.items.length > 0) {
                    displayCalendarEvents(data.items);
                    document.getElementById('calendarSection').style.display = 'block';
                    
                    return;
                }
            }
        }
        
        // Якщо API не працює або немає ключа, використовуємо iCal feed
        // Використовуємо оригінальний URL, якщо він вже iCal, інакше формуємо
        let icalUrl;
        if (GOOGLE_CALENDAR_URL_OR_ID.includes('/ical/') && GOOGLE_CALENDAR_URL_OR_ID.includes('/public/basic.ics')) {
            // Використовуємо оригінальний URL без змін
            icalUrl = GOOGLE_CALENDAR_URL_OR_ID;
            console.log('Використовуємо оригінальний iCal URL:', icalUrl);
        } else {
            // Формуємо iCal URL з Calendar ID
            icalUrl = `https://calendar.google.com/calendar/ical/${calendarId}/public/basic.ics`;
            console.log('Сформовано iCal URL:', icalUrl);
        }
        await loadCalendarFromICal(icalUrl, calendarIdRaw);
        
    } catch (error) {
        console.error('Помилка завантаження календаря:', error);
        console.error('Деталі помилки:', error.message, error.stack);
        // Спробуємо завантажити через iCal як fallback
        try {
            // Використовуємо оригінальний URL, якщо він вже iCal, інакше формуємо
            let icalUrl;
            if (GOOGLE_CALENDAR_URL_OR_ID.includes('/ical/') && GOOGLE_CALENDAR_URL_OR_ID.includes('/public/basic.ics')) {
                icalUrl = GOOGLE_CALENDAR_URL_OR_ID;
            } else {
                icalUrl = `https://calendar.google.com/calendar/ical/${calendarId}/public/basic.ics`;
            }
            console.log('Спроба завантажити через iCal fallback:', icalUrl);
            await loadCalendarFromICal(icalUrl, calendarIdRaw);
        } catch (icalError) {
            console.error('Помилка завантаження через iCal fallback:', icalError);
            console.error('Деталі помилки iCal:', icalError.message);
            showCalendarNotSynced();
        }
    }
}

// Завантаження через iCal feed
async function loadCalendarFromICal(icalUrl, calendarIdRaw) {
    try {
        console.log('Завантаження iCal з URL:', icalUrl);
        
        // Використовуємо прямий запит до публічного календаря Google
        // Публічні календарі доступні без CORS обмежень
        const response = await fetch(icalUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'text/calendar, text/plain, */*'
            }
        });
        
        console.log('Відповідь отримано, статус:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Помилка відповіді:', errorText);
            throw new Error('Не вдалося завантажити календар. Статус: ' + response.status + ', ' + response.statusText);
        }
        
        const icalText = await response.text();
        console.log('iCal завантажено, розмір:', icalText.length);
        console.log('Перші 500 символів iCal:', icalText.substring(0, 500));
        
        const events = parseICal(icalText);
        console.log('Подій знайдено:', events.length);
        if (events.length > 0) {
            console.log('Перша подія:', events[0]);
        }
        
        const calendarSection = document.getElementById('calendarSection');
        if (!calendarSection) {
            console.error('Блок календаря не знайдено в DOM');
            showCalendarNotSynced();
            return;
        }
        
        // Завжди показуємо блок календаря
        calendarSection.style.display = 'block';
        
        if (events.length > 0) {
            displayCalendarEvents(events);
        } else {
            // Показуємо повідомлення якщо подій немає
            const container = document.getElementById('calendarEvents');
            if (container) {
                container.innerHTML = '<div class="calendar-empty" style="text-align: center; padding: 30px; color: #8B6F47; font-size: 16px;">На найближчі 5 днів ефірів не заплановано</div>';
            }
        }
        
    } catch (error) {
        console.error('Помилка завантаження iCal:', error);
        console.error('Деталі помилки:', error.message);
        console.error('Stack trace:', error.stack);
        
        // Показуємо повідомлення про помилку
        const calendarSection = document.getElementById('calendarSection');
        const container = document.getElementById('calendarEvents');
        if (calendarSection) {
            calendarSection.style.display = 'block';
        }
        if (container) {
            container.innerHTML = '<div class="calendar-not-synced" style="text-align: center; padding: 30px; color: #8B6F47; font-size: 18px; font-weight: 600;">📅 Календар LIVE-трансляцій не синхронізовано<br><small style="font-size: 14px; color: #999; margin-top: 10px; display: block;">Помилка: ' + error.message + '</small></div>';
        }
        showCalendarNotSynced();
    }
}

// Парсинг iCal формату
function parseICal(icalText) {
    const events = [];
    const lines = icalText.split('\n');
    let currentEvent = null;
    let inEvent = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === 'BEGIN:VEVENT') {
            inEvent = true;
            currentEvent = {};
        } else if (line === 'END:VEVENT') {
            if (currentEvent && currentEvent.start) {
                try {
                    // Створюємо Date об'єкт з UTC дати
                    const startDate = new Date(currentEvent.start);
                    const now = new Date();
                    
                    console.log('Обробка події:', {
                        summary: currentEvent.summary,
                        start: currentEvent.start,
                        startDate: startDate,
                        now: now
                    });
                    
                    // Перевіряємо, чи дата валідна
                    if (isNaN(startDate.getTime())) {
                        console.warn('Невалідна дата події:', currentEvent.start);
                    } else {
                        // Встановлюємо час на початок дня для правильної фільтрації (локальний час)
                        const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                        const fiveDaysLater = new Date(nowLocal.getTime() + 5 * 24 * 60 * 60 * 1000);
                        fiveDaysLater.setHours(23, 59, 59, 999);
                        
                        // Конвертуємо startDate в локальний час для порівняння
                        const startDateLocal = new Date(startDate.getTime());
                        
                        console.log('Перевірка діапазону:', {
                            startDateLocal: startDateLocal,
                            nowLocal: nowLocal,
                            fiveDaysLater: fiveDaysLater,
                            вДіапазоні: startDateLocal >= nowLocal && startDateLocal <= fiveDaysLater
                        });
                        
                        // Перевіряємо, чи подія в межах 5 днів (включаючи сьогодні)
                        // Також показуємо події, які вже почалися сьогодні
                        if (startDateLocal <= fiveDaysLater) {
                            events.push({
                                summary: currentEvent.summary || 'Подія',
                                start: { dateTime: currentEvent.start },
                                end: { dateTime: currentEvent.end || currentEvent.start }
                            });
                            console.log('Подія додана:', currentEvent.summary);
                        } else {
                            console.log('Подія не в діапазоні 5 днів:', currentEvent.summary);
                        }
                    }
                } catch (e) {
                    console.error('Помилка обробки події:', e, currentEvent);
                }
            }
            inEvent = false;
            currentEvent = null;
        } else if (inEvent && currentEvent) {
            if (line.startsWith('SUMMARY:')) {
                currentEvent.summary = line.substring(8).trim();
            } else if (line.startsWith('DTSTART')) {
                // Може бути DTSTART;VALUE=DATE або DTSTART:...
                const dateStr = line.includes(':') ? line.substring(line.indexOf(':') + 1) : '';
                if (dateStr) {
                    currentEvent.start = parseICalDate(dateStr);
                }
            } else if (line.startsWith('DTEND')) {
                // Може бути DTEND;VALUE=DATE або DTEND:...
                const dateStr = line.includes(':') ? line.substring(line.indexOf(':') + 1) : '';
                if (dateStr) {
                    currentEvent.end = parseICalDate(dateStr);
                }
            } else if (line.startsWith('DESCRIPTION:')) {
                currentEvent.description = line.substring(12).trim();
            }
        }
    }
    
    return events.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime));
}

// Парсинг дати з iCal формату
function parseICalDate(dateStr) {
    // Формат: 20240115T120000Z або 20240115
    if (dateStr.length >= 15 && dateStr.includes('T')) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const hour = dateStr.substring(9, 11);
        const minute = dateStr.substring(11, 13);
        // Якщо дата в UTC (закінчується на Z), конвертуємо в ISO формат з Z
        if (dateStr.endsWith('Z')) {
            return `${year}-${month}-${day}T${hour}:${minute}:00Z`;
        }
        return `${year}-${month}-${day}T${hour}:${minute}:00`;
    } else if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}-${month}-${day}T00:00:00`;
    }
    return dateStr;
}

// Відображення подій календаря
function displayCalendarEvents(events) {
    const container = document.getElementById('calendarEvents');
    container.innerHTML = '';
    
    if (events.length === 0) {
        container.innerHTML = '<div class="calendar-empty">На найближчі 5 днів ефірів не заплановано</div>';
        return;
    }
    
    events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'calendar-event';
        
        const startDate = new Date(event.start.dateTime || event.start.date);
        const endDate = event.end ? new Date(event.end.dateTime || event.end.date) : null;
        
        const dateStr = formatEventDate(startDate);
        const timeStr = formatEventTime(startDate, endDate);
        
        eventDiv.innerHTML = `
            <div class="calendar-event-date">${dateStr}</div>
            <div class="calendar-event-time">${timeStr}</div>
            <div class="calendar-event-title">${event.summary || 'Подія'}</div>
        `;
        
        container.appendChild(eventDiv);
    });
}

// Показ повідомлення про відсутність синхронізації
function showCalendarNotSynced() {
    const calendarSection = document.getElementById('calendarSection');
    const calendarIframe = document.getElementById('calendarIframe');
    const calendarContainer = document.querySelector('.calendar-container');
    
    if (!calendarSection) {
        console.error('Блок календаря не знайдено');
        return;
    }
    
    calendarSection.style.display = 'block';
    
    // Приховуємо iframe та показуємо повідомлення
    if (calendarIframe) {
        calendarIframe.style.display = 'none';
    }
    
    if (calendarContainer) {
        // Створюємо повідомлення про помилку
        let errorDiv = calendarContainer.querySelector('.calendar-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'calendar-error-message';
            errorDiv.style.cssText = 'text-align: center; padding: 30px; color: #8B6F47; font-size: 18px; font-weight: 600; border: 1px solid #FFD89B; border-radius: 15px; background: rgba(255, 243, 205, 0.8); margin-bottom: 25px;';
            calendarContainer.insertBefore(errorDiv, calendarContainer.firstChild);
        }
        errorDiv.innerHTML = '📅 Календар LIVE-трансляцій не синхронізовано';
    }
    
}

// Форматування дати події
function formatEventDate(date) {
    const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 
                  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayName}, ${day} ${month}`;
}

// Форматування часу події
function formatEventTime(startDate, endDate) {
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    
    const startTime = formatTime(startDate);
    
    if (endDate) {
        const endTime = formatTime(endDate);
        return `${startTime} - ${endTime}`;
    }
    
    return startTime;
}

        // Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    // Перевірка безпеки перед ініціалізацією (після завантаження DOM)
    setTimeout(function() {
        if (!checkSecurity()) {
            return;
        }
    }, 200);
    
    // Заповнюємо дані на сторінці
    // Назва магазину
    const shopNameHeader = document.getElementById('shopNameHeader');
    if (shopNameHeader && typeof SHOP_NAME !== 'undefined') {
        shopNameHeader.textContent = SHOP_NAME;
    }
    
    // Опис магазину (якщо є)
    const shopDescriptionEl = document.querySelector('.header p');
    if (shopDescriptionEl && typeof SHOP_DESCRIPTION !== 'undefined' && SHOP_DESCRIPTION) {
        shopDescriptionEl.textContent = SHOP_DESCRIPTION;
    }
    
    // Назва календаря з назвою магазину
    const calendarTitle = document.getElementById('calendarTitle');
    if (calendarTitle && typeof SHOP_NAME !== 'undefined') {
        calendarTitle.textContent = SHOP_NAME + ': Розклад прямих ефірів';
    }
    
    const fopNameEl = document.getElementById('fopName');
    if (fopNameEl && typeof FOP_NAME !== 'undefined') {
        fopNameEl.textContent = FOP_NAME;
    }
    
    const edrpouValueEl = document.getElementById('edrpouValue');
    if (edrpouValueEl && typeof EDRPOU !== 'undefined') {
        edrpouValueEl.textContent = EDRPOU;
    }
    
    const ibanValueEl = document.getElementById('ibanValue');
    if (ibanValueEl && typeof IBAN !== 'undefined') {
        ibanValueEl.textContent = IBAN;
    }
    
    const bankNameEl = document.getElementById('bankName');
    if (bankNameEl && typeof BANK_NAME !== 'undefined') {
        bankNameEl.textContent = BANK_NAME;
    }
    
    const paymentPurposeValueEl = document.getElementById('paymentPurposeValue');
    if (paymentPurposeValueEl && typeof PAYMENT_PURPOSE !== 'undefined') {
        paymentPurposeValueEl.textContent = PAYMENT_PURPOSE;
    }
    
    const telegramUsernameEl = document.getElementById('telegramUsername');
    if (telegramUsernameEl) {
        if (typeof TELEGRAM_PHONE !== 'undefined' && TELEGRAM_PHONE) {
            // Якщо є номер телефону, показуємо його
            telegramUsernameEl.textContent = formatPhoneNumber(TELEGRAM_PHONE);
        } else if (typeof TELEGRAM_USERNAME !== 'undefined' && TELEGRAM_USERNAME) {
            // Якщо є username, показуємо його
            telegramUsernameEl.textContent = '@' + TELEGRAM_USERNAME;
        }
    }
    
    const viberPhoneEl = document.getElementById('viberPhone');
    if (viberPhoneEl && typeof VIBER_PHONE !== 'undefined') {
        viberPhoneEl.textContent = formatPhoneNumber(VIBER_PHONE);
    }
    // Вітрина
    const telegramShowcaseItem = document.getElementById('telegramShowcaseItem');
    if (telegramShowcaseItem) {
        if (typeof TELEGRAM_SHOWCASE !== 'undefined' && TELEGRAM_SHOWCASE) {
            // Визначаємо, чи це invite link
            const telegramShowcaseEl = document.getElementById('telegramShowcase');
            if (telegramShowcaseEl) {
                if (isTelegramInviteLink(TELEGRAM_SHOWCASE)) {
                    telegramShowcaseEl.textContent = 'Телеграм-спільнота';
                } else {
                    telegramShowcaseEl.textContent = '@' + TELEGRAM_SHOWCASE;
                }
            }
            telegramShowcaseItem.style.display = 'flex';
            const telegramShowcaseButtonsEl = document.getElementById('telegramShowcaseButtons');
            if (telegramShowcaseButtonsEl) {
                telegramShowcaseButtonsEl.style.display = 'flex';
            }
            const telegramShowcaseUnavailableEl = document.getElementById('telegramShowcaseUnavailable');
            if (telegramShowcaseUnavailableEl) {
                telegramShowcaseUnavailableEl.style.display = 'none';
            }
        } else {
            // Приховуємо блок, якщо немає даних
            telegramShowcaseItem.style.display = 'none';
        }
    }
    
    // Instagram
    const instagramItem = document.getElementById('instagramItem');
    if (instagramItem) {
        if (typeof INSTAGRAM_USERNAME !== 'undefined' && INSTAGRAM_USERNAME) {
            const instagramUsernameEl = document.getElementById('instagramUsername');
            if (instagramUsernameEl) {
                instagramUsernameEl.textContent = '@' + INSTAGRAM_USERNAME;
            }
            const instagramButtonsEl = document.getElementById('instagramButtons');
            if (instagramButtonsEl) {
                instagramButtonsEl.style.display = 'flex';
            }
            const instagramUnavailableEl = document.getElementById('instagramUnavailable');
            if (instagramUnavailableEl) {
                instagramUnavailableEl.style.display = 'none';
            }
            instagramItem.style.display = 'flex';
        } else {
            // Приховуємо блок, якщо немає даних
            instagramItem.style.display = 'none';
        }
    }
    
    // BIGGO LIVE
    const biggoLiveItem = document.getElementById('biggoLiveItem');
    if (biggoLiveItem) {
        if (typeof BIGGO_LIVE_URL !== 'undefined' && BIGGO_LIVE_URL) {
            const username = getBiggoLiveUsername();
            const biggoLiveValueEl = document.getElementById('biggoLiveValue');
            if (biggoLiveValueEl) {
                biggoLiveValueEl.textContent = username ? '@' + username : BIGGO_LIVE_URL;
            }
            const biggoLiveButtonsEl = document.getElementById('biggoLiveButtons');
            if (biggoLiveButtonsEl) {
                biggoLiveButtonsEl.style.display = 'flex';
            }
            const biggoLiveUnavailableEl = document.getElementById('biggoLiveUnavailable');
            if (biggoLiveUnavailableEl) {
                biggoLiveUnavailableEl.style.display = 'none';
            }
            biggoLiveItem.style.display = 'flex';
        } else {
            // Приховуємо блок, якщо немає даних
            biggoLiveItem.style.display = 'none';
        }
    }
    
    // Перевірка TikTok-браузера та налаштування Intersection Observer для показу popup
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isTikTok = ua.includes("TikTok") || ua.includes("Musical.ly") || ua.includes("Bytedance");
    
    if (isTikTok) {
        // Знаходимо перший видимий елемент контакту
        const contactItems = document.querySelectorAll('.contact-item');
        let firstVisibleContact = null;
        
        // Шукаємо перший елемент, який відображається (не прихований)
        for (let i = 0; i < contactItems.length; i++) {
            const item = contactItems[i];
            const style = window.getComputedStyle(item);
            if (style.display !== 'none' && style.visibility !== 'hidden' && item.offsetParent !== null) {
                firstVisibleContact = item;
                break;
            }
        }
        
        // Якщо знайшли елемент, налаштовуємо Intersection Observer
        if (firstVisibleContact) {
            let popupShown = false;
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (!popupShown && entry.isIntersecting) {
                        const rect = entry.boundingClientRect;
                        const viewportHeight = window.innerHeight;
                        
                        // Перевіряємо, чи елемент повністю з'явився внизу екрану
                        // Елемент вважається видимим, коли його нижня частина видно на екрані
                        const isVisibleAtBottom = rect.bottom <= viewportHeight && rect.bottom > 0;
                        const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
                        
                        // Показуємо popup, коли елемент стає видимим (особливо внизу екрану)
                        if ((isVisibleAtBottom || isFullyVisible) && entry.intersectionRatio >= 0.3) {
                            popupShown = true;
                            document.getElementById('tiktok-popup').style.display = 'flex';
                            // Відключаємо observer після показу popup
                            observer.disconnect();
                        }
                    }
                });
            }, {
                threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0], // Різні рівні видимості
                rootMargin: '0px'
            });
            
            // Починаємо спостерігати за першим елементом контакту
            observer.observe(firstVisibleContact);
        } else {
            // Якщо не знайшли елемент, показуємо popup одразу (fallback)
            document.getElementById('tiktok-popup').style.display = 'flex';
        }
    }
    
    // Заповнюємо умови оплати
    const paymentOptionsContainer = document.getElementById('paymentOptions');
    if (paymentOptionsContainer && typeof PAYMENT_OPTIONS !== 'undefined' && Array.isArray(PAYMENT_OPTIONS)) {
        paymentOptionsContainer.innerHTML = '';
        PAYMENT_OPTIONS.forEach(function(option) {
            const div = document.createElement('div');
            div.className = 'payment-option';
            div.innerHTML = '<strong>' + option + '</strong>';
            paymentOptionsContainer.appendChild(div);
        });
    }
    
    // Заповнюємо умови доставки
    const deliveryMethodEl = document.getElementById('deliveryMethod');
    if (deliveryMethodEl && typeof DELIVERY_METHOD !== 'undefined') {
        deliveryMethodEl.textContent = DELIVERY_METHOD;
    }
    const deliveryTimeEl = document.getElementById('deliveryTime');
    if (deliveryTimeEl && typeof DELIVERY_TIME !== 'undefined') {
        deliveryTimeEl.textContent = DELIVERY_TIME;
    }
    const deliveryNoteEl = document.getElementById('deliveryNote');
    if (deliveryNoteEl && typeof DELIVERY_NOTE !== 'undefined') {
        deliveryNoteEl.textContent = DELIVERY_NOTE;
    }
    
    // Заповнюємо умови обміну та повернення
    const exchangeReturnList = document.getElementById('exchangeReturnList');
    if (!exchangeReturnList) {
        console.warn('Елемент exchangeReturnList не знайдено');
    } else {
        exchangeReturnList.innerHTML = '';
        
        // Додаємо інформацію про обмін, якщо він доступний
        if (typeof EXCHANGE_DAYS !== 'undefined' && EXCHANGE_DAYS > 0) {
            const exchangeLi = document.createElement('li');
            exchangeLi.innerHTML = `🔄 <strong>Обмін:</strong> відповідно до законодавства України, у вас є право на обмін товару протягом <strong>${EXCHANGE_DAYS} днів</strong> з моменту отримання (окрім товарів, визначених законодавством)`;
            exchangeReturnList.appendChild(exchangeLi);
        }
        
        // Додаємо інформацію про повернення, якщо воно доступне
        if (typeof RETURN_DAYS !== 'undefined' && RETURN_DAYS > 0) {
            const returnLi = document.createElement('li');
            returnLi.innerHTML = `↩️ <strong>Повернення:</strong> відповідно до законодавства України, у вас є право на повернення товару протягом <strong>${RETURN_DAYS} днів</strong> з моменту отримання (окрім товарів, визначених законодавством)`;
            exchangeReturnList.appendChild(returnLi);
        }
        
        // Якщо обмін або повернення доступні, додаємо умови
        if ((typeof EXCHANGE_DAYS !== 'undefined' && EXCHANGE_DAYS > 0) || (typeof RETURN_DAYS !== 'undefined' && RETURN_DAYS > 0)) {
            const conditionsLi = document.createElement('li');
            conditionsLi.innerHTML = `👕 <strong>Умови обміну/повернення одягу та аксесуарів:</strong>`;
            const conditionsUl = document.createElement('ul');
            conditionsUl.style.marginTop = '8px';
            conditionsUl.style.paddingLeft = '20px';
            conditionsUl.style.fontSize = '15px';
            if (typeof RETURN_CONDITIONS !== 'undefined' && Array.isArray(RETURN_CONDITIONS)) {
                RETURN_CONDITIONS.forEach(function(condition) {
                    const conditionLi = document.createElement('li');
                    conditionLi.textContent = condition;
                    conditionsUl.appendChild(conditionLi);
                });
            }
            conditionsLi.appendChild(conditionsUl);
            exchangeReturnList.appendChild(conditionsLi);
            
            const contactLi = document.createElement('li');
            contactLi.innerHTML = `📞 <strong>Для обміну/повернення:</strong> зв'яжіться з менеджером через Viber або Telegram`;
            exchangeReturnList.appendChild(contactLi);
            
            if (typeof RETURN_MONEY_TIME !== 'undefined') {
                const moneyLi = document.createElement('li');
                moneyLi.innerHTML = `💰 <strong>Повернення коштів:</strong> здійснюється на ті самі реквізити, з яких була здійснена оплата, протягом <strong>${RETURN_MONEY_TIME}</strong> після отримання товару назад`;
                exchangeReturnList.appendChild(moneyLi);
            }
            
            if (typeof RETURN_DELIVERY_COST !== 'undefined') {
                const deliveryCostLi = document.createElement('li');
                deliveryCostLi.innerHTML = `🚚 <strong>Вартість доставки:</strong> ${RETURN_DELIVERY_COST}`;
                exchangeReturnList.appendChild(deliveryCostLi);
            }
        } else {
            // Якщо обмін та повернення недоступні
            const noReturnLi = document.createElement('li');
            noReturnLi.innerHTML = `ℹ️ <strong>Обмін та повернення товару недоступні згідно з умовами продавця.</strong>`;
            exchangeReturnList.appendChild(noReturnLi);
        }
    }
    
    // Заповнюємо шаблон
    const templateDisplay = document.getElementById('paymentTemplateDisplay');
    if (templateDisplay && typeof AFTER_PAYMENT_TEMPLATE !== 'undefined') {
        templateDisplay.innerText = AFTER_PAYMENT_TEMPLATE; // Use innerText to preserve line breaks
    }
    
    // Налаштовуємо Google Calendar iframe та кнопку підписки
    if (typeof GOOGLE_CALENDAR_URL_OR_ID !== 'undefined' && GOOGLE_CALENDAR_URL_OR_ID && GOOGLE_CALENDAR_URL_OR_ID.trim() !== '') {
        const calendarIdRaw = extractCalendarId(GOOGLE_CALENDAR_URL_OR_ID);
        if (calendarIdRaw) {
            const calendarSection = document.getElementById('calendarSection');
            const calendarIframe = document.getElementById('calendarIframe');
            const calendarContainer = document.querySelector('.calendar-container');
            
            if (calendarSection) {
                calendarSection.style.display = 'block';
            }
            
            // Видаляємо повідомлення про помилку, якщо воно є
            if (calendarContainer) {
                const errorDiv = calendarContainer.querySelector('.calendar-error-message');
                if (errorDiv) {
                    errorDiv.remove();
                }
            }
            
            // Налаштовуємо iframe з Google Calendar Agenda View
            if (calendarIframe) {
                const calendarIdEncoded = encodeURIComponent(calendarIdRaw);
                const iframeUrl = `https://calendar.google.com/calendar/embed?src=${calendarIdEncoded}&ctz=Europe%2FKiev&mode=AGENDA&showNav=0&showTitle=0&showPrint=0&showCalendars=0&showTabs=0`;
                calendarIframe.src = iframeUrl;
                calendarIframe.style.display = 'block';
                console.log('✅ Google Calendar iframe налаштовано:', iframeUrl);
            }
            
            // Завантажуємо події календаря
            loadCalendarEvents();
        } else {
            console.error('❌ Не вдалося витягти Calendar ID');
            showCalendarNotSynced();
        }
    } else {
        // Показуємо повідомлення про відсутність синхронізації
        console.log('⚠️ Calendar URL не вказано');
        showCalendarNotSynced();
    }
    
    // Заповнюємо умови повернення (якщо елементи існують)
    const returnDaysEl = document.getElementById('returnDays');
    if (returnDaysEl && typeof RETURN_DAYS !== 'undefined') {
        returnDaysEl.textContent = RETURN_DAYS;
    }
    const returnMoneyTimeEl = document.getElementById('returnMoneyTime');
    if (returnMoneyTimeEl && typeof RETURN_MONEY_TIME !== 'undefined') {
        returnMoneyTimeEl.textContent = RETURN_MONEY_TIME;
    }
    const returnDeliveryCostEl = document.getElementById('returnDeliveryCost');
    if (returnDeliveryCostEl && typeof RETURN_DELIVERY_COST !== 'undefined') {
        returnDeliveryCostEl.textContent = RETURN_DELIVERY_COST;
    }
    
    const returnConditionsList = document.getElementById('returnConditionsList');
    if (returnConditionsList && typeof RETURN_CONDITIONS !== 'undefined' && Array.isArray(RETURN_CONDITIONS)) {
        returnConditionsList.innerHTML = '';
        RETURN_CONDITIONS.forEach(function(condition) {
            const li = document.createElement('li');
            li.textContent = condition;
            returnConditionsList.appendChild(li);
        });
    }
    
    // Заповнюємо footer посилання
    const footerTelegramLink = document.getElementById('footerTelegramLink');
    if (footerTelegramLink) {
        if (typeof TELEGRAM_PHONE !== 'undefined' && TELEGRAM_PHONE) {
            const phone = formatPhoneNumber(TELEGRAM_PHONE);
            footerTelegramLink.href = 'https://t.me/+' + phone.replace('+', '');
        } else if (typeof TELEGRAM_USERNAME !== 'undefined' && TELEGRAM_USERNAME) {
            footerTelegramLink.href = 'https://t.me/' + TELEGRAM_USERNAME;
        }
    }
    
    // Перевірка безпеки після завантаження
    if (!checkSecurity()) {
        return;
    }
    
    // Постійний моніторинг безпеки
    setInterval(function() {
        if (!checkSecurity()) {
            return;
        }
    }, 1000);
    
    // Відстеження змін в DOM (MutationObserver)
    const observer = new MutationObserver(function(mutations) {
        if (!checkSecurity()) {
            observer.disconnect();
            return;
        }
    });
    
    // Спостереження за змінами в документі
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden']
    });
    
    // Захист функцій від зміни
    try {
        Object.defineProperty(window, 'checkSecurity', {
            writable: false,
            configurable: false
        });
        Object.defineProperty(window, 'blockPage', {
            writable: false,
            configurable: false
        });
    } catch(e) {
        // Якщо не вдалося захистити - блокуємо сторінку
        blockPage();
    }
    
    // Обробник клавіші Escape для закриття модального вікна
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeContactModal();
        }
    });
});
