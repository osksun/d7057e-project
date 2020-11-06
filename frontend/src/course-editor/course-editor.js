(function() {
	const courseName = document.getElementById("course-editor-course-name");
	const courseColor = document.getElementById("course-editor-course-color");
	const courseDescription = document.getElementById("course-editor-course-description");
	const createCourseButton = document.getElementById("course-editor-create-course-button");
	const message = document.getElementById("course-editor-message");

	function getRandomColor() {
		const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
		let ret = "#";
		for(let i = 0; i < 6; ++i) {
			ret += values[Math.floor(Math.random() * values.length)];
		}
		return ret;
	}
	courseColor.value = getRandomColor();

	function createCourse() {
		return new Promise((resolve, reject) => {
			DbCom.createCourse(courseName.value, courseDescription.value, courseColor.value.substring(1)).then(() => {
				resolve();
			}).catch((result) => {
				reject(result);
			});
		});
	}

	function showMessage(text, isError) {
		message.textContent = text;
		if(isError) {
			message.className = "error";
		} else {
			message.className = "";
		}
	}

	createCourseButton.addEventListener("click", () => {
		if(courseName.reportValidity() && courseDescription.reportValidity()) {
			createCourseButton.innerHTML = "<p>. . .</p>";
			createCourseButton.disabled = true;

			createCourse().then(() => {
				viewManager.loadCourseView(viewManager.containers.CARD, courseName.value, true);
				courseName.value = "";
				courseColor.value = getRandomColor();
				courseDescription.value = "";
				showMessage("", false);
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				createCourseButton.innerHTML = "<p>Create course</p>";
				createCourseButton.disabled = false;
			});
		}
	});
})();
