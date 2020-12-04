const courseEditor = new function() {
	const courseName = document.getElementById("course-editor-course-name");
	const courseColor = document.getElementById("course-editor-course-color");
	const courseDescription = document.getElementById("course-editor-course-description");
	const submitButton = document.getElementById("course-editor-submit-button");
	const message = document.getElementById("course-editor-message");
	const deleteButton = document.getElementById("course-editor-delete-button");
	let submitHandler = null;
	let editCourseID = null;

	this.setupCreate = function() {
		clear();
		courseColor.value = getRandomColor();
		submitButton.textContent = "Create course";
		submitHandler = createCourse;
		deleteButton.className = "button hidden";
	};

	this.setupEdit = function(_courseName) {
		deleteButton.className = "button hidden";
		DbCom.getCourseByName(_courseName).then((course) => {
			courseColor.value = "#" + course.color;
			courseName.value = course.name;
			courseDescription.value = course.description;
			submitButton.textContent = "Update course";
			submitHandler = updateCourse.bind(this, course.id);

			deleteButton.className = "button";
			editCourseID = course.id;
		});
	};

	submitButton.addEventListener("click", () => {
		if(courseName.reportValidity() && courseDescription.reportValidity()) {
			const previousText = submitButton.textContent;
			submitButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
			submitButton.disabled = true;
			submitHandler().then(() => {
				viewManager.loadCourseView(modulesViewManager.containers.MODULES, courseName.value, null, true);
				clear();
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				submitButton.textContent = previousText;
				submitButton.disabled = false;
			});
		}
	});

	deleteButton.addEventListener("click", () => {
		const previousText = deleteButton.textContent;
		deleteButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
		deleteButton.disabled = true;
		messageBox.showConfirm("Are you sure you want to delete this course?", () => {
			deleteButton.textContent = previousText;
			deleteButton.disabled = false;
		}, () => {
			DbCom.deleteCourse(editCourseID).then(() => {
				modulesViewManager.disableButton();
				coursesViewManager.displayCourses(true);
				clear();
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				deleteButton.textContent = previousText;
				deleteButton.disabled = false;
			});
		});
	});

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
		editCourseID = null;
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
