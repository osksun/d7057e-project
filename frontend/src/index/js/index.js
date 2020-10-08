window.addEventListener("load",() => {
    setupCategoryButtons("button-container", "view-container");
    DbCom.getCourses().then((courses) => {
        createCourseCards(courses);
    });
    let displayCourseModuleHandler;

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
        const allCoursesButton = document.getElementById("button-all-courses");
        allCoursesButton.addEventListener("click", () => {
            DbCom.getCourses().then((courses) => {
                clearCourseCards();
                createCourseCards(courses);
                updatePage("/frontend/src/index/html/", "All courses", courses);
            });
        });
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
        const header = document.createElement("div");
        header.className = "card-header";
        header.style.backgroundColor = color;
        const title = document.createElement("h3");
        title.innerText = name;
        header.appendChild(title);
        const info = document.createElement("ul");
        info.innerHTML = "<li><span>Progress: 6/10</span></li><li><span>Next reward: 6/10</span></li>";
        info.style.color = color;
        a.appendChild(header);
        a.appendChild(info);
        courseCard.appendChild(a);
        courseCard.addEventListener("click", () => {
            displayCourseModule(name, color);
        });
        return courseCard;
    }


    function displayCourseModule(courseName, color) {
        const courseButton = document.getElementById("button-course");
        DbCom.getModules(courseName).then((modules) => {
            clearModuleCards();
            createModuleCards(modules, color, courseName);
            updatePage("/courses/" + encodeURI(courseName.toLowerCase()), courseName, modules);
            courseButton.disabled = false;
            courseButton.children[0].innerText = courseName;
            courseButton.removeEventListener("click", displayCourseModuleHandler);
            displayCourseModuleHandler = displayCourseModule.bind(null, courseName, color);
            courseButton.click();
            courseButton.addEventListener("click", displayCourseModuleHandler);
        });
    }

    function updatePage(url, title, html) {
        document.title = title;
        window.history.pushState({"html":html, "pageTitle":title}, "", url);
    }

    function createCourseCards(courses) {
        const allCoursesView = document.getElementById("view-all-courses");
        courses.forEach((course) => {
            allCoursesView.appendChild(createCourseCard(course.name, "#" + course.color));
        });
    }

    function clearCourseCards() {
        const courseView = document.getElementById("view-all-courses");
        courseView.innerHTML = "";
    }


    function createModuleCard(name, description, color, courseName) {
        const moduleCard = document.createElement("li");
        const a = document.createElement("a");
        const header = document.createElement("div");
        header.className = "card-header";
        header.style.backgroundColor = color;
        const title = document.createElement("h3");
        title.innerText = name;
        header.appendChild(title);
        const span = document.createElement("span");
        span.style.color = color;
        span.innerText = description;
        a.appendChild(header);
        a.appendChild(span);
        moduleCard.appendChild(a);
        return moduleCard;
    }

    function createModuleCards(modules, color, courseName) {
        const courseView = document.getElementById("view-course");
        modules.forEach((module) => {
            courseView.appendChild(createModuleCard(module.name, module.description, color, courseName));
        });
    }

    function clearModuleCards() {
        const courseView = document.getElementById("view-course");
        courseView.innerHTML = "";
    }
});
