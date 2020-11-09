const courseEditor = new function() {
	const courseName = document.getElementById("course-editor-course-name");
	const courseColor = document.getElementById("course-editor-course-color");
	const courseDescription = document.getElementById("course-editor-course-description");
	const submitButton = document.getElementById("course-editor-submit-button");
	const message = document.getElementById("course-editor-message");

	this.setupCreate = function() {
		// Setup for create new course
		courseColor.value = getRandomColor();
		submitButton.innerHTML = "<p>Create course</p>";
		submitButton.addEventListener("click", () => {
			if(courseName.reportValidity() && courseDescription.reportValidity()) {
				submitButton.innerHTML = "<p>. . .</p>";
				submitButton.disabled = true;
				createCourse().then(() => {
					viewManager.loadCourseView(modulesViewManager, courseName.value, true);
					clear();
				}).catch((result) => {
					if(result.hasOwnProperty("error")) {
						showMessage("Error: " + result.error, true);
					}
				}).finally(() => {
					submitButton.innerHTML = "";
					submitButton.disabled = false;
				});
			}
		});
	};

	this.setupEdit = function(_courseName) {
		DbCom.getCourseByName(_courseName).then((course) => {
			// Setup for edit existing course
			courseColor.value = "#" + course.color;
			courseName.value = course.name;
			courseDescription.value = course.description;
			submitButton.innerHTML = "<p>Update course</p>";
			submitButton.addEventListener("click", () => {
				if(courseName.reportValidity() && courseDescription.reportValidity()) {
					submitButton.innerHTML = "<p>. . .</p>";
					submitButton.disabled = true;
					updateCourse(course.id).then(() => {
						viewManager.loadCourseView(modulesViewManager.containers.CARD, courseName.value, true);
						clear();
					}).catch((result) => {
						if(result.hasOwnProperty("error")) {
							showMessage("Error: " + result.error, true);
						}
					}).finally(() => {
						submitButton.innerHTML = "<p></p>";
						submitButton.disabled = false;
					});
				}
			});
		});
	};

	function getRandomColor() {
		const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
		let ret = "#";
		for(let i = 0; i < 6; ++i) {
			ret += values[Math.floor(Math.random() * values.length)];
		}
		return ret;
	}

	function createCourse() {
		return new Promise((resolve, reject) => {
			DbCom.createCourse(courseName.value, courseDescription.value, courseColor.value.substring(1)).then(() => {
				resolve();
			}).catch((result) => {
				reject(result);
			});
		});
	}

	function updateCourse(id) {
		return new Promise((resolve, reject) => {
			DbCom.updateCourse(id, courseName.value, courseDescription.value, courseColor.value.substring(1)).then(() => {
				resolve();
			}).catch((result) => {
				reject(result);
			});
		});
	}

	function clear() {
		courseName.value = "";
		courseColor.value = getRandomColor();
		courseDescription.value = "";
		showMessage("", false);
	}

	function showMessage(text, isError) {
		message.textContent = text;
		if(isError) {
			message.className = "error";
		} else {
			message.className = "";
		}
	}
}();
