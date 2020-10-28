const coursesView = new function() {
	const coursesViewDiv = document.getElementById("view-courses");

	function createCard(id, name, color) {
		const card = document.createElement("li");
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
			modulesView.display(id, name, color);
			event.preventDefault();
		});
		return card;
	}

	function createAdminCreateCard() {
		const card = document.createElement("li");
		card.className = "course-card";
		const a = document.createElement("a");
		a.href = "/createcourse";
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
		return card;
	}

	this.createCards = function(courses) {
		courses.forEach((course) => {
			coursesViewDiv.appendChild(createCard(course.id, course.name, "#" + course.color));
		});

		DbCom.isAdmin().then((result) => {
			if(result.isAdmin) {
				coursesViewDiv.appendChild(createAdminCreateCard());
			}
		});

	};

	this.clear = function() {
		coursesViewDiv.innerHTML = "";
	};
}();
