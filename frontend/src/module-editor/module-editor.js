
(function() {
	const courseNameTitle = document.getElementById("courseName");
	const courseName = decodeURIComponent(window.location.pathname.substr(14));//Remove "/createmodule/"
	let courseID = null;
	DbCom.getCourseByName(courseName).then((result) => {
		if(result.hasOwnProperty("error")) {
			//Error
		} else {
			courseID = result.id;
			createModuleButton.innerHTML = "<p>Create module</p>";
			createModuleButton.disabled = false;
		}
	});
	courseNameTitle.textContent = decodeURIComponent(courseName);

	const moduleName = document.getElementById("moduleName");
	const moduleDescription = document.getElementById("moduleDescription");
	const createModuleButton = document.getElementById("createModuleButton");
	const message = document.getElementById("message");

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
})();
