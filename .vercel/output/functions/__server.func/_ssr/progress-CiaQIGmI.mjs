//#region node_modules/.nitro/vite/services/ssr/assets/progress-CiaQIGmI.js
var KEY = "sh2-trainer-v1";
var empty = {
	lessons: {},
	bestScore: 0,
	attempts: 0,
	lastScore: 0
};
function loadProgress() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {
			...empty,
			lessons: {}
		};
		return {
			...empty,
			...JSON.parse(raw)
		};
	} catch {
		return {
			...empty,
			lessons: {}
		};
	}
}
function saveProgress(p) {
	localStorage.setItem(KEY, JSON.stringify(p));
}
//#endregion
export { saveProgress as n, loadProgress as t };
