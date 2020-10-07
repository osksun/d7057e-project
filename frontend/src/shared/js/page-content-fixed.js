window.addEventListener("load",() => {
    const xpPerLevel = 200;
    updateXp();

    function updateXpBar(percent) {
        const xpBarWhite = document.getElementById("header-xp-progress-bar-front-white");
        const xpBarGreen = document.getElementById("header-xp-progress-bar-front-green");
        xpBarWhite.style.width = percent + "%";
        xpBarGreen.style.width = percent + "%";
    }

    function updateLevelInfo(level, title) {
        const levelNumber = document.getElementById("header-level-info");
        levelNumber.innerHTML = "Level " + level + " | " + title;
    }

    function updateXp() {
        DbCom.getXp().then((result) => {
            const level = getLevel(result.xp);
            const percent = getXpPercent(result.xp, level);
            updateXpBar(percent * 100);
            updateLevelInfo(level, "Title")
        })
    }

    function xpRequired(level) {
        return level * xpPerLevel;
    }

    function getLevel(xp) {
        return Math.floor(xp / xpPerLevel);
    }

    function getXpPercent(xp, level) {
        const xpForCurrentLevel = xpRequired(level);
        return (xp - xpForCurrentLevel) / (xpRequired(level + 1) - xpForCurrentLevel);
    }
});