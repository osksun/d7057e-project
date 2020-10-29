let viewManager;

window.addEventListener("load", () => {
	viewManager = new function() {
		const courseViewContainers = {
			CARD: "card",
			EDITOR: "editor"
		};

		const coursesButton = document.getElementById("courses-button");
		const modulesButton = document.getElementById("modules-button");
		const questionButton = document.getElementById("question-button");
		const coursesView = document.getElementById("courses-view");
		const modulesView = document.getElementById("modules-view");
		const questionView = document.getElementById("question-view");
		
		// Setup category buttons
		coursesButton.addEventListener("click", () => {
			this.toggleCourseView();
			coursesViewManager.display(true);
		});
		modulesButton.addEventListener("click", () => {
			this.toggleModulesView();
		});
		questionButton.addEventListener("click", () => {
			this.toggleQuestionView();
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

		this.toggleCourseView = function (toggleContainer = courseViewContainers.CARD) {
			toggleView(coursesButton, coursesView, [modulesButton, questionButton], [modulesView, questionView]);
			switch (toggleContainer) {
				case courseViewContainers.CARD:
					coursesViewManager.toggleCardContainer();
					break;
				case courseViewContainers.EDITOR:
					coursesViewManager.toggleEditorContainer();
					break;
			}
		};

		this.toggleModulesView = function () {
			toggleView(modulesButton, modulesView, [questionButton, coursesButton], [questionView, coursesView]);
		};

		this.toggleQuestionView = function () {
			toggleView(questionButton, questionView, [coursesButton, modulesButton], [coursesView, modulesView]);
		};

		this.loadCourses = function (addToHistory) {
			this.toggleCourseView();
			coursesViewManager.display(addToHistory);
		};
		
		this.loadCreateCourse = function () {
			this.toggleCourseView(courseViewContainers.EDITOR);
		};

		this.loadCourse = function (courseName, addToHistory) {
			DbCom.getCourseByName(courseName).then((course) => {
				modulesViewManager.display(course.id, course.name, "#" + course.color, addToHistory);
			}).catch(() => {
				// 404 Course not found	
			});
		};

		this.loadModule = function (courseName, moduleName, addToHistory) {
			DbCom.getCourseByName(courseName).then((course) => {
				DbCom.getModuleByName(course.id, moduleName).then((module) => {
					modulesViewManager.updateButton(course.id, course.name, "#" + course.color);
					questionViewManager.displayRandom(course.id, course.name, module.id, module.name, addToHistory);
				}).catch(() => {
					// 404 Module not found
				});
			}).catch(() => {
				// 404 Course not found
			});
		};

		this.loadPath = function (pathname, addToHistory = true) {
			const pathArray = pathname.substring(1).split("/");
			// /createcourse => ["createCourse"] => length = 1
			// /courses/course-name => [courses", "course-name"] => length = 2
			// /courses/course-name/module-name => ["courses", "course-name", "module-name"] => length = 3
			switch (pathArray.length) {
				case 1:
					switch (pathArray[0]) {
						case "createcourse":
							this.loadCreateCourse();
							break;
						case "":
							this.loadCourses(addToHistory);
							break;
					}
					break;
				case 2: {
					const courseName = decodeURIComponent(pathArray[1]);
					this.loadCourse(courseName, addToHistory);
					break;
				} case 3: {
					const courseName = decodeURIComponent(pathArray[1]);
					const moduleName = decodeURIComponent(pathArray[2]);
					this.loadModule(courseName, moduleName, addToHistory);
					break;
				}
			}
		};
		this.loadPath(window.location.pathname, false);
	}();
});

window.onpopstate = function(e) {
	viewManager.loadPath(window.location.pathname, false);
};
