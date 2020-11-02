const moduleEditor = new function() {
	const courseNameTitle = document.getElementById("module-editor-course-name");
	let courseId = null;

	this.setup = function(_courseId, courseName) {
		courseId = _courseId;
		createModuleButton.innerHTML = "<p>Create module</p>";
		createModuleButton.disabled = false;
		courseNameTitle.textContent = decodeURIComponent(courseName);
	};

	const moduleName = document.getElementById("module-editor-module-name");
	const moduleDescription = document.getElementById("module-editor-module-description");
	const createModuleButton = document.getElementById("module-editor-create-module-button");
	const message = document.getElementById("module-editor-message");

	function createModule() {
		return new Promise((resolve, reject) => {
			DbCom.createModule(moduleName.value, courseId, moduleDescription.value).then(() => {
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
		if(moduleName.reportValidity() && moduleDescription.reportValidity() && courseId != null) {
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