
const moderatorsList = new function() {
	const moderatorsContainer = document.getElementById("moderators-list-container");
	const moderatorsList = document.getElementById("moderators-list");
	const moderatorsListAddInput = document.getElementById("moderators-list-add-input");
	const moderatorsListAddButton = document.getElementById("moderators-list-add-button");
	let courseID = null;

	moderatorsListAddButton.addEventListener("click", () => {
		const username = moderatorsListAddInput.value;
		DbCom.addModerator(username, courseID).then((course) => {
			messageBox.show("Moderator added!");
			refreshList();
		}).catch((error) => {
			if(error.error) {
				messageBox.show("Error: " + error.error);
			} else {
				messageBox.show("Error: " + error);
			}
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
				if(user.name == null) {
					name = "Unnamed user #" + user.id;
				} else {
					name = user.name;
				}
				addModerator(name, user.id);
			}
		});
	}

	function addModerator(text, userID) {
		const span = document.createElement("span");
		moderatorsList.prepend(span);

		const p = document.createElement("p");
		p.textContent = text;
		span.appendChild(p);

		const deleteButton = document.createElement("button");
		deleteButton.className = "button";
		deleteButton.textContent = "Delete";
		deleteButton.addEventListener("click", () => {
			messageBox.showConfirm("Are you sure you want to remove \"" + text + "\" from the moderator list?", () => {}, () => {
				DbCom.deleteModerator(userID, courseID).then((course) => {
					refreshList();
				}).catch((error) => {
					if(error.error) {
						messageBox.show("Error: " + error.error);
					} else {
						messageBox.show("Error: " + error);
					}
				});
			});
		});
		span.appendChild(deleteButton);
	}
}();
