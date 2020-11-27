
const moderatorsList = new function() {
	const moderatorsContainer = document.getElementById("moderators-list-container");
	const moderatorsList = document.getElementById("moderators-list");
	const moderatorsListAddInput = document.getElementById("moderators-list-add-input");
	const moderatorsListAddButton = document.getElementById("moderators-list-add-button");
	let courseID = null;

	moderatorsListAddButton.addEventListener("click", () => {
		const userID = parseInt(moderatorsListAddInput.value, 10);
		if(isNaN(userID) || userID <= 0) {
			messageBox.show("Error: Input is not a valid ID");
		} else {
			DbCom.addModerator(userID, courseID).then((course) => {
				messageBox.show("Moderator added!");
				refreshList();
			}).catch((error) => {
				if(error.error) {
					messageBox.show("Error: " + error.error);
				} else {
					messageBox.show("Error: " + error);
				}
			});
		}
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
					addModerator(moderators[i]);
				}
			}
		});
	}

	function addModerator(text) {
		const li = document.createElement("li");
		li.textContent = text;
		moderatorsList.appendChild(li);
	}
}();
