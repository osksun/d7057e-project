function setXpBar() {
    xpBar = document.getElementById("header-xp-progress-bar-front");
    xpBar.style.width = getXpPercent() + "%";
}

window.onload = setXpBar;