let viewManager;

window.addEventListener("load", () => {
	viewManager = new function() {
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
		
		this.loadCourses = function (addToHistory) {
			coursesViewManager.display(addToHistory);
		};

		this.loadCourse = function (courseName, addToHistory) {
			DbCom.getCourseByName(courseName).then((course) => {
				modulesViewManager.display(course.id, course.name, "#" + course.color, addToHistory);
			}).catch(() => {
				// 404 Course not found	
				this.loadCourses(addToHistory);
			});
		};

		this.loadModule = function (courseName, moduleName, addToHistory) {
			DbCom.getCourseByName(courseName).then((course) => {
				DbCom.getModuleByName(course.id, moduleName).then((module) => {
					modulesViewManager.updateButton(course.id, course.name, "#" + course.color);
					questionViewManager.displayRandom(course.id, course.name, module.id, module.name, addToHistory);
				}).catch(() => {
					// 404 Module not found
					this.loadCourses(addToHistory);
				});
			}).catch(() => {
				// 404 Course not found
				this.loadCourses(addToHistory);
			});
		};

		this.loadPath = function (pathname, addToHistory = true) {
			const pathArray = pathname.split("/");
			// /courses/course-name => ["", "courses", "course-name"] => length = 3
			// /courses/course-name/module-name => ["", "courses", "course-name", "module-name"] => length = 4
			switch (pathArray.length) {
				case 3: {
					const courseName = decodeURIComponent(pathArray[2]);
					this.loadCourse(courseName, addToHistory);
					break;
				} case 4: {
					const courseName = decodeURIComponent(pathArray[2]);
					const moduleName = decodeURIComponent(pathArray[3]);
					this.loadModule(courseName, moduleName, addToHistory);
					break;
				} default:
					this.loadCourses(addToHistory);
			}
		};
		this.loadPath(window.location.pathname, false);

		function toggleView(activeButton, visibleView, unselectedButtons, hiddenViews) {
			activeButton.classList.add("selected");
			visibleView.classList.add("visible");
			unselectedButtons.forEach(button => button.classList.remove("selected"));
			hiddenViews.forEach(view => view.classList.remove("visible"));
		}

		this.toggleCourseView = function () {
			toggleView(coursesButton, coursesView, [modulesButton, questionButton], [modulesView, questionView]);
		};

		this.toggleModulesView = function () {
			toggleView(modulesButton, modulesView, [questionButton, coursesButton], [questionView, coursesView]);
		};

		this.toggleQuestionView = function () {
			toggleView(questionButton, questionView, [coursesButton, modulesButton], [coursesView, modulesView]);
		};
	}();
});

window.onpopstate = function(e) {
	viewManager.loadPath(window.location.pathname, false);
};
