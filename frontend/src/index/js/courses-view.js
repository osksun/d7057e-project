const coursesViewManager = new function() {
	const cardContainer = document.getElementById("courses-view-card-container");
	const courseEditorContainer = document.getElementById("course-editor-container");

	this.toggleCourseEditor = function() {
		cardContainer.classList.remove("visible");
		courseEditorContainer.classList.add("visible");
	};

	this.toggleCardContainer = function() {
		courseEditorContainer.classList.remove("visible");
		cardContainer.classList.add("visible");
	};

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
			modulesViewManager.display(id, name, color);
			event.preventDefault();
		});
		return card;
	}

	function createAdminCreateCard() {
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
			coursesViewManager.toggleCourseEditor();
			viewManager.updatePage("/createcourse", "Create course", true);
			event.preventDefault();
		});
		return card;
	}

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

	this.clear = function() {
		cardContainer.innerHTML = "";
	};

	this.display = function(addToHistory = true) {
		DbCom.getCourses().then((courses) => {
			this.clear();
			this.createCards(courses);
			viewManager.updatePage("/", "All courses", addToHistory);
			viewManager.toggleCourseView();
		});
	};
}();
