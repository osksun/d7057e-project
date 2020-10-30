const moduleEditor = new function() {
	const courseNameTitle = document.getElementById("module-editor-course-name");
	let courseID = null;

	this.setup = function(courseName) {
		DbCom.getCourseByName(courseName).then((course) => {
			courseID = course.id;
			createModuleButton.innerHTML = "<p>Create module</p>";
			createModuleButton.disabled = false;
		}).catch((err) => {
			console.log(err);
		});
		courseNameTitle.textContent = decodeURIComponent(courseName);
	};

	const moduleName = document.getElementById("module-editor-module-name");
	const moduleDescription = document.getElementById("module-editor-module-description");
	const createModuleButton = document.getElementById("module-editor-create-module-button");
	const message = document.getElementById("module-editor-message");

	function createModule() {
		return new Promise((resolve, reject) => {
			DbCom.createModule(moduleName.value, courseID, moduleDescription.value).then(() => {
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

	createModuleButton.addEventListener("click", () => {
		if(moduleName.reportValidity() && moduleDescription.reportValidity() && courseID != null) {
			createModuleButton.innerHTML = "<p>. . .</p>";
			createModuleButton.disabled = true;

			createModule().then(() => {
				moduleName.value = "";
				moduleDescription.value = "";
				showMessage("", false);
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				createModuleButton.innerHTML = "<p>Create module</p>";
				createModuleButton.disabled = false;
			});
		}
	});
}();