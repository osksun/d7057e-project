const modulesView = new function() {
    const modulesViewDiv = document.getElementById("view-modules");
    let displayHandler;

    function createCard(id, name, description, color, courseId, courseName) {
        const card = document.createElement("li");
        card.className = "module-card";
        const a = document.createElement("a");
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
        card.addEventListener("click", () => {
            questionView.displayRandom(courseId, courseName, id, name);
        });
        return card;
    }

    this.createCards = function(modules, color, courseId, courseName) {
        modules.forEach((module) => {
            modulesViewDiv.appendChild(createCard(module.id, module.name, module.description, color, courseId, courseName));
        });
    }

    this.clear = function() {
        modulesViewDiv.innerHTML = "";
    }

    this.display = function(courseId, courseName, color) {
        DbCom.getModules(courseId).then((modules) => {
            this.clear();
            this.createCards(modules, color, courseId, courseName);
            updatePage("/courses/" + encodeURI(courseName.toLowerCase()), courseName, modules);
            const courseButton = document.getElementById("button-modules");
            courseButton.disabled = false;
            courseButton.children[0].innerText = courseName;
            courseButton.removeEventListener("click", displayHandler);
            displayHandler = this.display.bind(this, courseId, courseName, color);
            courseButton.click();
            courseButton.addEventListener("click", displayHandler);
        });
    }
}