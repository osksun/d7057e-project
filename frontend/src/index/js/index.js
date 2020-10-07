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
}

function toggleView(activeButton, visibleView, unselectedButtons, hiddenViews) {
    activeButton.classList.add("selected");
    visibleView.classList.add("visible");
    unselectedButtons.forEach(button => button.classList.remove("selected"));
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

function createModuleCard(name, description, color, courseName) {
    const moduleCard = document.createElement("li");
    const a = document.createElement("a");
    const cardHeader = document.createElement("h3");
    cardHeader.className = "card-header";
    cardHeader.innerText = name;
    console.log(color);
    cardHeader.style.backgroundColor = color;
    const span = document.createElement("span");
    span.style.color = color;
    span.innerText = description;
    a.appendChild(cardHeader);
    a.appendChild(span);
    moduleCard.appendChild(a);
        });
    });
    return moduleCard;
}

function createModuleCards(modules, color, courseName) {
    const courseView = document.getElementById("view-course");
    modules.forEach((module) => {
        courseView.appendChild(createModuleCard(module.name, module.description, color, courseName));
    });
}

function createCourseCards(courses) {
    const allCoursesView = document.getElementById("view-all-courses");
    courses.forEach((course) => {
        allCoursesView.appendChild(createCourseCard(course.name, "#" + course.color));
    });
}

window.addEventListener("load",() => {
    setupCategoryButtons("button-container", "view-container");
    DbCom.getCourses().then((courses) => {
        createCourseCards(courses);
    });
});
