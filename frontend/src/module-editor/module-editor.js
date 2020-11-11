const moduleEditor = new function() {
	const courseNameTitle = document.getElementById("module-editor-course-name");
	const moduleName = document.getElementById("module-editor-module-name");
	const moduleDescription = document.getElementById("module-editor-module-description");
	const createModuleButton = document.getElementById("module-editor-submit-button");
	const message = document.getElementById("module-editor-message");
	let courseId = null;
	let courseName = null;
	let submitHandler = null;

	this.setupCreate = function(_courseId, courseName) {
		courseId = _courseId;
		createModuleButton.innerHTML = "Create module";
		createModuleButton.disabled = false;
		courseNameTitle.textContent = decodeURIComponent(courseName);
		submitHandler = createModule;
	};

	this.setupEdit = function(_courseId, _courseName, _moduleName) {
		DbCom.getModuleByName(_courseId, _moduleName).then((module) => {
			courseId = _courseId;
			courseName = _courseName;
			createModuleButton.innerHTML = "Update module";
			createModuleButton.disabled = false;
			courseNameTitle.textContent = decodeURIComponent(_courseName);
			moduleName.value = module.name;
			moduleDescription.value = module.description;
			submitHandler = updateModule.bind(this, module.id);
		});
	};

	createModuleButton.addEventListener("click", () => {
		if(moduleName.reportValidity() && moduleDescription.reportValidity() && courseId != null) {
			createModuleButton.innerHTML = ". . .";
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
