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

function createCourseCard(name, color) {
    const courseCard = document.createElement("li");
    const a = document.createElement("a");
    a.href = "/courses/" + encodeURI(name);
    const cardHeader = document.createElement("h3");
    cardHeader.className = "card-header";
    cardHeader.innerText = name;
    cardHeader.style.backgroundColor = color;
    const info = document.createElement("ul");
    info.innerHTML = "<li><span>Progress: 6/10</span></li><li><span>Next reward: 6/10</span></li>";
    info.style.color = color;
    a.appendChild(cardHeader);
    a.appendChild(info);
    courseCard.appendChild(a);
    return courseCard;
}

function getCourseCards() {
    DbCom.getCourses().then((courses) => {
        const favouritesView = document.getElementById("view-favourites");
        courses.forEach((course) => {
            const courseCard = createCourseCard(course.name, "#" + course.color);
            favouritesView.appendChild(courseCard);
        });
    }).catch((err) => {
        console.log(err);
    });
}

window.addEventListener("load",() => {
    setupCategoryButtons("top-button-container", "top-view-container");
    setupCategoryButtons("bot-button-container", "bot-view-container");
    getCourseCards();
});