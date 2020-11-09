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

	function createCard(id, name, color, questionCount, answerCount) {
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
		const info = document.createElement("ul");
		info.innerHTML = "<li><span>Progress: " + answerCount + "/" + questionCount + "</span></li>";
		descWrapper.appendChild(info);
		descWrapper.className = "description-wrapper";
		info.style.color = color;
		cardWrapper.appendChild(header);
		//cardWrapper.appendChild(info);
		cardWrapper.appendChild(descWrapper);
		card.appendChild(cardWrapper);
		card.addEventListener("click", (event) => {
			modulesViewManager.display(modulesViewManager.containers.CARD, id, name, color, true);
			event.preventDefault();
		});
		return card;
	}

	const createAdminCreateCard = () => {
		const card = document.createElement("button");
		card.className = "card";
		const cardWrapper = document.createElement("div");
		const header = document.createElement("div");
		header.className = "card-header";
		header.style.backgroundColor = "#888";
		const titleWrapper = document.createElement("div");
		const title = document.createElement("h3");
		title.innerHTML = "<img style=\"display:block;margin:10px auto 0 auto;width:64px;\" src=\"/src/index/svg/add.svg\">";
		titleWrapper.appendChild(title);
		header.appendChild(titleWrapper);
		const info = document.createElement("ul");
		info.style.color = "#fff";
		info.innerHTML = "<li></li>";
		cardWrapper.appendChild(header);
		cardWrapper.appendChild(info);
		card.appendChild(cardWrapper);
		card.addEventListener("click", (event) => {
			this.display(this.containers.EDITOR, true);
			event.preventDefault();
		});
		return card;
	};

	this.createCards = function(courses) {
		courses.forEach((course) => {
			cardContainer.appendChild(createCard(course.id, course.name, "#" + course.color, course.questionCount, course.answerCount));
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
