const coursesViewManager = new function() {
	const cardContainer = document.getElementById("course-cards-container");
	const editorContainer = document.getElementById("course-editor-container");
	const moderatorsContainer = document.getElementById("moderators-list-container");

	this.containers =  {
		COURSES: 0,
		EDIT_COURSE: 1,
		CREATE_COURSE: 2,
		MODERATORS_LIST: 3
	};

	function toggleEditorContainer() {
		cardContainer.classList.remove("visible");
		moderatorsContainer.classList.remove("visible");
		editorContainer.classList.add("visible");
	}

	function toggleCardContainer() {
		editorContainer.classList.remove("visible");
		moderatorsContainer.classList.remove("visible");
		cardContainer.classList.add("visible");
	}

	function toggleModeratorsListContainer() {
		editorContainer.classList.remove("visible");
		cardContainer.classList.remove("visible");
		moderatorsContainer.classList.add("visible");
	}

	function createCard(id, name, color, questionCount, answerCount, isAdmin, isModerator) {
		const card = document.createElement("button");
		card.className = "card";
		const cardWrapper = document.createElement("div");
		const header = document.createElement("div");
		header.className = "card-header";
		header.style.backgroundColor = color;
		if (isAdmin || isModerator) {
			const buttonSpan = document.createElement("span");
			header.appendChild(buttonSpan);

			const moderatorButton = document.createElement("button");
			const moderatorButtonIcon = document.createElement("img");
			moderatorButtonIcon.src = "/src/index/svg/moderators.svg";
			moderatorButtonIcon.alt = "Edit moderators";
			moderatorButton.appendChild(moderatorButtonIcon);
			moderatorButton.addEventListener("click", (event) => {
				coursesViewManager.displayModeratorsList(name, true);
				event.preventDefault(); // Might not be needed anymore
				event.stopPropagation();
			});
			buttonSpan.appendChild(moderatorButton);

			const editButton = document.createElement("button");
			const editButtonIcon = document.createElement("img");
			editButtonIcon.src = "/src/index/svg/edit.svg";
			editButtonIcon.alt = "edit course";
			editButton.appendChild(editButtonIcon);
			editButton.addEventListener("click", (event) => {
				coursesViewManager.displayEditCourse(name, true);
				event.preventDefault(); // Might not be needed anymore
				event.stopPropagation();
			});
			buttonSpan.appendChild(editButton);
		}
		const titleWrapper = document.createElement("div");
		const title = document.createElement("h3");
		title.innerText = name;
		titleWrapper.appendChild(title);
		header.appendChild(titleWrapper);
		const descWrapper = document.createElement("div");
		descWrapper.className = "description-wrapper";
		const info = document.createElement("ul");
		const li = document.createElement("li");
		const span = document.createElement("span");
		span.textContent = "Progress: " + answerCount + "/" + questionCount;
		li.appendChild(span);
		info.appendChild(li);
		info.style.color = color;
		descWrapper.appendChild(info);
		cardWrapper.appendChild(header);
		cardWrapper.appendChild(descWrapper);
		card.appendChild(cardWrapper);
		card.addEventListener("click", (event) => {
			modulesViewManager.displayModules(id, name, color, true);
			event.preventDefault(); // Might not be needed anymore
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
			this.displayCreateCourse(true);
			event.preventDefault();
		});
		return card;
	};

	this.createCards = function(courses) {
		DbCom.isAdmin().then((result) => {
			courses.forEach((course) => {
				cardContainer.appendChild(createCard(course.id, course.name, "#" + course.color, course.questionCount, course.answerCount, result.isAdmin, course.isModerator));
			});
			if(result.isAdmin) {
				cardContainer.appendChild(createAdminCreateCard());
			}
		});
	};

	this.clearCards = function() {
		cardContainer.textContent = "";
	};

	this.displayCourses = function(addToHistory) {
		this.clearCards();
		DbCom.getCourses().then((courses) => {
			this.createCards(courses);
			toggleCardContainer();
			viewManager.updatePage("/", "All courses", addToHistory);
			viewManager.toggleCoursesView();
		}).catch((err) => {
		});
	};

	this.displayEditCourse = function(courseName, addToHistory) {
		courseEditor.setupEdit(courseName);
		toggleEditorContainer();
		viewManager.updatePage("/editcourse/" + encodeURIComponent(courseName), "Edit course", addToHistory);
		viewManager.toggleCoursesView();
	};

	this.displayCreateCourse = function(addToHistory) {
		courseEditor.setupCreate();
		toggleEditorContainer();
		viewManager.updatePage("/createcourse", "Create course", addToHistory);
		viewManager.toggleCoursesView();
	};

	this.displayModeratorsList = function(courseName, addToHistory) {
		moderatorsList.setup(courseName);
		toggleModeratorsListContainer();
		viewManager.updatePage("/moderators/" + encodeURIComponent(courseName), "Moderators", addToHistory);
		viewManager.toggleCoursesView();
	};
}();
