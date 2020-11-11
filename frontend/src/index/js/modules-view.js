const modulesViewManager = new function() {
	const cardContainer = document.getElementById("module-cards-container");
	const editorContainer = document.getElementById("module-editor-container");
	const modulesbutton = document.getElementById("modules-button");
	let displayHandler;

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

	function createCard(id, name, description, color, courseId, courseName, isModerator) {
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
		const paragraph = document.createElement("p");
		paragraph.className = ""
		paragraph.style.color = color;
		paragraph.innerText = description;
		descWrapper.appendChild(paragraph);
		cardWrapper.appendChild(header);
		cardWrapper.appendChild(descWrapper);
		/*cardWrapper.appendChild(span);*/
		card.appendChild(cardWrapper);
		card.addEventListener("click", (event) => {
			questionViewManager.display(questionViewManager.containers.QUESTION ,courseId, courseName, id, name, true);
			event.preventDefault(); // Might not be needed anymore
		});
		return card;
	}

	const createAdminCreateCard = (courseId, courseName, color) => {
		const card = document.createElement("li");
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
				cardContainer.appendChild(createCard(module.id, module.name, module.description, color, courseId, courseName, result.isModerator));
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
			console.log(err);
		});
	};
	
	this.displayEditModule = function(courseId, courseName, color, moduleName, addToHistory) {
		moduleEditor.setupEdit(courseId, courseName, moduleName);
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
		modulesbutton.removeEventListener("click", displayHandler);
		displayHandler = this.displayModules.bind(this, courseId, courseName, color, true);
		modulesbutton.addEventListener("click", displayHandler);
	};
}();
