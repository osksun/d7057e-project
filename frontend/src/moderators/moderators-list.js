
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
			moderatorsList.innerHTML = "";
			if(moderators.length == 0) {
				moderatorsList.innerHTML = "<p>This course has no moderators</p>";
			} else {
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
			}
		});
	}

	function addModerator(text, userID) {
		const li = document.createElement("li");
		li.textContent = text;
		moderatorsList.appendChild(li);

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete";
		deleteButton.addEventListener("click", () => {
			DbCom.deleteModerator(userID, courseID).then((course) => {
				messageBox.show("Moderator removed!");
				refreshList();
			}).catch((error) => {
				if(error.error) {
					messageBox.show("Error: " + error.error);
				} else {
					messageBox.show("Error: " + error);
				}
			});
		});
		li.appendChild(deleteButton);
	}
}();
