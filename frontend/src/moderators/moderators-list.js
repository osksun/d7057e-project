
const moderatorsList = new function() {
	const moderatorsContainer = document.getElementById("moderators-list-container");
	const moderatorsList = document.getElementById("moderators-list");

	this.setup = function(courseName) {
		moderatorsList.innerHTML = "";
		DbCom.getCourseByName(courseName).then((course) => {
			DbCom.getModerators(course.id).then((moderators) => {
				if(moderators.length == 0) {
					moderatorsList.innerHTML = "<p>This course has no moderators</p>";
				} else {
					for(let i = 0; i < moderators.length; ++i) {
						addModerator(moderators[i]);
					}
				}
			});
		}).catch((err) => {
			console.error(err);
			viewManager.redirect404();
		});
	};

	function addModerator(text) {
		const li = document.createElement("li");
		li.textContent = text;
		moderatorsList.appendChild(li);
	}
}();
