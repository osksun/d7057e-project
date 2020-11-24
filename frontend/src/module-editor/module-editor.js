const moduleEditor = new function() {
	const courseNameTitle = document.getElementById("module-editor-course-name");
	const moduleName = document.getElementById("module-editor-module-name");
	const moduleDescription = document.getElementById("module-editor-module-description");
	const createModuleButton = document.getElementById("module-editor-submit-button");
	const message = document.getElementById("module-editor-message");
	const deleteButton = document.getElementById("module-editor-delete-button");
	let courseId = null;
	let courseName = null;
	let courseColor = null;
	let submitHandler = null;
	let editModuleID = null;

	this.setupCreate = function(_courseId, _courseName) {
		clear();
		courseId = _courseId;
		courseName = _courseName;
		courseColor = null;
		createModuleButton.innerHTML = "Create module";
		createModuleButton.disabled = false;
		courseNameTitle.textContent = decodeURIComponent(_courseName);
		submitHandler = () => createModule();
		deleteButton.className = "button hidden";
	};

	this.setupEdit = function(_courseId, _courseName, _courseColor, _moduleName) {
		deleteButton.className = "button hidden";
		DbCom.getModuleByName(_courseId, _moduleName).then((module) => {
			courseId = _courseId;
			courseName = _courseName;
			courseColor = _courseColor;
			createModuleButton.innerHTML = "Update module";
			createModuleButton.disabled = false;
			courseNameTitle.textContent = decodeURIComponent(_courseName);
			moduleName.value = module.name;
			moduleDescription.value = module.description;
			submitHandler = () => updateModule(module.id);

			deleteButton.className = "button";
			editModuleID = module.id;
		});
	};

	createModuleButton.addEventListener("click", () => {
		if(moduleName.reportValidity() && moduleDescription.reportValidity() && courseId != null) {
			createModuleButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
			createModuleButton.disabled = true;
			submitHandler().then(() => {
				viewManager.loadCourseView(modulesViewManager.containers.MODULES, courseName, moduleName.value, true);
				clear();
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				createModuleButton.innerHTML = "";
				createModuleButton.disabled = false;
			});
		}
	});

	deleteButton.addEventListener("click", () => {
		const previousText = deleteButton.textContent;
		deleteButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
		deleteButton.disabled = true;

		messageBox.showConfirm("Are you sure you want to delete this module?", () => {
			deleteButton.textContent = previousText;
			deleteButton.disabled = false;
		}, () => {
			DbCom.deleteModule(editModuleID).then(() => {
				questionViewManager.disableButton();
				modulesViewManager.displayModules(courseId, courseName, courseColor, true);
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

	function createModule() {
		return new Promise((resolve, reject) => {
			DbCom.createModule(moduleName.value, courseId, moduleDescription.value).then(() => {
				resolve();
			}).catch((result) => {
				reject(result);
			});
		});
	}

	function updateModule(id) {
		return new Promise((resolve, reject) => {
			DbCom.updateModule(id, moduleName.value, moduleDescription.value).then(() => {
				resolve();
			}).catch((result) => {
				reject(result);
			});
		});
	}

	function clear() {
		editModuleID = null;
		moduleName.value = "";
		moduleDescription.value = "";
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
