let viewManager;

window.addEventListener("load", () => {
	viewManager = new function() {
		const coursesButton = document.getElementById("courses-button");
		const modulesButton = document.getElementById("modules-button");
		const questionButton = document.getElementById("question-button");
		const coursesView = document.getElementById("courses-view");
		const modulesView = document.getElementById("modules-view");
		const questionView = document.getElementById("question-view");
		
		coursesButton.addEventListener("click", () => {
			this.loadCourses(true);
		});

		this.updatePage = function(url, title, addToHistory) {
			document.title = title;
			if (addToHistory) {
				window.history.pushState({"pageTitle":title}, "", url);
			}
		};
		
		function toggleView(activeButton, visibleView, unselectedButtons, hiddenViews) {
			activeButton.classList.add("selected");
			visibleView.classList.add("visible");
			unselectedButtons.forEach(button => button.classList.remove("selected"));
			hiddenViews.forEach(view => view.classList.remove("visible"));
		}

		this.toggleCoursesView = function () {
			toggleView(coursesButton, coursesView, [modulesButton, questionButton], [modulesView, questionView]);
		};

		this.toggleModulesView = function () {
			toggleView(modulesButton, modulesView, [questionButton, coursesButton], [questionView, coursesView]);
		};

		this.toggleQuestionView = function () {
			toggleView(questionButton, questionView, [coursesButton, modulesButton], [coursesView, modulesView]);
		};

		this.loadCourses = function (addToHistory) {
			coursesViewManager.display(coursesViewManager.containers.CARD, addToHistory);
		};
		
		this.loadCreateCourse = function (addToHistory) {
			coursesViewManager.display(coursesViewManager.containers.EDITOR, addToHistory);
		};

		this.loadCourse = function (courseName, addToHistory) {
			DbCom.getCourseByName(courseName).then((course) => {
				modulesViewManager.display(modulesViewManager.containers.CARD, course.id, course.name, "#" + course.color, addToHistory);
			}).catch((err) => {
				console.log(err);
			});
		};

		this.loadCreateModule = function (courseName, addToHistory) {
			modulesViewManager.display(modulesViewManager.containers.EDITOR, null, courseName, null, addToHistory);
			this.updatePage("/createmodule/" + encodeURIComponent(courseName.toLowerCase()), "Create module", addToHistory);
			this.toggleModulesView();
		};

		this.loadModule = function (courseName, moduleName, addToHistory) {
			DbCom.getCourseByName(courseName).then((course) => {
				DbCom.getModuleByName(course.id, moduleName).then((module) => {
					modulesViewManager.updateButton(course.id, course.name, "#" + course.color);
					questionViewManager.displayRandom(course.id, course.name, module.id, module.name, addToHistory);
				}).catch((err) => {
					console.log(err);
				});
			}).catch((err) => {
				console.log(err);
			});
		};

		this.loadPath = function (pathname, addToHistory = true) {
			const pathArray = pathname.substring(1).split("/");
			switch (pathArray.length) {
				case 1:
					switch (pathArray[0]) {
						case "":
							// /
							this.loadCourses(addToHistory);
							break;
						case "createcourse":
							// /createcourse
							this.loadCreateCourse(addToHistory);
							break;
						}
						break;
				case 2:
					switch (pathArray[0]) {
						case "courses": {
							// /courses/course-name
							const courseName = decodeURIComponent(pathArray[1]);
							this.loadCourse(courseName, addToHistory);
							break;
						}
						case "createmodule": {
							// /createmodule/course-name
							const courseName = pathArray[1];
							this.loadCreateModule(courseName);
							break;
						}
					}
					break;
				case 3: {
					// /courses/course-name/module-name
					const courseName = decodeURIComponent(pathArray[1]);
					const moduleName = decodeURIComponent(pathArray[2]);
					this.loadModule(courseName, moduleName, addToHistory);
					break;
				}
			}
		};
	}();
	viewManager.loadPath(window.location.pathname, false);
});

window.onpopstate = function(e) {
	viewManager.loadPath(window.location.pathname, false);
};
