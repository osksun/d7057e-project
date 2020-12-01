
class RegexTester {
	constructor(getAnswerRegex) {
		this.getAnswerRegex = getAnswerRegex;

		this.wrapper = document.createElement("div");
		this.wrapper.className = "regex-tester-wrapper";

		this.title = document.createElement("span");
		this.title.className = "regex-tester-title";
		this.title.innerText = "Test answer:";
		this.wrapper.appendChild(this.title);

		this.input = document.createElement("input");
		this.input.className = "regex-tester-input text-box";
		this.input.addEventListener("input", () => {
			this.testRegex();
		});
		this.wrapper.appendChild(this.input);

		this.status = document.createElement("span");
		this.status.className = "regex-tester-status";
		this.wrapper.appendChild(this.status);
	}

	testRegex(regex = this.getAnswerRegex()) {
		const regExp = new RegExp(regex);
		this.setRegexTest(regExp.test(this.input.value));
	}

	setRegexTest(isMatching) {
		if (isMatching) {
			this.input.classList.add("regex-match");
			this.input.classList.remove("regex-no-match");
			this.status.innerText = "Test answer accepted";
		} else {
			this.input.classList.add("regex-no-match");
			this.input.classList.remove("regex-match");
			this.status.innerText = "Test answer rejected";
		}
	}
}
