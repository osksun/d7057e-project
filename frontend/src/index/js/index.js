let viewManager;

window.addEventListener("load", () => {
	viewManager = new function() {
		const coursesButton = document.getElementById("courses-button");
		const modulesButton = document.getElementById("modules-button");
		const questionButton = document.getElementById("question-button");
		const coursesButtonView = document.getElementById("view-courses");
		const modulesButtonView = document.getElementById("view-modules");
		const questionButtonView = document.getElementById("view-question");
		// Setup category buttons
		coursesButton.addEventListener("click", () => {
			this.toggleCourseView();
			coursesView.display(true);
		});
		modulesButton.addEventListener("click", () => {
			this.toggleModulesView();
		});
		questionButton.addEventListener("click", () => {
			this.toggleQuestionView();
		});
		
		this.loadCourses = function (addToHistory) {
			coursesView.display(addToHistory);
		};

		this.loadCourse = function (courseName, addToHistory) {
			DbCom.getCourseByName(courseName).then((course) => {
				modulesView.display(course.id, course.name, "#" + course.color, addToHistory);
			}).catch(() => {
				// 404 Course not found	
				this.loadCourses(addToHistory);
			});
		};

		this.loadModule = function (courseName, moduleName, addToHistory) {
			DbCom.getCourseByName(courseName).then((course) => {
				DbCom.getModuleByName(course.id, moduleName).then((module) => {
					modulesView.updateButton(course.id, course.name, "#" + course.color);
					questionView.displayRandom(course.id, course.name, module.id, module.name, addToHistory);
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
		this.loadPath(window.location.pathname);

		function toggleView(activeButton, visibleView, unselectedButtons, hiddenViews) {
			activeButton.classList.add("selected");
			visibleView.classList.add("visible");
			unselectedButtons.forEach(button => button.classList.remove("selected"));
			hiddenViews.forEach(view => view.classList.remove("visible"));
		}

		this.toggleCourseView = function () {
			toggleView(coursesButton, coursesButtonView, [modulesButton, questionButton], [modulesButtonView, questionButtonView]);
		};

		this.toggleModulesView = function () {
			toggleView(modulesButton, modulesButtonView, [questionButton, coursesButton], [questionButtonView, coursesButtonView]);
		};

		this.toggleQuestionView = function () {
			toggleView(questionButton, questionButtonView, [coursesButton, modulesButton], [coursesButtonView, modulesButtonView]);
		};
	}();
});

function updatePage(url, title, addToHistory) {
	document.title = title;
	if (addToHistory) {
		window.history.pushState({"pageTitle":title}, "", url);
	}
}

window.onpopstate = function(e) {
	if(e.state) {
		//document.getElementById("content").innerHTML = e.state.html;
		document.title = e.state.pageTitle;
		viewManager.loadPath(window.location.pathname, false);
	}
};
