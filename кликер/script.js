let score = parseInt(localStorage.getItem('c5_score')) || 0;
let clickValue = parseInt(localStorage.getItem('c5_val')) || 1;
let upgradeCost = parseInt(localStorage.getItem('c5_cost')) || 10;
let passiveIncome = parseInt(localStorage.getItem('c5_passive')) || 0;
let passiveCost = parseInt(localStorage.getItem('c5_p_cost')) || 50;
let boosterCost = parseInt(localStorage.getItem('c5_b_cost')) || 150;
let lastDailyClaim = parseInt(localStorage.getItem('c5_last_daily')) || 0;
let isBoosted = false; let boosterTimer = 0; let cooldownTimer = 0;
let skinsOwned = JSON.parse(localStorage.getItem('c5_skins_owned')) || { neon: false, ruby: false, img1: false, img2: false };
let currentSkin = localStorage.getItem('c5_current_skin') || 'none';
let themesOwned = JSON.parse(localStorage.getItem('c5_themes_owned')) || { custombg: false, matrix: false, space: false, cyber: false, gold: false };
let currentTheme = localStorage.getItem('c5_current_theme') || 'none';
let customBgImage = localStorage.getItem('c5_custom_bg_img') || '';

const scoreDisplay = document.getElementById('score-display');
const cpsDisplay = document.getElementById('cps-display');
const passiveDisplay = document.getElementById('passive-display');
const timerDisplay = document.getElementById('timer-display');
const dailyTimerText = document.getElementById('daily-timer-text');
const clickBtn = document.getElementById('click-me');
const upgradeBtn = document.getElementById('buy-upgrade');
const passiveBtn = document.getElementById('buy-passive');
const boosterBtn = document.getElementById('buy-booster');
const dailyBtn = document.getElementById('claim-daily-btn');
const resetBtn = document.getElementById('reset-btn');
const bgFileInput = document.getElementById('bg-file-input');

function updateUI() {
    let currentClick = isBoosted ? clickValue * 2 : clickValue;
    scoreDisplay.innerText = "Монеты: " + Math.floor(score);
    cpsDisplay.innerText = "Сила клика: " + currentClick + (isBoosted ? " (X2 АКТИВЕН!)" : "");
    passiveDisplay.innerText = "Пассивный доход: " + passiveIncome + "/сек";
    upgradeBtn.innerText = "Улучшить клик (+1) | Цена: " + upgradeCost;
    upgradeBtn.disabled = score < upgradeCost;
    passiveBtn.innerText = "Автокликер (+1/сек) | Цена: " + passiveCost;
    passiveBtn.disabled = score < passiveCost;

    if (isBoosted) { boosterBtn.disabled = true; boosterBtn.innerText = "Бустер активен!"; timerDisplay.innerText = "Осталось буста: " + boosterTimer + " sec"; }
    else if (cooldownTimer > 0) { boosterBtn.disabled = true; boosterBtn.innerText = "Перезарядка..."; timerDisplay.innerText = "Перезарядка бустера: " + cooldownTimer + " sec"; }
    else { boosterBtn.disabled = score < boosterCost; boosterBtn.innerText = "Купить Бустер X2 (10 сек) | Цена: " + boosterCost; timerDisplay.innerText = ""; }

    updateSkinButton('neon', 500); updateSkinButton('ruby', 2500); updateSkinButton('img1', 15000); updateSkinButton('img2', 75000);
    updateThemeButton('none', 0); updateThemeButton('custombg', 50000); updateThemeButton('matrix', 100000); updateThemeButton('space', 500000); updateThemeButton('cyber', 2500000); updateThemeButton('gold', 10000000);

    let timePassed = Date.now() - lastDailyClaim;
    if (timePassed >= 24 * 60 * 60 * 1000) { dailyBtn.disabled = false; dailyBtn.innerText = "Забрать бонус!"; dailyTimerText.innerText = "Подарок готов! Награда: +5000 монет 🎁"; }
    else { dailyBtn.disabled = true; let timeLeft = (24 * 60 * 60 * 1000) - timePassed; let hours = Math.floor(timeLeft / (60 * 60 * 1000)); let minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000)); dailyBtn.innerText = "Недоступно"; dailyTimerText.innerText = "Осталось: " + hours + "ч " + minutes + "м"; }

    clickBtn.className = 'click-btn';
    if (currentSkin !== 'none') clickBtn.classList.add('skin-' + currentSkin);
    if (isBoosted) clickBtn.classList.add('boosted');
    document.body.className = ''; document.body.style.backgroundImage = '';
    if (currentTheme !== 'none') { document.body.classList.add('theme-' + currentTheme); if (currentTheme === 'custombg' && customBgImage !== '') document.body.style.backgroundImage = "url('" + customBgImage + "')"; }
}

function updateSkinButton(skinId, price) {
    const btn = document.getElementById("skin-btn-" + skinId); if (!btn) return;
    if (currentSkin === skinId) { btn.className = 'skin-btn active'; btn.innerText = 'Надет'; btn.disabled = true; }
    else if (skinsOwned[skinId] === true) { btn.className = 'skin-btn equip'; btn.innerText = 'Надеть'; btn.disabled = false; }
    else { btn.className = 'skin-btn buy'; btn.innerText = "Купить: " + price; btn.disabled = score < price; }
}

function handleSkin(skinId, price) {
    if (skinsOwned[skinId] === true) { currentSkin = currentSkin === skinId ? 'none' : skinId; }
    else { if (score >= price) { score -= price; skinsOwned[skinId] = true; currentSkin = skinId; } }
    updateUI(); saveGame();
}

function updateThemeButton(themeId, price) {
    const btn = document.getElementById("theme-btn-" + themeId); if (!btn) return;
    if (currentTheme === themeId) { btn.className = 'skin-btn active'; btn.innerText = themeId === 'custombg' ? 'Выбрать фото' : 'Активна'; btn.disabled = themeId !== 'custombg'; }
    else if (themeId === 'none' || themesOwned[themeId] === true) { btn.className = 'skin-btn equip'; btn.innerText = 'Включить'; btn.disabled = false; }
    else { btn.className = 'skin-btn buy'; btn.innerText = "Купить: " + price; btn.disabled = score < price; }
}

function handleTheme(themeId, price) {
    if (themeId === 'none' || themesOwned[themeId] === true) { if (themeId === 'custombg' && currentTheme === 'custombg') { bgFileInput.click(); return; } currentTheme = themeId; }
    else { if (score >= price) { score -= price; themesOwned[themeId] = true; currentTheme = themeId; if (themeId === 'custombg') setTimeout(() => bgFileInput.click(), 100); } }
    updateUI(); saveGame();
}

if (bgFileInput) { bgFileInput.addEventListener('change', function(e) { if (e.target.files && e.target.files[0]) { const r = new FileReader(); r.onload = function(ev) { customBgImage = ev.target.result; localStorage.setItem('c5_custom_bg_img', customBgImage); updateUI(); }; r.readAsDataURL(e.target.files[0]); } }); }

function createClickEffect(x, y, value) {
    const container = document.getElementById('click-effects-container'); if (!container) return;
    const el = document.createElement('div'); el.className = 'floating-number'; el.innerText = '+' + value;
    el.style.left = (x + window.scrollX - 15) + 'px'; el.style.top = (y + window.scrollY - 20) + 'px'; container.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

dailyBtn.addEventListener('click', () => { if (Date.now() - lastDailyClaim >= 24 * 60 * 60 * 1000) { score += 5000; lastDailyClaim = Date.now(); alert("Вы получили 5000 монет! 🎉"); updateUI(); saveGame(); } });

document.getElementById('skin-btn-neon').addEventListener('click', () => handleSkin('neon', 500));
document.getElementById('skin-btn-ruby').addEventListener('click', () => handleSkin('ruby', 2500));
document.getElementById('skin-btn-img1').addEventListener('click', () => handleSkin('img1', 15000));
document.getElementById('skin-btn-img2').addEventListener('click', () => handleSkin('img2', 75000));
document.getElementById('theme-btn-none').addEventListener('click', () => handleTheme('none', 0));
document.getElementById('theme-btn-custombg').addEventListener('click', () => handleTheme('custombg', 50000));
document.getElementById('theme-btn-matrix').addEventListener('click', () => handleTheme('matrix', 100000));
document.getElementById('theme-btn-space').addEventListener('click', () => handleTheme('space', 500000));
document.getElementById('theme-btn-cyber').addEventListener('click', () => handleTheme('cyber', 2500000));
document.getElementById('theme-btn-gold').addEventListener('click', () => handleTheme('gold', 10000000));

function saveGame() {
    localStorage.setItem('c5_score', score);
    localStorage.setItem('c5_val', clickValue);
    localStorage.setItem('c5_cost', upgradeCost);
    localStorage.setItem('c5_passive', passiveIncome);
    localStorage.setItem('c5_p_cost', passiveCost);
    localStorage.setItem('c5_b_cost', boosterCost);
    localStorage.setItem('c5_last_daily', lastDailyClaim);
    localStorage.setItem('c5_skins_owned', JSON.stringify(skinsOwned));
    localStorage.setItem('c5_current_skin', currentSkin);
    localStorage.setItem('c5_themes_owned', JSON.stringify(themesOwned));
    localStorage.setItem('c5_current_theme', currentTheme);
}

// КЛИК И АПГРЕЙДЫ
clickBtn.addEventListener('click', (e) => {
    let currentClick = isBoosted ? clickValue * 2 : clickValue;
    score += currentClick;
    createClickEffect(e.clientX, e.clientY, currentClick);
    updateUI();
    saveGame();
});

upgradeBtn.addEventListener('click', () => {
    if (score >= upgradeCost) {
        score -= upgradeCost;
        clickValue += 1;
        upgradeCost = Math.round(upgradeCost * 1.6);
        updateUI();
        saveGame();
    }
});

passiveBtn.addEventListener('click', () => {
    if (score >= passiveCost) {
        score -= passiveCost;
        passiveIncome += 1;
        passiveCost = Math.round(passiveCost * 1.5);
        updateUI();
        saveGame();
    }
});

boosterBtn.addEventListener('click', () => {
    if (score >= boosterCost && !isBoosted && cooldownTimer === 0) {
        score -= boosterCost;
        isBoosted = true;
        boosterTimer = 10;
        boosterCost = Math.round(boosterCost * 1.8);
        updateUI();
        saveGame();
    }
});

// КНОПКА СБРОСА
resetBtn.addEventListener('click', () => {
    if (confirm("Вы уверены?")) {
        localStorage.clear();
        score = 0; clickValue = 1; upgradeCost = 10;
        passiveIncome = 0; passiveCost = 50; boosterCost = 150;
        lastDailyClaim = 0; customBgImage = '';
        skinsOwned = { neon: false, ruby: false, img1: false, img2: false };
        themesOwned = { custombg: false, matrix: false, space: false, cyber: false, gold: false };
        currentSkin = 'none'; currentTheme = 'none';
        isBoosted = false; boosterTimer = 0; cooldownTimer = 0;
        updateUI();
        saveGame();
    }
});

// ЕЖЕСЕКУНДНЫЙ ТАЙМЕР И СТАРТ
setInterval(() => {
    if (passiveIncome > 0) score += passiveIncome;
    if (isBoosted) {
        boosterTimer--;
        if (boosterTimer <= 0) {
            isBoosted = false;
            cooldownTimer = 15;
        }
    } else if (cooldownTimer > 0) {
        cooldownTimer--;
    }
    updateUI();
    saveGame();
}, 1000);

updateUI();
