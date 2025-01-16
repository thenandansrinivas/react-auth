// Utils/navigate.js
let navigateRef = null

export const setNavigate = navigate => {
	navigateRef = navigate
}

export const customNavigate = (...args) => {
	if (!navigateRef) {
		console.warn('Navigation not initialized, falling back to window.location')
		window.location.href = args[0]
		return
	}
	navigateRef(...args)
}
