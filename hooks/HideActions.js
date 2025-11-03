export default function HideActions() {
	document.querySelectorAll("div[data-test='showActions']").forEach(element => {
		element.removeAttribute("data-test")
	})
}
