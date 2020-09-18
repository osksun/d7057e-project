function updateXpBar() {
    const xpBar = document.getElementById("header-xp-progress-bar-front");
    xpBar.style.width = getXpPercent() + "%";
}

function updateLevel() {
    const levelNumber = document.getElementById("header-level-number");
    levelNumber.innerHTML = getLevel();
}

function updateLevelTitle() {
    const levelTitle = document.getElementById("header-level-title");
    levelTitle.innerHTML = getLevelTitle();
}

window.onload = function() {
    updateXpBar();
    updateLevel();
    updateLevelTitle();
}