// --- CONFIGURATION ---
const MIN_ORDER_AMOUNT = 150;
const PRICE_BASE = 0.4; // Base multiplier for calculation logic

// --- LANGUAGE DICTIONARY ---
const translations = {
    ru: {
        hero_subtitle: "DEAD INSIDE MODE: ON",
        hero_title: "МЫ НЕ ПРОЩАЕМ <br> <span class='highlight'>ОШИБОК</span>",
        hero_desc: "HLTV демоны в твоем лобби. Уникальный спуфинг железа (IP/HWID). <br>Винрейт 86%. Мы уничтожаем FACEIT с 2019 года.",
        stat_orders: "ЗАКАЗОВ",
        calc_header: "FACEIT CALCULATOR",
        calc_title: "НАСТРОЙКА УНИЧТОЖЕНИЯ",
        curr_elo: "Текущий ELO",
        des_elo: "Желаемый ELO",
        total: "ИТОГО К ОПЛАТЕ",
        min_order_warn: "МИН. ЗАКАЗ $150. МЫ - ЭЛИТНЫЙ СЕРВИС.",
        order_btn: "ЗАКАЗАТЬ БУСТ",
        login_btn: "ВХОД",
        auth_title: "ВХОД В СИСТЕМУ",
        auth_sub: "Подключение к Hive",
        login_submit: "ПОДКЛЮЧИТЬСЯ",
        tg_warn_title: "ВНИМАНИЕ!",
        tg_warn_text: "Если вас нет на сайте, включите уведомления в Telegram. Бустер может запросить код Steam Guard в любой момент."
    },
    en: {
        hero_subtitle: "DEAD INSIDE MODE: ON",
        hero_title: "WE FORGIVE NO <br> <span class='highlight'>MISTAKES</span>",
        hero_desc: "HLTV demons in your lobby. Unique HWID Spoofing (Undetected). <br>86% Winrate. Destroying FACEIT since 2019.",
        stat_orders: "ORDERS",
        calc_header: "FACEIT CALCULATOR",
        calc_title: "DESTRUCTION SETTINGS",
        curr_elo: "Current ELO",
        des_elo: "Desired ELO",
        total: "TOTAL PRICE",
        min_order_warn: "MIN ORDER $150. PREMIUM SERVICE ONLY.",
        order_btn: "ORDER BOOST",
        login_btn: "LOGIN",
        auth_title: "SYSTEM ENTRY",
        auth_sub: "Connect to the Hive",
        login_submit: "CONNECT",
        tg_warn_title: "WARNING!",
        tg_warn_text: "Enable Telegram notifications. Booster might ask for Steam Guard code anytime."
    },
    cn: {
        hero_subtitle: "死亡模式: 开启",
        hero_title: "我们将摧毁 <br> <span class='highlight'>一切</span>",
        hero_desc: "HLTV 恶魔在大厅。独特的硬件欺骗 (IP/HWID)。<br>胜率 86%。自 2019 年以来统治 FACEIT。",
        stat_orders: "订单",
        calc_header: "FACEIT 计算器",
        calc_title: "销毁设置",
        curr_elo: "当前 ELO",
        des_elo: "目标 ELO",
        total: "总价",
        min_order_warn: "最低订单 $150。仅限高级服务。",
        order_btn: "订购提升",
        login_btn: "登录",
        auth_title: "系统登录",
        auth_sub: "连接到 Hive",
        login_submit: "连接",
        tg_warn_title: "警告!",
        tg_warn_text: "请开启 Telegram 通知。助推器可能会随时索要 Steam Guard 代码。"
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initCalculator();
    // Default language check could go here
});

// --- CALCULATOR LOGIC ---
function initCalculator() {
    const currentInput = document.getElementById('current-elo');
    const desiredInput = document.getElementById('desired-elo');

    // Event Listeners for Current ELO
    currentInput.addEventListener('input', function() {
        let currVal = parseInt(this.value);
        let desVal = parseInt(desiredInput.value);

        // Visual Update
        document.getElementById('current-elo-val').innerText = currVal;

        // Logic: Desired cannot be less than current + 25
        if (currVal >= desVal) {
            desiredInput.value = currVal + 25;
            document.getElementById('desired-elo-val').innerText = currVal + 25;
        }
        calculatePrice();
    });

    // Event Listeners for Desired ELO
    desiredInput.addEventListener('input', function() {
        let currVal = parseInt(currentInput.value);
        let desVal = parseInt(this.value);

        // Visual Update
        document.getElementById('desired-elo-val').innerText = desVal;

        // Logic: Current cannot be higher than desired - 25
        if (desVal <= currVal) {
            currentInput.value = desVal - 25;
            document.getElementById('current-elo-val').innerText = desVal - 25;
        }
        calculatePrice();
    });

    calculatePrice(); // Run once on load
}

function calculatePrice() {
    const current = parseInt(document.getElementById('current-elo').value);
    const desired = parseInt(document.getElementById('desired-elo').value);
    
    let eloDiff = desired - current;
    if (eloDiff < 0) eloDiff = 0;

    // Simple pricing algorithm for demo
    // Base price per 1 ELO point approx
    let rawPrice = eloDiff * PRICE_BASE;

    // Multipliers
    let multiplier = 1.0;
    if (document.getElementById('express').checked) multiplier += 0.40;
    if (document.getElementById('super-express').checked) multiplier += 0.60;
    
    const playMode = document.querySelector('input[name="play-mode"]:checked').value;
    if (playMode === 'selfplay') multiplier += 0.40;

    let finalPrice = Math.round(rawPrice * multiplier);

    // Min Order Validation
    const warnBox = document.getElementById('min-price-warning');
    if (finalPrice < MIN_ORDER_AMOUNT) {
        finalPrice = MIN_ORDER_AMOUNT;
        warnBox.style.display = 'block';
    } else {
        warnBox.style.display = 'none';
    }

    // Animation Effect on Price Change
    const priceEl = document.getElementById('final-price');
    priceEl.innerText = finalPrice;
}

// --- LANGUAGE SYSTEM ---
function setLanguage(lang, btnElement) {
    // 1. Update Buttons State
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    // 2. Update Text Content
    const data = translations[lang];
    if (!data) return;

    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (data[key]) {
            el.innerHTML = data[key];
        }
    });
}

// --- AUTH & NAVIGATION ---
function openAuthModal() {
    document.getElementById('auth-modal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

// Close modal if clicked outside
window.onclick = function(event) {
    const modal = document.getElementById('auth-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const tg = document.getElementById('telegram').value;

    // Show loading state (simple visual)
    const btn = document.querySelector('#auth-form button');
    const originalText = btn.innerText;
    btn.innerText = "VERIFYING...";

    // Simulation of API delay
    setTimeout(() => {
        // Logic: Admin vs Client
        document.getElementById('landing-page').style.display = 'none';
        closeAuthModal();

        if (email === 'admin@emoboost.com' && pass === 'admin') {
            document.getElementById('admin-dashboard').style.display = 'block';
            console.log("Logged in as ADMIN");
        } else {
            document.getElementById('client-dashboard').style.display = 'block';
            console.log(`Logged in as CLIENT (${tg})`);
            // Add greeting to chat
            addMessage('system', `Welcome back, ${tg}. Connecting to secure server...`);
        }
        
        btn.innerText = originalText;
    }, 800);
}

function logout() {
    location.reload(); // Hard reset to landing
}

// --- CHAT SYSTEM (Client Dash) ---
function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value;
    
    if (text.trim() === "") return;

    // Add user message
    addMessage('client', text);
    input.value = "";

    // Auto reply simulation
    setTimeout(() => {
        addMessage('booster', 'Got it. One sec.');
    }, 1500);
}

function addMessage(type, text) {
    const chatWindow = document.getElementById('chat-window');
    const msgDiv = document.createElement('div');
    
    msgDiv.classList.add('msg');
    
    if (type === 'client') {
        msgDiv.classList.add('client');
        msgDiv.innerHTML = `<span class="name">You:</span> <p>${text}</p>`;
        msgDiv.style.textAlign = 'right';
        msgDiv.style.color = '#aaa';
    } else if (type === 'booster') {
        msgDiv.classList.add('booster');
        msgDiv.innerHTML = `<span class="name">m0NESY_v2:</span> <p>${text}</p>`;
    } else {
        msgDiv.classList.add('system');
        msgDiv.innerHTML = `<span>System:</span> ${text}`;
    }

    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
