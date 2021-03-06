
const moderatorsList = new function() {
	const moderatorsContainer = document.getElementById("moderators-list-container");
	const moderatorsList = document.getElementById("moderators-list");
	const moderatorsListAddInput = document.getElementById("moderators-list-add-input");
	const moderatorsListAddButton = document.getElementById("moderators-list-add-button");
	let courseID = null;

	moderatorsListAddButton.addEventListener("click", () => {
		const previousText = moderatorsListAddButton.textContent;
		moderatorsListAddButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
		moderatorsListAddButton.disabled = true;

		const username = moderatorsListAddInput.value;
		DbCom.addModerator(username, courseID).then((course) => {
			moderatorsListAddInput.value = "";
			messageBox.show("Moderator added!");
			refreshList();
		}).catch((error) => {
			if(error.error) {
				messageBox.show("Error: " + error.error);
			} else {
				messageBox.show("Error: " + error);
			}
		}).finally(() => {
			moderatorsListAddButton.textContent = previousText;
			moderatorsListAddButton.disabled = false;
		});
	});

	this.setup = function(courseName) {
		DbCom.getCourseByName(courseName).then((course) => {
			courseID = course.id;
			refreshList();
		}).catch((err) => {
			console.error(err);
			viewManager.redirect404();
		});
	};

	function refreshList() {
		DbCom.getModerators(courseID).then((moderators) => {
			//Remove all children except last
			while(moderatorsList.children.length > 1) {
				moderatorsList.removeChild(moderatorsList.children[0]);
			}

			for(let i = 0; i < moderators.length; ++i) {
				const user = moderators[i];
				let name;
				let isItalic;
				if(user.name == null) {
					name = "Unnamed #" + user.id;
					isItalic = true;
				} else {
					name = user.name;
					isItalic = false;
				}
				addModerator(name, isItalic, user.id);
			}
		});
	}

	function addModerator(text, isItalic, userID) {
		const span = document.createElement("span");
		moderatorsList.prepend(span);

		let textElement;
		if(isItalic) {
			textElement = document.createElement("i");
		} else {
			textElement = document.createElement("p");
		}
		textElement.textContent = text;
		span.appendChild(textElement);

		const deleteButton = document.createElement("button");
		deleteButton.className = "button";
		deleteButton.textContent = "Delete";
		deleteButton.addEventListener("click", () => {
			const previousText = deleteButton.textContent;
			deleteButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
			deleteButton.disabled = true;
			messageBox.showConfirm("Are you sure you want to remove \"" + text + "\" from the moderator list?", () => {
				deleteButton.textContent = previousText;
				deleteButton.disabled = false;
			}, () => {
				DbCom.deleteModerator(userID, courseID).then((course) => {
					refreshList();
				}).catch((error) => {
					if(error.error) {
						messageBox.show("Error: " + error.error);
					} else {
						messageBox.show("Error: " + error);
					}
				}).finally(() => {
					deleteButton.textContent = previousText;
					deleteButton.disabled = false;
				});
			});
		});
		span.appendChild(deleteButton);
	}
}();
