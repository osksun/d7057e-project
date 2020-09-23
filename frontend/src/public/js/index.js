function updateXpBar(percent) {
    const xpBarWhite = document.getElementById("header-xp-progress-bar-front-white");
    const xpBarGreen = document.getElementById("header-xp-progress-bar-front-green");
    xpBarWhite.style.width = percent + "%";
    xpBarGreen.style.width = percent + "%";
}

function updateLevelInfo() {
    const levelNumber = document.getElementById("header-level-info");
    levelNumber.innerHTML = "Level " + getLevel() + " | " + getLevelTitle();
}

window.onload = function () {
    updateXpBar(getXpPercent());
    updateLevelInfo();
    setInterval(() => {
       updateXpBar(Math.random() * 100);
    }, 1000);
}