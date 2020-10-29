const modulesViewManager = new function() {
	const modulesViewDiv = document.getElementById("modules-view");
	const coursebutton = document.getElementById("modules-button");
	let displayHandler;

	function createCard(id, name, description, color, courseId, courseName) {
		const card = document.createElement("li");
		card.className = "module-card";
		const a = document.createElement("a");
		a.href = "#";
		const header = document.createElement("div");
		header.className = "module-card-header";
		header.style.backgroundColor = color;
		const title = document.createElement("h3");
		title.innerText = name;
		header.appendChild(title);
		const span = document.createElement("span");
		span.style.color = color;
		span.innerText = description;
		a.appendChild(header);
		a.appendChild(span);
		card.appendChild(a);
		card.addEventListener("click", (event) => {
			questionViewManager.displayRandom(courseId, courseName, id, name);
			event.preventDefault();
		});
		return card;
	}

	function createAdminCreateCard(courseName) {
		const card = document.createElement("li");
		card.className = "module-card";
		const a = document.createElement("a");
		a.href = "/createmodule/" + encodeURIComponent(courseName);
		const header = document.createElement("div");
		header.className = "module-card-header";
		header.style.backgroundColor = "#fff";
		const span = document.createElement("span");
		span.style.float = "none";
		span.style.display = "block";
		span.innerHTML = "<img style=\"display:block;margin:20px auto 35px auto;width:64px;\" src=\"/src/index/svg/add.svg\">";
		a.appendChild(header);
		a.appendChild(span);
		card.appendChild(a);
		return card;
	}

	this.createCards = function(modules, color, courseId, courseName) {
		modules.forEach((module) => {
			modulesViewDiv.appendChild(createCard(module.id, module.name, module.description, color, courseId, courseName));
		});

		DbCom.isModerator(courseId).then((result) => {
			if(result.isModerator) {
				modulesViewDiv.appendChild(createAdminCreateCard(courseName));
			}
		});
	};

	this.clear = function() {
		modulesViewDiv.innerHTML = "";
	};

	this.display = function(courseId, courseName, color, addToHistory = true) {
		DbCom.getModules(courseId).then((modules) => {
			this.clear();
			this.createCards(modules, color, courseId, courseName);
			questionViewManager.updateButton(encodeURIComponent(courseName));
			viewManager.updatePage("/courses/" + encodeURIComponent(courseName.toLowerCase()), courseName, addToHistory);
			this.updateButton(courseId, courseName, color, true);
			viewManager.toggleModulesView();
		});
	};

	this.updateButton = function(courseId, courseName, color, click = false) {
		coursebutton.disabled = false;
		coursebutton.children[0].innerText = courseName;
		coursebutton.removeEventListener("click", displayHandler);
		displayHandler = this.display.bind(this, courseId, courseName, color);
		coursebutton.addEventListener("click", displayHandler);
	};
}();
