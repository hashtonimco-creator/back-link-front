// تایمر شمارش معکوس
let timeLeft = 30 * 60; // 30 دقیقه به ثانیه
let timerInterval;

// شروع تایمر
function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

// به‌روزرسانی تایمر
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const displayMinutes = minutes.toString().padStart(2, '0');
    const displaySeconds = seconds.toString().padStart(2, '0');
    
    document.getElementById('timer').textContent = `${displayMinutes}:${displaySeconds}`;
    
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        document.getElementById('timer').textContent = '۰۰:۰۰';
        // در اینجا می‌توانید منطق پایان زمان را اضافه کنید
    } else {
        timeLeft--;
    }
}

// اعتبارسنجی شماره موبایل
function validatePhoneNumber(phone) {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone);
}

// فرمت کردن شماره موبایل
function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '');
}

// تولید کد تخفیف تصادفی
function generateDiscountCode() {
    const prefix = 'LIFE';
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}${randomNumber}`;
}

// شبیه‌سازی ارسال پیامک
function sendSMS(phoneNumber) {
    return new Promise((resolve) => {
        // شبیه‌سازی تأخیر شبکه
        setTimeout(() => {
            console.log(`پیامک تایید برای ${phoneNumber} ارسال شد`);
            resolve(true);
        }, 2000);
    });
}

// دریافت کد تخفیف
async function getDiscountCode() {
    const phoneInput = document.getElementById('phone-input');
    const button = document.getElementById('get-discount-btn');
    const phoneNumber = formatPhoneNumber(phoneInput.value);
    
    // اعتبارسنجی
    if (!phoneNumber) {
        showError('لطفاً شماره موبایل خود را وارد کنید');
        return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
        showError('شماره موبایل وارد شده صحیح نیست');
        return;
    }
    
    // غیرفعال کردن دکمه و نمایش لودینگ
    button.disabled = true;
    button.textContent = 'در حال ارسال...';
    button.classList.add('loading');
    
    try {
        // شبیه‌سازی ارسال پیامک
        await sendSMS(phoneNumber);
        
        // تولید کد تخفیف
        const discountCode = generateDiscountCode();
        
        // نمایش پیام موفقیت
        showSuccessMessage(discountCode);
        
        // ذخیره اطلاعات در localStorage
        localStorage.setItem('userPhone', phoneNumber);
        localStorage.setItem('discountCode', discountCode);
        localStorage.setItem('timestamp', Date.now());
        
    } catch (error) {
        showError('خطا در ارسال پیامک. لطفاً دوباره تلاش کنید.');
    } finally {
        // بازگرداندن دکمه به حالت عادی
        button.disabled = false;
        button.textContent = 'دریافت کد تخفیف';
        button.classList.remove('loading');
    }
}

// نمایش پیام خطا
function showError(message) {
    // ایجاد عنصر پیام خطا
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-size: 14px;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    // حذف پیام بعد از 3 ثانیه
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 300);
    }, 3000);
}

// نمایش پیام موفقیت
function showSuccessMessage(discountCode) {
    const successMessage = document.getElementById('success-message');
    const codeElement = document.getElementById('discount-code');
    
    codeElement.textContent = discountCode;
    successMessage.classList.remove('hidden');
    
    // اضافه کردن انیمیشن به کد تخفیف
    setTimeout(() => {
        codeElement.style.animation = 'pulse 1s ease 3';
    }, 500);
}

// بستن پیام موفقیت
function closeSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.classList.add('hidden');
}

// مدیریت رویدادهای صفحه
document.addEventListener('DOMContentLoaded', function() {
    // شروع تایمر
    startTimer();
    
    // مدیریت ورودی شماره موبایل
    const phoneInput = document.getElementById('phone-input');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        e.target.value = value;
    });
    
    // مدیریت کلید Enter
    phoneInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getDiscountCode();
        }
    });
    
    // مدیریت کلیک روی پس‌زمینه برای بستن پیام موفقیت
    document.getElementById('success-message').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessMessage();
        }
    });
    
    // بررسی وجود کد تخفیف قبلی
    const existingCode = localStorage.getItem('discountCode');
    const timestamp = localStorage.getItem('timestamp');
    const now = Date.now();
    
    // اگر کد تخفیف کمتر از 24 ساعت پیش دریافت شده، نمایش آن
    if (existingCode && timestamp && (now - parseInt(timestamp)) < 24 * 60 * 60 * 1000) {
        showSuccessMessage(existingCode);
    }
    
    // انیمیشن هنگام اسکرول
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });
});

// اضافه کردن استایل‌های انیمیشن
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error-message {
        box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
    }
`;
document.head.appendChild(style);

// تابع کمکی برای تست
window.testDiscount = function() {
    document.getElementById('phone-input').value = '09123456789';
    getDiscountCode();
};

// تابع کمکی برای ریست کردن
window.resetPage = function() {
    localStorage.clear();
    location.reload();
};