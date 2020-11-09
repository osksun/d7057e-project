const modulesViewManager = new function() {
	const cardContainer = document.getElementById("module-cards-container");
	const editorContainer = document.getElementById("module-editor-container");
	const modulesbutton = document.getElementById("modules-button");
	let displayHandler;

	this.containers = {
		CARD: 0,
		EDITOR: 1
	};

	function toggleEditorContainer() {
		cardContainer.classList.remove("visible");
		editorContainer.classList.add("visible");
	}

	function toggleCardContainer() {
		editorContainer.classList.remove("visible");
		cardContainer.classList.add("visible");
	}

	function createCard(id, name, description, color, courseId, courseName) {
		const card = document.createElement("button");
		card.className = "card";
		const cardWrapper = document.createElement("div");
		const header = document.createElement("div");
		header.className = "card-header";
		header.style.backgroundColor = color;
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
			event.preventDefault();
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
			this.display(this.containers.EDITOR, courseId, courseName, color, true);
			event.preventDefault();
		});
		return card;
	};

	this.createCards = function(modules, color, courseId, courseName) {
		modules.forEach((module) => {
			cardContainer.appendChild(createCard(module.id, module.name, module.description, color, courseId, courseName));
		});

		DbCom.isModerator(courseId).then((result) => {
			if(result.isModerator) {
				cardContainer.appendChild(createAdminCreateCard(courseId, courseName, color));
			}
		});
	};

	this.clear = function() {
		cardContainer.innerHTML = "";
	};

	this.display = function(container, courseId, courseName, color, addToHistory) {
		switch (container) {
			case this.containers.CARD:
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
				break;
			case this.containers.EDITOR:
				moduleEditor.setup(courseId, courseName);
				toggleEditorContainer();
				viewManager.updatePage("/createmodule/" + encodeURIComponent(courseName), "Create module", addToHistory);
				this.updateButton(courseId, courseName, color);
				viewManager.toggleModulesView();
				break;
		}
	};

	this.updateButton = function(courseId, courseName, color) {
		modulesbutton.disabled = false;
		modulesbutton.children[0].innerText = courseName;
		modulesbutton.removeEventListener("click", displayHandler);
		displayHandler = this.display.bind(this, this.containers.CARD, courseId, courseName, color, true);
		modulesbutton.addEventListener("click", displayHandler);
	};
}();
