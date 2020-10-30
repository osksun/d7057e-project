const coursesViewManager = new function() {
	const cardContainer = document.getElementById("course-cards-container");
	const editorContainer = document.getElementById("course-editor-container");

	this.containers =  {
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

	function createCard(id, name, color) {
		const card = document.createElement("div");
		card.className = "course-card";
		const a = document.createElement("a");
		a.href = "#";
		const header = document.createElement("div");
		header.className = "course-card-header";
		header.style.backgroundColor = color;
		const title = document.createElement("h3");
		title.innerText = name;
		header.appendChild(title);
		const info = document.createElement("ul");
		info.innerHTML = "<li><span>Progress: 6/10</span></li><li><span>Next reward: 6/10</span></li>";
		info.style.color = color;
		a.appendChild(header);
		a.appendChild(info);
		card.appendChild(a);
		a.addEventListener("click", (event) => {
			modulesViewManager.display(modulesViewManager.containers.CARD, id, name, color, true);
			event.preventDefault();
		});
		return card;
	}

	const createAdminCreateCard = () => {
		const card = document.createElement("li");
		card.className = "course-card";
		const a = document.createElement("a");
		a.href = "#";
		const header = document.createElement("div");
		header.className = "course-card-header";
		header.style.backgroundColor = "#fff";
		const title = document.createElement("h3");
		header.appendChild(title);
		const info = document.createElement("ul");
		info.innerHTML = "<img style=\"display:block;margin:20px auto 35px auto;width:64px;\" src=\"/src/index/svg/add.svg\">";
		a.appendChild(header);
		a.appendChild(info);
		card.appendChild(a);
		card.addEventListener("click", (event) => {
			this.display(this.containers.EDITOR, true);
			event.preventDefault();
		});
		return card;
	};

	this.createCards = function(courses) {
		courses.forEach((course) => {
			cardContainer.appendChild(createCard(course.id, course.name, "#" + course.color));
		});

		DbCom.isAdmin().then((result) => {
			if(result.isAdmin) {
				cardContainer.appendChild(createAdminCreateCard());
			}
		});
	};

	this.clearCards = function() {
		cardContainer.innerHTML = "";
	};

	this.display = function(container, addToHistory) {
		switch (container) {
			case this.containers.CARD:
				this.clearCards();
				DbCom.getCourses().then((courses) => {
					this.createCards(courses);
					toggleCardContainer();
					viewManager.updatePage("/", "All courses", addToHistory);
					viewManager.toggleCoursesView();
				}).catch((err) => {
					console.log(err);
				});
				break;
			case this.containers.EDITOR:
				toggleEditorContainer();
				viewManager.updatePage("/createcourse", "Create course", addToHistory);
				viewManager.toggleCoursesView();
				break;
		}
	};
}();
