/** 存储鼠标位置 */
const mousePos = {

}

/** 容器 id */
const containerId = 'simple-translate-plugin-container'

/** 点击鼠标获取位置 */
document.onclick = (event) => {
	const { pageX, pageY } = event
	mousePos.pageX = pageX
	mousePos.pageY = pageY

	const container = document.getElementById(containerId)
	if (!container) return
	/** 点击容器外部时，移除容器 */
	if (!container.contains(event.target)) {
		container.parentNode.removeChild(container)
	}
}

/**
 * 监听单词被选中
 */
document.onmouseup = (event) => {
	// var parentOffset = $(this).offset();
	// var x = e.pageX - parentOffset.left;
	// var y = e.pageY - parentOffset.top;
	const selection = window.getSelection().toString()
	if (selection.length < 1) return
	const word = /^[a-zA-Z]+$/.test(selection)
	if (!word) return
	chrome.runtime.sendMessage({
		type: 'onSelected',
		payload: selection
	})
}

/** content 监听消息 */
chrome.runtime.onMessage.addListener((message, sender, callback) => {
	const { type, payload } = message
	/** 开始构建视图 */
	if (type === 'onTranslateStart') {
		renderView(mousePos, payload)
		return
	}
	if (type === 'onTranslateEnd') {
		const { errorCode, translateResult } = payload || {}
		if (errorCode === 0) {
			renderTranslateResult(translateResult)
		}
	}
})

/** 渲染视图 */
const renderView = (position, selectionText) => {
	const container = document.createElement('div')
	container.id = containerId
	const { pageX, pageY } = position
	container.style.width = '300px'
	container.style.minHeight = '50px'
	container.style.maxHeight = '300'
	container.style.overflow = 'auto'
	container.style.position = 'absolute'
	container.style.top = `${pageY + 10}px`
	container.style.left = `${pageX + 30}px`
	container.style.background = `black`
	container.style.borderRadius = `5px`
	container.style.color = `white`
	container.style.wordBreak = `break-all`
	container.style.padding = '12px'
	container.style.zIndex = 100000000
	const view = `
        <span>${selectionText}</span>
    `
	container.innerHTML = view
	document.body.appendChild(container)
}

/**
 * 解析并渲染结果
 * @param {Array<Array<{src: String; tgt: String}>>} translateResult 翻译结果
 * @returns {void}
 */
const renderTranslateResult = (translateResult) => {
	if (!Array.isArray(translateResult)) return
	const container = document.getElementById(containerId)
	container.innerHTML = `
        ${translateResult.map(children => {
		return `<ul>${children.map(item => `<li>${item.tgt}</li>`)}</ul>`
	})}
    `
}
