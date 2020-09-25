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

function setupCategoryButtons(buttonContainerID, viewContainerID) {
    const topCategoryButtons = document.getElementById(buttonContainerID).getElementsByTagName("button");
    const topCategoryViews = document.getElementById(viewContainerID).getElementsByTagName("ul");
    for (let i = 0; i < topCategoryButtons.length; i++) {
        let btns = [...topCategoryButtons];
        let views = [...topCategoryViews];
        btns.splice(i, 1);
        views.splice(i, 1);
        topCategoryButtons[i].addEventListener("click", function() {
            toggleView(topCategoryButtons[i], topCategoryViews[i], btns, views)
        });
    }
}

function toggleView(activeButton, visibleView, inactiveButtons, hiddenViews) {
    activeButton.classList.add("active");
    visibleView.classList.add("visible");
    inactiveButtons.forEach(button => button.classList.remove("active"));
    hiddenViews.forEach(view => view.classList.remove("visible"));
}

window.onload = function () {
    updateXpBar(getXpPercent());
    updateLevelInfo();
    setInterval(() => {
       updateXpBar(Math.random() * 100);
    }, 1000);
    setupCategoryButtons("top-button-container", "top-view-container");
    setupCategoryButtons("bot-button-container", "bot-view-container");
}