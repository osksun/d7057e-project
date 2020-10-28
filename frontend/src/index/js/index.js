window.addEventListener("load", () => {
	setupCategoryButtons("button-container", "view-container");
	loadPath(window.location.pathname);

	function loadPath(pathname) {
		const pathArray = pathname.split("/");
		// /courses/course-name => ["", "courses", "course-name"] => length = 3
		// /courses/course-name/module-name => ["", "courses", "course-name", "module-name"] => length = 4
		switch (pathArray.length) {
			case 3: {
				const courseName = decodeURIComponent(pathArray[2]);
				loadCourse(courseName);
				break;
			} case 4: {
				const courseName = decodeURIComponent(pathArray[2]);
				const moduleName = decodeURIComponent(pathArray[3]);
				loadModule(courseName, moduleName);
				break;
			} default:
				loadCourses();
		}
	}
	
	function loadCourse(courseName) {
		DbCom.getCourseByName(courseName).then((course) => {
			if (course.hasOwnProperty("error")) {
				// 404 Course not found	
				loadCourses();
			} else {
				modulesView.display(course.id, course.name, "#" + course.color);
			}
		});
	}

	function loadModule(courseName, moduleName) {
		DbCom.getCourseByName(courseName).then((course) => {
			if (course.hasOwnProperty("error")) {
				// 404 Course not found
				loadCourses();
			} else {
				DbCom.getModuleByName(course.id, moduleName).then((module) => {
					if (module.hasOwnProperty("error")) {
						// 404 Module not found
						loadCourses();
					} else {
						modulesView.updateButton(course.id, course.name, "#" + course.color);
						questionView.displayRandom(course.id, course.name, module.id, module.name);
					}
				});
			}
		});
	}

	function loadCourses() {
		DbCom.getCourses().then((courses) => {
			coursesView.createCards(courses);
		});
	}

	function setupCategoryButtons(buttonContainerID, viewContainerID) {
		const allCoursesButton = document.getElementById("courses-button");
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
		allCoursesButton.addEventListener("click", () => {
			DbCom.getCourses().then((courses) => {
				coursesView.clear();
				coursesView.createCards(courses);
				updatePage("/courses/", "All courses", null);
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