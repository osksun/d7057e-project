window.addEventListener("load",() => {
    setupCategoryButtons("button-container", "view-container");
    DbCom.getCourses().then((courses) => {
        coursesView.createCards(courses);
    });

    function setupCategoryButtons(buttonContainerID, viewContainerID) {
        const categoryButtons = document.getElementById(buttonContainerID).children;
        const categoryViews = document.getElementById(viewContainerID).children;
        for (let i = 0; i < categoryButtons.length; i++) {
            let btns = [...categoryButtons];
            let views = [...categoryViews];
            btns.splice(i, 1);
            views.splice(i, 1);
            categoryButtons[i].addEventListener("click", () => {
                toggleView(categoryButtons[i], categoryViews[i], btns, views);
            });
        }
        const allCoursesButton = document.getElementById("courses-button");
        allCoursesButton.addEventListener("click", () => {
            DbCom.getCourses().then((courses) => {
                coursesView.clear();
                coursesView.createCards(courses);
                updatePage("/frontend/src/index/html/", "All courses", null);
            });
        });
    }

    function toggleView(activeButton, visibleView, unselectedButtons, hiddenViews) {
        activeButton.classList.add("selected");
        visibleView.classList.add("visible");
        unselectedButtons.forEach(button => button.classList.remove("selected"));
        hiddenViews.forEach(view => view.classList.remove("visible"));
    }
});

function updatePage(url, title, html) {
    document.title = title;
    window.history.pushState({"html":html, "pageTitle":title}, "", url);
}

/*
window.onpopstate = function(e) {
    if(e.state) {
        document.getElementById("content").innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};
*/