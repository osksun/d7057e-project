const modulesViewManager = new function() {
	const cardContainer = document.getElementById("module-cards-container");
	const editorContainer = document.getElementById("module-editor-container");
	const modulesbutton = document.getElementById("modules-button");
	let displayHandler = () => {};

	modulesbutton.addEventListener("click", () => {
		displayHandler();
	});

	this.containers = {
		MODULES: 0,
		EDIT_MODULE: 1,
		CREATE_MODULE: 2
	};

	function toggleEditorContainer() {
		cardContainer.classList.remove("visible");
		editorContainer.classList.add("visible");
	}

	function toggleCardContainer() {
		editorContainer.classList.remove("visible");
		cardContainer.classList.add("visible");
	}

	function createCard(id, name, color, questionCount, answerCount, courseId, courseName, isModerator) {
		const card = document.createElement("button");
		card.className = "card";
		const cardWrapper = document.createElement("div");
		const header = document.createElement("div");
		header.className = "card-header";
		header.style.backgroundColor = color;
		if (isModerator) {
			const editButton = document.createElement("button");
			const editButtonIcon = document.createElement("img");
			editButtonIcon.src = "/src/index/svg/edit.svg";
			editButtonIcon.alt = "edit module";
			editButton.appendChild(editButtonIcon);
			editButton.addEventListener("click", (event) => {
				modulesViewManager.displayEditModule(courseId, courseName, color, name, true);
				event.preventDefault(); // Might not be needed anymore
				event.stopPropagation();
			});
			header.appendChild(editButton);
		}
		const titleWrapper = document.createElement("div");
		const title = document.createElement("h3");
		title.innerText = name;
		titleWrapper.appendChild(title);
		header.appendChild(titleWrapper);
		const descWrapper = document.createElement("div");
		descWrapper.className = "description-wrapper";
		const info = document.createElement("ul");
		info.innerHTML = "<li><span>Progress: " + answerCount + "/" + questionCount + "</span></li>";
		info.style.color = color;
		descWrapper.appendChild(info);
		cardWrapper.appendChild(header);
		cardWrapper.appendChild(descWrapper);
		card.appendChild(cardWrapper);
		card.addEventListener("click", (event) => {
			if (isModerator) {
				questionViewManager.displayQuestionList(courseId, courseName, id, name, true);
			} else {
				questionViewManager.displayQuestion(courseId, courseName, id, name, true);
			}
			event.preventDefault(); // Might not be needed anymore
		});
		return card;
	}

	const createAdminCreateCard = (courseId, courseName, color) => {
		const card = document.createElement("button");
		card.className = "card";
		const cardWrapper = document.createElement("div");
		const titleWrapper = document.createElement("div");
		const header = document.createElement("div");
		header.className = "card-header";
		header.style.backgroundColor = "#888";
		const title = document.createElement("h3");
		title.innerHTML = "<img style=\"display:block;margin:10px auto 0 auto;width:64px;\" src=\"/src/index/svg/add.svg\">";
		titleWrapper.appendChild(title);
		header.appendChild(titleWrapper);
		const span = document.createElement("span");
		span.style.float = "none";
		span.style.display = "block";
		span.innerHTML = "<br><br>";
		cardWrapper.appendChild(header);
		cardWrapper.appendChild(span);
		card.appendChild(cardWrapper);
		card.addEventListener("click", (event) => {
			this.displayCreateModule(courseId, courseName, color, true);
			event.preventDefault();
		});
		return card;
	};

	this.createCards = function(modules, color, courseId, courseName) {
		DbCom.isModerator(courseId).then((result) => {
			modules.forEach((module) => {
				cardContainer.appendChild(createCard(module.id, module.name, color, module.questionCount, module.answerCount, courseId, courseName, result.isModerator));
			});
			if(result.isModerator) {
				cardContainer.appendChild(createAdminCreateCard(courseId, courseName, color));
			}
		});
	};

	this.clear = function() {
		cardContainer.innerHTML = "";
	};

	this.displayModules = function(courseId, courseName, color, addToHistory) {
		DbCom.getModules(courseId).then((modules) => {
			this.clear();
			this.createCards(modules, color, courseId, courseName);
			toggleCardContainer();
			viewManager.updatePage("/courses/" + encodeURIComponent(courseName.toLowerCase()), courseName, addToHistory);
			questionViewManager.updateButton(courseId);
			this.updateButton(courseId, courseName, color);
			viewManager.toggleModulesView();
		}).catch((err) => {
			viewManager.redirect404();
		});
	};

	this.displayEditModule = function(courseId, courseName, color, moduleName, addToHistory) {
		moduleEditor.setupEdit(courseId, courseName, color, moduleName);
		toggleEditorContainer();
		viewManager.updatePage("/editmodule/" + encodeURIComponent(courseName) + "/" + encodeURIComponent(moduleName), "Edit module", addToHistory);
		this.updateButton(courseId, courseName, color);
		viewManager.toggleModulesView();
	};

	this.displayCreateModule = function(courseId, courseName, color, addToHistory) {
		moduleEditor.setupCreate(courseId, courseName);
		toggleEditorContainer();
		viewManager.updatePage("/createmodule/" + encodeURIComponent(courseName), "Create module", addToHistory);
		this.updateButton(courseId, courseName, color);
		viewManager.toggleModulesView();
	};

	this.updateButton = function(courseId, courseName, color) {
		modulesbutton.disabled = false;
		modulesbutton.children[0].innerText = courseName;
		displayHandler =  () => this.displayModules(courseId, courseName, color, true);
	};

	this.disableButton = function() {
		modulesbutton.disabled = true;
		modulesbutton.children[0].innerText = "Modules";
		displayHandler = () => {};
		questionViewManager.disableButton();
	};
}();
