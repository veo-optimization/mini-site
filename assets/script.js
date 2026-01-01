// Глобальні налаштування
const FORM_GENERATOR_URL = 'https://veo-optimization.github.io/mini-site/assets/form-generator.html';

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

function copyViberPhone(phone, index) {
    if (!checkSecurity()) return;
    const phoneToCopy = phone || VIBER_PHONE;
    if (!phoneToCopy) return;
    const formattedNumber = formatPhoneNumber(phoneToCopy);
    const buttonId = index !== undefined ? `copyViberPhoneButton${index}` : 'copyViberPhoneButton';
    const badgeId = index !== undefined ? `viberCopyBadge${index}` : 'viberCopyBadge';
    copyToClipboard(formattedNumber, buttonId, '', true);
    showCopySuccess(badgeId);
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
    
    // Для Viber використовуємо збережений номер телефону
    if (currentContactData.type === 'viber') {
        const phoneToCopy = window.currentViberPhone || currentContactData.value || VIBER_PHONE;
        textToCopy = phoneToCopy ? formatPhoneNumber(phoneToCopy) : currentContactData.value;
    } else if (currentContactData.type === 'biggo') {
    // Для BIGGO LIVE копіюємо тільки чистий юзернейм (без @)
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
        const phoneToUse = window.currentViberPhone || currentContactData.value || VIBER_PHONE;
        if (phoneToUse) {
            const viberUrl = createViberUrl(phoneToUse.replace('+380', '0').replace(/\s/g, ''));
        window.location.href = viberUrl;
        }
    } else if (currentContactData.type === 'instagram') {
        window.open('https://instagram.com/' + currentContactData.value.replace('@', ''), '_blank');
    } else if (currentContactData.type === 'biggo') {
        // Для BIGGO LIVE відкриваємо URL
        const fullUrl = getBiggoLiveUrl();
        if (fullUrl) {
            window.open(fullUrl, '_blank');
        }
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

function openViber(phone) {
    if (!checkSecurity()) return;
    const phoneToUse = phone || VIBER_PHONE;
    if (!phoneToUse) return;
    const viberUrl = createViberUrl(phoneToUse.replace('+380', '0').replace(/\s/g, ''));
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
    
    // Якщо це просто username або ID (без URL), повертаємо як є
    if (!BIGGO_LIVE_URL.includes('http') && !BIGGO_LIVE_URL.includes('/') && !BIGGO_LIVE_URL.includes('.')) {
        return BIGGO_LIVE_URL;
    }
    
    // Якщо це URL, витягуємо username
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

// Функція для отримання повного URL BIGGO LIVE
function getBiggoLiveUrl() {
    if (!BIGGO_LIVE_URL) return '';
    
    // Якщо це просто username або ID, формуємо URL
    if (!BIGGO_LIVE_URL.includes('http') && !BIGGO_LIVE_URL.includes('/') && !BIGGO_LIVE_URL.includes('.')) {
        return `https://biggo.tv/user/${BIGGO_LIVE_URL}`;
    }
    
    // Якщо це вже URL, повертаємо як є
    return BIGGO_LIVE_URL;
}

function openBiggoLive() {
    if (!checkSecurity() || !BIGGO_LIVE_URL) return;
    // Для BIGGO LIVE показуємо модальне вікно з можливістю скопіювати юзернейм
    const username = getBiggoLiveUsername();
    const fullUrl = getBiggoLiveUrl();
    if (username) {
        showContactModal('BIGGO LIVE', fullUrl, 'biggo');
    }
}

function copyBiggoLive() {
    if (!checkSecurity() || !BIGGO_LIVE_URL) return;
    const fullUrl = getBiggoLiveUrl();
    secureCopy(fullUrl, 'copyBiggoLiveButton', '', true);
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
        const currentYear = new Date().getFullYear().toString();
        if (!footerText.includes('VEO FORCE') || !footerText.includes(currentYear)) {
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
    window.copyCardNumber = function() { return false; };
    window.copyCardHolder = function() { return false; };
    window.copyCardBank = function() { return false; };
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

function copyCardNumber() {
    if (!checkSecurity()) return;
    if (typeof CARD_NUMBER !== 'undefined' && CARD_NUMBER) {
        secureCopy(CARD_NUMBER.replace(/\s/g, ''), 'copyCardNumberButton', '✓ Номер картки скопійовано', false);
    }
}

function copyCardHolder() {
    if (!checkSecurity()) return;
    if (typeof CARD_HOLDER_NAME !== 'undefined' && CARD_HOLDER_NAME) {
        secureCopy(CARD_HOLDER_NAME, 'copyCardHolderButton', '✓ Прізвище скопійовано', false);
    }
}

function copyCardBank() {
    if (!checkSecurity()) return;
    if (typeof CARD_BANK_NAME !== 'undefined' && CARD_BANK_NAME) {
        secureCopy(CARD_BANK_NAME, 'copyCardBankButton', '✓ Назва банку скопійовано', false);
    }
}

function copyPaymentTemplate() {
    if (!checkSecurity()) return;
    
    // Використовуємо оригінальне значення з глобальної константи, щоб зберегти переноси рядків
    let templateText = (typeof window.AFTER_PAYMENT_TEMPLATE !== 'undefined' && window.AFTER_PAYMENT_TEMPLATE) 
        ? window.AFTER_PAYMENT_TEMPLATE 
        : (typeof AFTER_PAYMENT_TEMPLATE !== 'undefined' && AFTER_PAYMENT_TEMPLATE) 
            ? AFTER_PAYMENT_TEMPLATE 
            : '';
    
    // Якщо не знайшли в глобальних константах, спробуємо взяти з DOM елемента
    if (!templateText) {
        const templateElement = document.getElementById('paymentTemplateDisplay');
        if (templateElement) {
            // Використовуємо textContent, який зберігає переноси рядків краще, ніж innerText
            templateText = templateElement.textContent || templateElement.innerText || '';
        }
    }
    
    if (templateText) {
        // Переконуємося, що переноси рядків зберігаються
        // Якщо в тексті є \n як текст (екранований), замінюємо на справжній перенос
        let textToCopy = templateText;
        // Замінюємо екрановані \n на справжні переноси (якщо вони є як текст)
        textToCopy = textToCopy.replace(/\\n/g, '\n');
        
        // Діагностика
        console.log('📋 Копіювання шаблону, довжина:', textToCopy.length);
        console.log('📋 Кількість переносів рядків:', (textToCopy.match(/\n/g) || []).length);
        
        // Використовуємо Clipboard API з fallback
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(function() {
                const button = document.getElementById('copyTemplateButton');
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
                    button.innerHTML = '✓ Шаблон скопійовано';
                    button.style.background = '#2196F3';
                    button.style.color = '#ffffff';
                    
                    // Фіксуємо всі розміри, щоб кнопка не змінювалася
                    button.style.width = originalWidth;
                    button.style.height = originalHeight;
                    button.style.minWidth = originalMinWidth;
                    button.style.minHeight = originalMinHeight;
                    button.style.padding = originalPadding;
                    button.style.boxSizing = originalBoxSizing;
                    
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
            }).catch(function(err) {
                console.error('Помилка копіювання через Clipboard API:', err);
                // Fallback для старих браузерів
                fallbackCopyTextToClipboard(textToCopy);
            });
        } else {
            // Fallback для старих браузерів
            fallbackCopyTextToClipboard(textToCopy);
        }
    } else {
        alert('Шаблон порожній');
    }
}

// Fallback функція для копіювання тексту в старих браузерах
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const button = document.getElementById('copyTemplateButton');
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
                button.innerHTML = '✓ Шаблон скопійовано';
                button.style.background = '#2196F3';
                button.style.color = '#ffffff';
                
                // Фіксуємо всі розміри, щоб кнопка не змінювалася
                button.style.width = originalWidth;
                button.style.height = originalHeight;
                button.style.minWidth = originalMinWidth;
                button.style.minHeight = originalMinHeight;
                button.style.padding = originalPadding;
                button.style.boxSizing = originalBoxSizing;
                
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
        } else {
            alert('Не вдалося скопіювати шаблон');
        }
    } catch (err) {
        console.error('Помилка fallback копіювання:', err);
        alert('Не вдалося скопіювати шаблон');
    }
    
    document.body.removeChild(textArea);
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
            // Використовуємо більш точний регулярний вираз, який враховує, що Calendar ID може містити закодовані символи
            const match = urlOrId.match(/\/ical\/(.+?)\/public\/basic\.ics/);
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
                // Спробуємо альтернативний підхід - знайти все між /ical/ та наступним /
                const altMatch = urlOrId.match(/\/ical\/([^\/]+)\//);
                if (altMatch && altMatch[1]) {
                    let calendarId = decodeURIComponent(altMatch[1]);
                    console.log('extractCalendarId: витягнуто альтернативним методом:', calendarId);
                    return calendarId;
                }
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
    const calendarSection = document.getElementById('calendarSection');
    
    // Перевіряємо, чи є посилання на календар
    if (!GOOGLE_CALENDAR_URL_OR_ID || GOOGLE_CALENDAR_URL_OR_ID.trim() === '') {
        console.log('Calendar URL не вказано - приховуємо блок календаря');
        // Приховуємо блок, якщо посилання немає
        if (calendarSection) {
            calendarSection.style.display = 'none';
        }
        return;
    }
    
    // Показуємо блок календаря тільки якщо є посилання
    if (calendarSection) {
        calendarSection.style.display = 'block';
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
    
    // Показуємо блок тільки якщо є посилання (якщо функція викликана, значить є помилка, але посилання було)
    // Але якщо посилання немає взагалі, блок вже приховано в loadCalendarEvents()
    if (GOOGLE_CALENDAR_URL_OR_ID && GOOGLE_CALENDAR_URL_OR_ID.trim() !== '') {
    calendarSection.style.display = 'block';
    }
    
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
    
    // Переконуємося, що дані оброблені перед використанням
    // Якщо є CLIENT_CONSTANTS, але дані ще не оброблені, обробляємо їх
    if (typeof CLIENT_CONSTANTS !== 'undefined' && CLIENT_CONSTANTS && CLIENT_CONSTANTS.trim().length > 0) {
        if (typeof processClientData === 'function') {
            processClientData();
        }
    }
    
    // Невелика затримка, щоб переконатися, що всі глобальні константи встановлені
    setTimeout(function() {
        // Діагностика: перевіряємо, чи дані доступні
        console.log('🔍 Перевірка даних перед відображенням:', {
            SHOP_NAME: typeof window.SHOP_NAME !== 'undefined' ? window.SHOP_NAME : 'не визначено',
            FOP_NAME: typeof window.FOP_NAME !== 'undefined' ? window.FOP_NAME : 'не визначено',
            CLIENT_DATA: typeof window.CLIENT_DATA !== 'undefined' ? 'визначено' : 'не визначено'
        });
    
    // Заповнюємо дані на сторінці
    // Назва магазину
    const shopNameHeader = document.getElementById('shopNameHeader');
    if (shopNameHeader) {
            const shopName = window.SHOP_NAME || (typeof SHOP_NAME !== 'undefined' ? SHOP_NAME : '');
            if (shopName) {
                shopNameHeader.textContent = shopName;
                console.log('✅ Назва магазину встановлено:', shopName);
            } else {
                console.warn('⚠️ SHOP_NAME не визначено');
            }
        }
    
    // Опис магазину (якщо є)
    const shopDescriptionEl = document.querySelector('.header p');
    if (shopDescriptionEl) {
        const shopDesc = window.SHOP_DESCRIPTION || (typeof SHOP_DESCRIPTION !== 'undefined' ? SHOP_DESCRIPTION : '');
        if (shopDesc) {
            shopDescriptionEl.textContent = shopDesc;
        }
    }
    
    // Час роботи / Контактний час та Асортимент (показуємо тільки якщо є календар)
    // ЗАКОМЕНТОВАНО: ці блоки дублюються в публічній оферті
    /*
    // Перевіряємо, чи є календар (GOOGLE_CALENDAR_URL_OR_ID)
    const hasCalendar = typeof GOOGLE_CALENDAR_URL_OR_ID !== 'undefined' && GOOGLE_CALENDAR_URL_OR_ID && GOOGLE_CALENDAR_URL_OR_ID.trim().length > 0;
    
    if (hasCalendar) {
        // Час роботи / Контактний час
        if (typeof WORKING_HOURS !== 'undefined' && WORKING_HOURS) {
            const workingHoursSection = document.createElement('div');
            workingHoursSection.className = 'section';
            workingHoursSection.innerHTML = `
                <div class="card">
                    <div class="section-title">
                        <span>🕐</span>
                        <span>Час роботи / Контактний час</span>
                    </div>
                    <p style="color: #e0e0e0; font-size: 14px; line-height: 1.6; margin: 0;">${WORKING_HOURS}</p>
                </div>
            `;
            const calendarSection = document.getElementById('calendarSection');
            if (calendarSection && calendarSection.parentNode) {
                // Вставляємо після календаря
                calendarSection.parentNode.insertBefore(workingHoursSection, calendarSection.nextSibling);
            }
        }
        
        // Асортимент (категорії товарів)
        if (typeof CATEGORIES !== 'undefined' && CATEGORIES && CATEGORIES.length > 0) {
            const categoriesSection = document.createElement('div');
            categoriesSection.className = 'section';
            const categoriesList = CATEGORIES.map(cat => `<li style="margin-bottom: 8px;">${cat}</li>`).join('');
            categoriesSection.innerHTML = `
                <div class="card">
                    <div class="section-title">
                        <span>🛍️</span>
                        <span>Асортимент (категорії товарів)</span>
                    </div>
                    <ul style="color: #e0e0e0; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                        ${categoriesList}
                    </ul>
                </div>
            `;
            const calendarSection = document.getElementById('calendarSection');
            if (calendarSection && calendarSection.parentNode) {
                // Вставляємо після календаря (або після блоку "Час роботи", якщо він є)
                const allSections = Array.from(calendarSection.parentNode.querySelectorAll('.section'));
                const calendarIndex = allSections.indexOf(calendarSection);
                const workingHoursIndex = allSections.findIndex(section => {
                    const title = section.querySelector('.section-title');
                    return title && title.textContent.includes('🕐');
                });
                
                if (workingHoursIndex > calendarIndex && workingHoursIndex !== -1) {
                    // Якщо є блок "Час роботи" після календаря, вставляємо після нього
                    const workingHoursSection = allSections[workingHoursIndex];
                    if (workingHoursSection.nextSibling) {
                        workingHoursSection.parentNode.insertBefore(categoriesSection, workingHoursSection.nextSibling);
                    } else {
                        workingHoursSection.parentNode.appendChild(categoriesSection);
                    }
                } else {
                    // Вставляємо після календаря
                    if (calendarSection.nextSibling) {
                        calendarSection.parentNode.insertBefore(categoriesSection, calendarSection.nextSibling);
                    } else {
                        calendarSection.parentNode.appendChild(categoriesSection);
                    }
                }
            }
        }
    }
    */
    
    // Назва календаря з назвою магазину
    const calendarTitle = document.getElementById('calendarTitle');
    if (calendarTitle) {
        const shopName = window.SHOP_NAME || (typeof SHOP_NAME !== 'undefined' ? SHOP_NAME : '');
        if (shopName) {
            calendarTitle.textContent = shopName + ': Розклад прямих ефірів';
    }
    }
    
    const fopNameEl = document.getElementById('fopName');
    if (fopNameEl) {
        const fopName = window.FOP_NAME || (typeof FOP_NAME !== 'undefined' ? FOP_NAME : '');
        if (fopName) {
            fopNameEl.textContent = fopName;
        }
    }
    
    const edrpouValueEl = document.getElementById('edrpouValue');
    if (edrpouValueEl) {
        const edrpou = window.EDRPOU || (typeof EDRPOU !== 'undefined' ? EDRPOU : '');
        if (edrpou) {
            edrpouValueEl.textContent = edrpou;
        }
    }
    
    const ibanValueEl = document.getElementById('ibanValue');
    if (ibanValueEl) {
        const iban = window.IBAN || (typeof IBAN !== 'undefined' ? IBAN : '');
        if (iban) {
            ibanValueEl.textContent = iban;
        }
    }
    
    const bankNameEl = document.getElementById('bankName');
    if (bankNameEl) {
        const bankName = window.BANK_NAME || (typeof BANK_NAME !== 'undefined' ? BANK_NAME : '');
        if (bankName) {
            bankNameEl.textContent = bankName;
        }
    }
    
    const paymentPurposeValueEl = document.getElementById('paymentPurposeValue');
    if (paymentPurposeValueEl) {
        const paymentPurpose = window.PAYMENT_PURPOSE || (typeof PAYMENT_PURPOSE !== 'undefined' ? PAYMENT_PURPOSE : '');
        if (paymentPurpose) {
            paymentPurposeValueEl.textContent = paymentPurpose;
        }
    }
    
    // Оплата на картку (окремий блок)
    const cardPaymentSection = document.getElementById('cardPaymentSection');
    if (cardPaymentSection && typeof CARD_NUMBER !== 'undefined' && CARD_NUMBER) {
        cardPaymentSection.style.display = 'block';
        
        const cardNumberValueEl = document.getElementById('cardNumberValue');
        if (cardNumberValueEl) {
            // Форматуємо номер картки з пробілами (групи по 4 цифри)
            const formattedCardNumber = CARD_NUMBER.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            cardNumberValueEl.textContent = formattedCardNumber;
        }
        
        const cardHolderNameValueEl = document.getElementById('cardHolderNameValue');
        if (cardHolderNameValueEl && typeof CARD_HOLDER_NAME !== 'undefined' && CARD_HOLDER_NAME) {
            cardHolderNameValueEl.textContent = CARD_HOLDER_NAME;
        } else if (cardHolderNameValueEl) {
            cardHolderNameValueEl.textContent = '—';
        }
        
        const cardBankNameValueEl = document.getElementById('cardBankNameValue');
        if (cardBankNameValueEl && typeof CARD_BANK_NAME !== 'undefined' && CARD_BANK_NAME) {
            cardBankNameValueEl.textContent = CARD_BANK_NAME;
        } else if (cardBankNameValueEl) {
            cardBankNameValueEl.textContent = '—';
        }
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
    
    // Viber контакти
    const viberContactsListEl = document.getElementById('viberContactsList');
    if (viberContactsListEl) {
        // Перевіряємо новий формат (масив контактів)
        if (typeof VIBER_CONTACTS !== 'undefined' && VIBER_CONTACTS && VIBER_CONTACTS.length > 0) {
            viberContactsListEl.innerHTML = '';
            VIBER_CONTACTS.forEach((contact, index) => {
                const phone = contact.phone || '';
                const name = contact.name || '';
                const displayName = name ? `Вайбер (${name})` : 'Вайбер';
                const formattedPhone = formatPhoneNumber(phone);
                
                const contactItem = document.createElement('div');
                contactItem.className = 'contact-item contact-item-viber';
                contactItem.style.cursor = 'pointer';
                contactItem.onclick = function() {
                    window.currentViberPhone = phone; // Зберігаємо номер для відкриття
                    showContactModal(displayName, formattedPhone, 'viber');
                };
                contactItem.innerHTML = `
                    <div class="contact-icon">
                        <img src="https://simpleicons.org/icons/viber.svg" alt="Viber" width="24" height="24" style="display: block;">
                    </div>
                    <div class="contact-content">
                        <div class="contact-name">
                            ${displayName}
                            <span class="copy-success-badge" id="viberCopyBadge${index}">✓ Скопійовано!</span>
                        </div>
                        <div class="contact-value" id="viberPhone${index}">${formattedPhone}</div>
                    </div>
                    <div class="contact-actions" onclick="event.stopPropagation();">
                        <button class="contact-action-btn contact-open-btn" onclick="openViber('${phone}')" title="Відкрити">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </button>
                        <button class="contact-action-btn contact-copy-btn" id="copyViberPhoneButton${index}" onclick="copyViberPhone('${phone}', ${index})" title="Скопіювати">
                            <i class="bi bi-files"></i>
                        </button>
                    </div>
                `;
                viberContactsListEl.appendChild(contactItem);
            });
        } else if (typeof VIBER_PHONE !== 'undefined' && VIBER_PHONE) {
            // Зворотна сумісність: якщо є старий формат
            const viberPhoneEl = document.getElementById('viberPhone');
            if (viberPhoneEl) {
                viberPhoneEl.textContent = formatPhoneNumber(VIBER_PHONE);
            }
        }
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
    
    // Локації магазинів
    const storeLocationsSection = document.getElementById('storeLocationsSection');
    const storeLocationsList = document.getElementById('storeLocationsList');
    if (storeLocationsSection && storeLocationsList) {
        if (typeof STORE_LOCATIONS !== 'undefined' && STORE_LOCATIONS && STORE_LOCATIONS.length > 0) {
            storeLocationsList.innerHTML = '';
            STORE_LOCATIONS.forEach((location, index) => {
                const locationItem = document.createElement('div');
                locationItem.className = 'card';
                locationItem.style.marginBottom = '15px';
                locationItem.innerHTML = `
                    <div style="padding: 15px;">
                        <div style="font-weight: 600; color: #ffffff; font-size: 16px; margin-bottom: 10px;">
                            📍 ${location.name || 'Локація ' + (index + 1)}
                        </div>
                        <a href="${location.url}" target="_blank" rel="noopener noreferrer" 
                           style="color: #4CAF50; text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 5px;">
                            <i class="bi bi-box-arrow-up-right"></i>
                            Відкрити на Google Maps
                        </a>
                    </div>
                `;
                storeLocationsList.appendChild(locationItem);
            });
            storeLocationsSection.style.display = 'block';
        } else {
            storeLocationsSection.style.display = 'none';
        }
    }
    
    // Перевірка TikTok-браузера та налаштування Intersection Observer для показу popup
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isTikTok = ua.includes("TikTok") || ua.includes("Musical.ly") || ua.includes("Bytedance");
    
    if (isTikTok) {
        // Знаходимо всі видимі елементи контактів
        const contactItems = document.querySelectorAll('.contact-item');
        let visibleContacts = [];
        
        // Шукаємо всі елементи, які відображаються (не приховані)
        for (let i = 0; i < contactItems.length; i++) {
            const item = contactItems[i];
            const style = window.getComputedStyle(item);
            if (style.display !== 'none' && style.visibility !== 'hidden' && item.offsetParent !== null) {
                visibleContacts.push(item);
            }
        }
        
        // Вибираємо другий контакт (якщо він є), інакше перший
        const targetContact = visibleContacts.length >= 2 ? visibleContacts[1] : (visibleContacts.length >= 1 ? visibleContacts[0] : null);
        
        // Якщо знайшли елемент, налаштовуємо Intersection Observer
        if (targetContact) {
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
            
            // Починаємо спостерігати за другим (або першим, якщо другого немає) елементом контакту
            observer.observe(targetContact);
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
    if (templateDisplay) {
        const template = window.AFTER_PAYMENT_TEMPLATE || (typeof AFTER_PAYMENT_TEMPLATE !== 'undefined' ? AFTER_PAYMENT_TEMPLATE : '');
        if (template) {
            // Використовуємо textContent та забезпечуємо правильне відображення переносів рядків
            templateDisplay.textContent = template;
            // Переконуємося, що елемент має клас template-text для правильного CSS
            if (!templateDisplay.classList.contains('template-text')) {
                templateDisplay.classList.add('template-text');
            }
            // Переконуємося, що CSS white-space: pre-line застосовується
            templateDisplay.style.whiteSpace = 'pre-line';
            // Діагностика
            console.log('✅ Шаблон встановлено, довжина:', template.length, 'символів');
            console.log('✅ Кількість переносів рядків:', (template.match(/\n/g) || []).length);
        } else {
            console.warn('⚠️ AFTER_PAYMENT_TEMPLATE не визначено або порожній');
        }
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
                console.log('📋 Calendar ID (raw):', calendarIdRaw);
                console.log('📋 Calendar ID (encoded):', calendarIdEncoded);
                
                // Додаємо обробник помилок для iframe
                calendarIframe.onerror = function() {
                    console.error('❌ Помилка завантаження iframe календаря');
                    showCalendarNotSynced();
                };
                
                // Перевіряємо, чи iframe завантажився через 5 секунд
                setTimeout(() => {
                    try {
                        // Спробуємо отримати доступ до контенту iframe (може не спрацювати через CORS)
                        const iframeDoc = calendarIframe.contentDocument || calendarIframe.contentWindow.document;
                        if (!iframeDoc || iframeDoc.body.innerHTML.includes('error') || iframeDoc.body.innerHTML.includes('denied')) {
                            console.warn('⚠️ Можлива проблема з доступом до календаря');
                        }
                    } catch (e) {
                        // CORS помилка - це нормально, але iframe може все одно працювати
                        console.log('ℹ️ Не вдалося перевірити контент iframe (CORS), але це нормально');
                    }
                }, 5000);
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
    
    // Заповнюємо посилання на форму-генератор
    const footerCreatePageLink = document.getElementById('footerCreatePageLink');
    if (footerCreatePageLink && typeof FORM_GENERATOR_URL !== 'undefined') {
        footerCreatePageLink.href = FORM_GENERATOR_URL;
    }
    
    // Перевірка незаповнених полів та відображення повідомлення
    const missingDataFields = [];
    const fieldLabels = {
        shopName: 'Назва магазину',
        shopDescription: 'Опис магазину',
        workingHours: 'Час роботи',
        fopName: 'ПІБ ФОП',
        edrpou: 'ЄДРПОУ',
        iban: 'IBAN',
        bankName: 'Назва банку',
        paymentPurpose: 'Призначення платежу',
        cardNumber: 'Номер картки',
        cardHolderName: 'Прізвище власника картки',
        cardBankName: 'Назва банку картки',
        telegramUsername: 'Telegram',
        telegramPhone: 'Telegram (телефон)',
        viberPhone: 'Viber',
        viberContacts: 'Viber контакти',
        telegramShowcase: 'Telegram вітрина',
        instagramUsername: 'Instagram',
        facebookPage: 'Facebook',
        tiktokUsername: 'TikTok',
        youtubeChannel: 'YouTube',
        whatsappPhone: 'WhatsApp',
        biggoLiveUrl: 'BIGGO LIVE',
        googleCalendarUrl: 'Графік ефірів',
        paymentOptions: 'Умови оплати',
        deliveryMethod: 'Спосіб доставки',
        deliveryTime: 'Термін доставки',
        exchangeDays: 'Термін обміну',
        returnDays: 'Термін повернення',
        returnConditions: 'Умови обміну та повернення',
        returnMoneyTime: 'Термін повернення коштів',
        returnDeliveryCost: 'Вартість доставки при поверненні',
        afterPaymentTemplate: 'Шаблон після оплати',
        storeLocations: 'Локацію магазину',
        categories: 'Категорії товарів'
    };
    
    // Перевіряємо основні поля
    if (typeof SHOP_NAME === 'undefined' || !SHOP_NAME || SHOP_NAME.trim() === '') {
        missingDataFields.push(fieldLabels.shopName);
    }
    
    // Перевіряємо FOP реквізити (якщо немає оплати на картку)
    const hasCardPayment = typeof CARD_NUMBER !== 'undefined' && CARD_NUMBER && CARD_NUMBER.trim() !== '';
    if (!hasCardPayment) {
        // Якщо немає оплати на картку, FOP реквізити обов'язкові
        if (typeof FOP_NAME === 'undefined' || !FOP_NAME || FOP_NAME.trim() === '') {
            missingDataFields.push(fieldLabels.fopName);
        }
        if (typeof EDRPOU === 'undefined' || !EDRPOU || EDRPOU.trim() === '') {
            missingDataFields.push(fieldLabels.edrpou);
        }
        if (typeof IBAN === 'undefined' || !IBAN || IBAN.trim() === '') {
            missingDataFields.push(fieldLabels.iban);
        }
        if (typeof BANK_NAME === 'undefined' || !BANK_NAME || BANK_NAME.trim() === '') {
            missingDataFields.push(fieldLabels.bankName);
        }
        if (typeof PAYMENT_PURPOSE === 'undefined' || !PAYMENT_PURPOSE || PAYMENT_PURPOSE.trim() === '') {
            missingDataFields.push(fieldLabels.paymentPurpose);
        }
    } else {
        // Якщо є оплата на картку, FOP реквізити не обов'язкові, але перевіряємо картку
        if (typeof CARD_NUMBER === 'undefined' || !CARD_NUMBER || CARD_NUMBER.trim() === '') {
            missingDataFields.push(fieldLabels.cardNumber);
        }
    }
    
    // Перевіряємо контакти (хоча б один має бути)
    const hasTelegram = (typeof TELEGRAM_USERNAME !== 'undefined' && TELEGRAM_USERNAME && TELEGRAM_USERNAME.trim() !== '') ||
                        (typeof TELEGRAM_PHONE !== 'undefined' && TELEGRAM_PHONE && TELEGRAM_PHONE.trim() !== '');
    const hasViber = (typeof VIBER_CONTACTS !== 'undefined' && VIBER_CONTACTS && VIBER_CONTACTS.length > 0) ||
                     (typeof VIBER_PHONE !== 'undefined' && VIBER_PHONE && VIBER_PHONE.trim() !== '');
    if (!hasTelegram && !hasViber) {
        missingDataFields.push('Контакти (Telegram або Viber)');
    }
    
    // Перевіряємо інші соціальні мережі
    if (typeof TELEGRAM_SHOWCASE === 'undefined' || !TELEGRAM_SHOWCASE || TELEGRAM_SHOWCASE.trim() === '') {
        missingDataFields.push(fieldLabels.telegramShowcase);
    }
    if (typeof INSTAGRAM_USERNAME === 'undefined' || !INSTAGRAM_USERNAME || INSTAGRAM_USERNAME.trim() === '') {
        missingDataFields.push(fieldLabels.instagramUsername);
    }
    if (typeof FACEBOOK_PAGE === 'undefined' || !FACEBOOK_PAGE || FACEBOOK_PAGE.trim() === '') {
        missingDataFields.push(fieldLabels.facebookPage);
    }
    if (typeof TIKTOK_USERNAME === 'undefined' || !TIKTOK_USERNAME || TIKTOK_USERNAME.trim() === '') {
        missingDataFields.push(fieldLabels.tiktokUsername);
    }
    if (typeof YOUTUBE_CHANNEL === 'undefined' || !YOUTUBE_CHANNEL || YOUTUBE_CHANNEL.trim() === '') {
        missingDataFields.push(fieldLabels.youtubeChannel);
    }
    if (typeof WHATSAPP_PHONE === 'undefined' || !WHATSAPP_PHONE || WHATSAPP_PHONE.trim() === '') {
        missingDataFields.push(fieldLabels.whatsappPhone);
    }
    if (typeof BIGGO_LIVE_URL === 'undefined' || !BIGGO_LIVE_URL || BIGGO_LIVE_URL.trim() === '') {
        missingDataFields.push(fieldLabels.biggoLiveUrl);
    }
    
    // Перевіряємо умови оплати
    if (typeof PAYMENT_OPTIONS === 'undefined' || !PAYMENT_OPTIONS || PAYMENT_OPTIONS.length === 0) {
        missingDataFields.push(fieldLabels.paymentOptions);
    }
    
    // Перевіряємо умови доставки
    if (!DELIVERY_METHOD || DELIVERY_METHOD.trim() === '') missingDataFields.push(fieldLabels.deliveryMethod);
    if (!DELIVERY_TIME || DELIVERY_TIME.trim() === '') missingDataFields.push(fieldLabels.deliveryTime);
    
    // Перевіряємо опціональні поля (всі незаповнені блоки)
    if (typeof SHOP_DESCRIPTION === 'undefined' || !SHOP_DESCRIPTION || SHOP_DESCRIPTION.trim() === '') {
        missingDataFields.push(fieldLabels.shopDescription);
    }
    if (typeof WORKING_HOURS === 'undefined' || !WORKING_HOURS || WORKING_HOURS.trim() === '') {
        missingDataFields.push(fieldLabels.workingHours);
    }
    if (typeof CATEGORIES === 'undefined' || !CATEGORIES || CATEGORIES.length === 0) {
        missingDataFields.push(fieldLabels.categories);
    }
    if (typeof GOOGLE_CALENDAR_URL_OR_ID === 'undefined' || !GOOGLE_CALENDAR_URL_OR_ID || GOOGLE_CALENDAR_URL_OR_ID.trim() === '') {
        missingDataFields.push(fieldLabels.googleCalendarUrl);
    }
    if (hasCardPayment) {
        if (typeof CARD_HOLDER_NAME === 'undefined' || !CARD_HOLDER_NAME || CARD_HOLDER_NAME.trim() === '') {
            missingDataFields.push(fieldLabels.cardHolderName);
        }
        if (typeof CARD_BANK_NAME === 'undefined' || !CARD_BANK_NAME || CARD_BANK_NAME.trim() === '') {
            missingDataFields.push(fieldLabels.cardBankName);
        }
    }
    if (typeof STORE_LOCATIONS === 'undefined' || !STORE_LOCATIONS || STORE_LOCATIONS.length === 0) {
        missingDataFields.push(fieldLabels.storeLocations);
    }
    
    // Перевіряємо умови повернення (опціональні, але показуємо якщо не заповнені)
    if (typeof EXCHANGE_DAYS === 'undefined' || EXCHANGE_DAYS === 0) {
        missingDataFields.push(fieldLabels.exchangeDays);
    }
    if (typeof RETURN_DAYS === 'undefined' || RETURN_DAYS === 0) {
        missingDataFields.push(fieldLabels.returnDays);
    }
    if (typeof RETURN_CONDITIONS === 'undefined' || !RETURN_CONDITIONS || RETURN_CONDITIONS.length === 0) {
        missingDataFields.push(fieldLabels.returnConditions);
    }
    if (typeof RETURN_MONEY_TIME === 'undefined' || !RETURN_MONEY_TIME || RETURN_MONEY_TIME.trim() === '') {
        missingDataFields.push(fieldLabels.returnMoneyTime);
    }
    if (typeof RETURN_DELIVERY_COST === 'undefined' || !RETURN_DELIVERY_COST || RETURN_DELIVERY_COST.trim() === '') {
        missingDataFields.push(fieldLabels.returnDeliveryCost);
    }
    
    // Перевіряємо шаблон після оплати
    if (typeof AFTER_PAYMENT_TEMPLATE === 'undefined' || !AFTER_PAYMENT_TEMPLATE || AFTER_PAYMENT_TEMPLATE.trim() === '') {
        missingDataFields.push(fieldLabels.afterPaymentTemplate);
    }
    
    // Відображаємо повідомлення про незаповнені дані
    const missingDataNotice = document.getElementById('missingDataNotice');
    if (missingDataNotice && missingDataFields.length > 0) {
        const missingDataList = missingDataFields.join(', ');
        const missingDataListEl = document.getElementById('missingDataList');
        if (missingDataListEl) {
            missingDataListEl.textContent = missingDataList;
        }
        missingDataNotice.style.display = 'block';
    } else if (missingDataNotice) {
        missingDataNotice.style.display = 'none';
    }
    
    // Встановлюємо поточний рік у футері
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Формуємо та відображаємо публічну оферту
    generatePublicOffer();
    
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
    }, 100); // Закриваємо setTimeout
});

// Допоміжна функція для екранування HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функція формування публічної оферти
function generatePublicOffer() {
    const offerSection = document.getElementById('publicOfferSection');
    const offerContent = document.getElementById('publicOfferContent');
    
    if (!offerSection || !offerContent) {
        return;
    }
    
    // Перевіряємо, чи є дані для оферти
    const hasData = (typeof window.SHOP_NAME !== 'undefined' && window.SHOP_NAME) ||
                   (typeof window.PAYMENT_OPTIONS !== 'undefined' && window.PAYMENT_OPTIONS && window.PAYMENT_OPTIONS.length > 0) ||
                   (typeof window.DELIVERY_METHOD !== 'undefined' && window.DELIVERY_METHOD) ||
                   (typeof window.EXCHANGE_DAYS !== 'undefined' && window.EXCHANGE_DAYS > 0) ||
                   (typeof window.RETURN_DAYS !== 'undefined' && window.RETURN_DAYS > 0);
    
    if (!hasData) {
        offerSection.style.display = 'none';
        return;
    }
    
    // Формуємо HTML оферти
    let offerHTML = '<h2>📄 Публічна оферта</h2>';
    
    // 1. Загальні положення
    offerHTML += '<h3>1. Загальні положення</h3>';
    offerHTML += '<p>Ця публічна оферта (далі - "Оферта") є офіційною пропозицією продавця укласти договір купівлі-продажу товару на умовах, викладених нижче.</p>';
    
    if (typeof window.SHOP_NAME !== 'undefined' && window.SHOP_NAME) {
        offerHTML += `<p><strong>Продавець:</strong> <span class="public-offer-highlight">${escapeHtml(window.SHOP_NAME)}</span></p>`;
    }
    
    // 2. Асортимент товарів
    if (typeof window.CATEGORIES !== 'undefined' && window.CATEGORIES && window.CATEGORIES.length > 0) {
        offerHTML += '<h3>2. Асортимент товарів</h3>';
        offerHTML += '<p>Продавець надає наступні категорії товарів:</p>';
        offerHTML += '<ul>';
        window.CATEGORIES.forEach(cat => {
            offerHTML += `<li>${escapeHtml(cat)}</li>`;
        });
        offerHTML += '</ul>';
    }
    
    // 3. Час роботи / Контактний час
    if (typeof window.WORKING_HOURS !== 'undefined' && window.WORKING_HOURS) {
        offerHTML += '<h3>3. Час роботи / Контактний час</h3>';
        offerHTML += `<p>${escapeHtml(window.WORKING_HOURS)}</p>`;
    }
    
    // 4. Умови оплати
    if (typeof window.PAYMENT_OPTIONS !== 'undefined' && window.PAYMENT_OPTIONS && window.PAYMENT_OPTIONS.length > 0) {
        offerHTML += '<h3>4. Умови оплати</h3>';
        offerHTML += '<p>Покупець може здійснити оплату наступними способами:</p>';
        offerHTML += '<ul>';
        window.PAYMENT_OPTIONS.forEach(option => {
            offerHTML += `<li>${escapeHtml(option)}</li>`;
        });
        offerHTML += '</ul>';
    }
    
    // 5. Умови доставки
    if (typeof window.DELIVERY_METHOD !== 'undefined' && window.DELIVERY_METHOD) {
        offerHTML += '<h3>5. Умови доставки</h3>';
        offerHTML += `<p><strong>Спосіб доставки:</strong> <span class="public-offer-highlight">${escapeHtml(window.DELIVERY_METHOD)}</span></p>`;
        
        if (typeof window.DELIVERY_TIME !== 'undefined' && window.DELIVERY_TIME) {
            offerHTML += `<p><strong>Термін доставки:</strong> ${escapeHtml(window.DELIVERY_TIME)}</p>`;
        }
        
        if (typeof window.DELIVERY_NOTE !== 'undefined' && window.DELIVERY_NOTE) {
            offerHTML += `<p><em>${escapeHtml(window.DELIVERY_NOTE)}</em></p>`;
        }
    }
    
    // 6. Умови обміну та повернення
    const hasExchange = typeof window.EXCHANGE_DAYS !== 'undefined' && window.EXCHANGE_DAYS > 0;
    const hasReturn = typeof window.RETURN_DAYS !== 'undefined' && window.RETURN_DAYS > 0;
    
    if (hasExchange || hasReturn) {
        offerHTML += '<h3>6. Умови обміну та повернення</h3>';
        
        if (hasExchange) {
            offerHTML += `<p><strong>Обмін:</strong> відповідно до законодавства України, у вас є право на обмін товару протягом <span class="public-offer-highlight">${window.EXCHANGE_DAYS} днів</span> з моменту отримання (окрім товарів, визначених законодавством).</p>`;
        }
        
        if (hasReturn) {
            offerHTML += `<p><strong>Повернення:</strong> відповідно до законодавства України, у вас є право на повернення товару протягом <span class="public-offer-highlight">${window.RETURN_DAYS} днів</span> з моменту отримання (окрім товарів, визначених законодавством).</p>`;
        }
        
        if (typeof window.RETURN_CONDITIONS !== 'undefined' && window.RETURN_CONDITIONS && window.RETURN_CONDITIONS.length > 0) {
            offerHTML += '<p><strong>Умови обміну/повернення:</strong></p>';
            offerHTML += '<ul>';
            window.RETURN_CONDITIONS.forEach(condition => {
                offerHTML += `<li>${escapeHtml(condition)}</li>`;
            });
            offerHTML += '</ul>';
        }
        
        if (typeof window.RETURN_MONEY_TIME !== 'undefined' && window.RETURN_MONEY_TIME) {
            offerHTML += `<p><strong>Термін повернення коштів:</strong> ${escapeHtml(window.RETURN_MONEY_TIME)}</p>`;
        }
        
        if (typeof window.RETURN_DELIVERY_COST !== 'undefined' && window.RETURN_DELIVERY_COST) {
            offerHTML += `<p><strong>Вартість доставки при поверненні:</strong> ${escapeHtml(window.RETURN_DELIVERY_COST)}</p>`;
        }
    }
    
    // 7. Особливі умови (якщо є)
    if (typeof window.OFFER_ADDITIONAL_INFO !== 'undefined' && window.OFFER_ADDITIONAL_INFO) {
        offerHTML += '<h3>7. Особливі умови</h3>';
        offerHTML += `<div class="public-offer-note">${escapeHtml(window.OFFER_ADDITIONAL_INFO).replace(/\n/g, '<br>')}</div>`;
    }
    
    // 8. Контактна інформація
    offerHTML += '<h3>8. Контактна інформація</h3>';
    offerHTML += '<p>Для отримання додаткової інформації, оформлення замовлення або вирішення питань, звертайтеся до продавця через контакти, вказані на цій сторінці.</p>';
    
    // Встановлюємо HTML та показуємо блок
    offerContent.innerHTML = offerHTML;
    offerSection.style.display = 'block';
}
