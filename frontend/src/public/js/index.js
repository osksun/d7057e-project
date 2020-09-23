function updateXpBar() {
    const xpBar = document.getElementById("header-xp-progress-bar-front");
    xpBar.style.width = getXpPercent() + "%";
}

function updateLevelInfo() {
    const levelNumber = document.getElementById("header-level-info");
    levelNumber.innerHTML = "Level " + getLevel() + " | " + getLevelTitle();
}


window.onload = function() {
    updateXpBar();
    updateLevelInfo();
}