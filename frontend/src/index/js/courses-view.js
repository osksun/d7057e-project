const coursesView = new function() {
    const coursesViewDiv = document.getElementById("view-courses");

    function createCard(id, name, color) {
        const card = document.createElement("li");
        card.className = "course-card";
        const a = document.createElement("a");
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
        card.addEventListener("click", () => {
            modulesView.display(id, name, color);
        });
        return card;
    }

    this.createCards = function(courses) {
        courses.forEach((course) => {
            coursesViewDiv.appendChild(createCard(course.id, course.name, "#" + course.color));
        });
    }

    this.clear = function() {
        coursesViewDiv.innerHTML = "";
    }
}