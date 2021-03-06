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
			coursesViewManager.displayCourses(true);
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

		this.loadCourseView = function (container, courseName, moduleName, addToHistory) {
			DbCom.getCourseByName(courseName).then((course) => {
				switch (container) {
					case modulesViewManager.containers.MODULES:
						modulesViewManager.displayModules(course.id, course.name, "#" + course.color, addToHistory);
						break;
					case modulesViewManager.containers.EDIT_MODULE:
						modulesViewManager.displayEditModule(course.id, course.name, "#" + course.color, moduleName, addToHistory);
						break;
					case modulesViewManager.containers.CREATE_MODULE:
						modulesViewManager.displayCreateModule(course.id, course.name, "#" + course.color, addToHistory);
						break;
				}
			}).catch((err) => {
				this.redirect404();
			});
		};

		this.loadQuestionView = function (container, courseName, moduleName, questionId, addToHistory) {
			return new Promise((resolve, reject) => {
				DbCom.getCourseByName(courseName).then((course) => {
					DbCom.getModuleByName(course.id, moduleName).then((module) => {
						modulesViewManager.updateButton(course.id, course.name, "#" + course.color);
						switch (container) {
							case questionViewManager.containers.QUESTION:
								questionViewManager.displayQuestion(course.id, course.name, module.id, module.name, addToHistory);
								resolve();
								break;
							case questionViewManager.containers.EDIT_QUESTION:
								questionViewManager.displayEditQuestion(course.id, course.name, module.id, module.name, questionId, addToHistory);
								resolve();
								break;
							case questionViewManager.containers.CREATE_QUESTION:
								questionViewManager.displayCreateQuestion(course.id, course.name, module.id, module.name, addToHistory);
								resolve();
								break;
							case questionViewManager.containers.QUESTION_LIST:
								questionViewManager.displayQuestionList(course.id, course.name, module.id, module.name, addToHistory);
								resolve();
								break;
							default:
								reject();
								break;
						}
					}).catch((err) => {
						this.redirect404();
						reject();
					});
				}).catch((err) => {
					this.redirect404();
					reject();
				});
			});
		};

		this.redirect404 = function() {
			document.location.href = "/404";
		};

		this.loadPath = function (pathname, addToHistory) {
			const pathArray = pathname.substring(1).split("/");
			switch (pathArray.length) {
				case 1:
					switch (pathArray[0]) {
						case "":
							// /
							coursesViewManager.displayCourses(addToHistory);
							break;
						case "createcourse":
							// /createcourse
							coursesViewManager.displayCreateCourse(addToHistory);
							break;
						}
						break;
				case 2:
					switch (pathArray[0]) {
						case "courses": {
							// /courses/course-name
							const courseName = decodeURIComponent(pathArray[1]);
							this.loadCourseView(modulesViewManager.containers.MODULES, courseName, addToHistory);
							break;
						}
						case "editcourse": {
							// /editcourse/course-name
							const courseName = decodeURIComponent(pathArray[1]);
							coursesViewManager.displayEditCourse(courseName, addToHistory);
							break;
						}
						case "createmodule": {
							// /createmodule/course-name
							const courseName = decodeURIComponent(pathArray[1]);
							this.loadCourseView(modulesViewManager.containers.CREATE_MODULE, courseName, addToHistory);
							break;
						}
						case "moderators": {
							// /moderators/course-name
							const courseName = decodeURIComponent(pathArray[1]);
							coursesViewManager.displayModeratorsList(courseName, addToHistory);
							break;
						}
					}
					break;
				case 3: {
					switch (pathArray[0]) {
						case "courses": {
							// /courses/course-name/module-name
							const courseName = decodeURIComponent(pathArray[1]);
							const moduleName = decodeURIComponent(pathArray[2]);
							this.loadQuestionView(questionViewManager.containers.QUESTION, courseName, moduleName, null, addToHistory);
							break;
						}
						case "questionlist": {
							// /questionlist/course-name/module-name
							const courseName = decodeURIComponent(pathArray[1]);
							const moduleName = decodeURIComponent(pathArray[2]);
							this.loadQuestionView(questionViewManager.containers.QUESTION_LIST, courseName, moduleName, null, addToHistory);
							break;
						}
						case "createquestion": {
							// /createquestion/course-name/module-name
							const courseName = decodeURIComponent(pathArray[1]);
							const moduleName = decodeURIComponent(pathArray[2]);
							this.loadQuestionView(questionViewManager.containers.CREATE_QUESTION, courseName, moduleName, null, addToHistory);
							break;
						}
						case "editmodule": {
							// /editmodule/course-name/module-name
							const courseName = decodeURIComponent(pathArray[1]);
							const moduleName = decodeURIComponent(pathArray[2]);
							this.loadCourseView(modulesViewManager.containers.EDIT_MODULE, courseName, moduleName, addToHistory);
							break;
						}
					}
					break;
				}
				case 4: {
					switch (pathArray[0]) {
						case "editquestion": {
							// /editquestion/course-name/module-name/question-id
							const courseName = decodeURIComponent(pathArray[1]);
							const moduleName = decodeURIComponent(pathArray[2]);
							const questionId = pathArray[3];
							this.loadQuestionView(questionViewManager.containers.EDIT_QUESTION, courseName, moduleName, questionId, addToHistory);
							break;
						}
					}
				}
			}
		};
	}();
	viewManager.loadPath(window.location.pathname, false);
});

window.onpopstate = function(e) {
	viewManager.loadPath(window.location.pathname, false);
};
