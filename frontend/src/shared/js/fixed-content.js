const displayLevel = new function() {
    let previousLevel = null;
    const levelNumber = document.getElementById("header-level-info");
    const xpBarWhite = document.getElementById("header-xp-progress-bar-front-white");
    const xpBarBlue = document.getElementById("header-xp-progress-bar-front-blue");
    const xpBarBack = document.getElementById("header-xp-progress-bar-back");

    function updateXpBar(percent) {
        xpBarWhite.style.width = percent + "%";
        xpBarBlue.style.width = percent + "%";
    }

    function updateLevelInfo(level, title) {
        levelNumber.innerHTML = "Level " + level + " | " + title;
    }

    this.updateXp = function() {
        DbCom.getXp().then((result) => {
            const level = getLevel(result.xp);
            const percent = getXpPercent(result.xp, level);
            if (previousLevel === null) {
                updateXpBar(percent * 100);
                updateLevelInfo(level, "Title")
            } else if (level > previousLevel) {
                updateXpBar(100);
                setTimeout(() => {
                    xpBarBack.classList.add("skip-animation");
                    updateXpBar(0);
                    xpBarBack.offsetWidth; // Trigger reflow
                    xpBarBack.classList.remove("skip-animation");
                    updateLevelInfo(level, "Title")
                    updateXpBar(percent * 100);
                }, 500);
            } else {
                updateXpBar(percent * 100);
            }
            previousLevel = level;
        })
    }

    function xpRequired(level) {
        return 700 * (Math.pow(1.15, level - 1) - 1);
    }

    function getLevel(xp) {
        return Math.floor(Math.log(xp / 700 + 1) / Math.log(1.15) + 1)
    }

    function getXpPercent(xp, level) {
        const xpForCurrentLevel = xpRequired(level);
        return (xp - xpForCurrentLevel) / (xpRequired(level + 1) - xpForCurrentLevel);
    }
}()

window.addEventListener("load",() => {
    displayLevel.updateXp();
});