/** 存储鼠标位置 */
const mousePos = {

}

/** 翻译显示容器 id */
const containerId = 'chrome-plugin-simple-translate-result-container'

/** 点击鼠标获取位置 */
document.onclick = (event) => {
	const { pageX, pageY } = event
	mousePos.pageX = pageX
	mousePos.pageY = pageY
	removeContainer(event)
}

/** 移除翻译显示容器 */
const removeContainer = (event) => {
	const container = document.getElementById(containerId)
	if (!container) return
	/** 点击容器外部时，移除容器 */
	if (event) {
		if (!container.contains(event.target)) {
			container.parentNode.removeChild(container)
		}
		return
	}
	container.parentNode.removeChild(container)
}

/**
 * 监听单词被选中
 */
document.onmouseup = (event) => {
	const container = document.getElementById(containerId)
	if (container && container.contains(event.target)) return
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
		renderContainer(mousePos)
		return
	}
	if (type === 'onTranslateEnd') {
		const { errorCode, translateResult, word } = payload || {}
		if (errorCode === 0) {
			renderTranslateResult(word, translateResult)
		}
	}
})



/** 渲染视图 */
const renderContainer = (position) => {
	const container = document.createElement('div')
	container.id = containerId
	const { pageX, pageY } = position
	container.style.top = `${pageY + 10}px`
	container.style.left = `${pageX + 30}px`
	const view = `
        <div id="content">客观稍等，小可爱正在玩命翻译中...</div>
        <div id="save-btn"></div>
    `
	container.innerHTML = view
	document.body.appendChild(container)
}

/**
 * 解析并渲染结果
 */
const renderTranslateResult = (word, translateResult) => {
	if (!Array.isArray(translateResult)) return

	document.getElementById('save-btn').onclick = () => {
		removeContainer()
		chrome.runtime.sendMessage({
			type: 'saveWord',
			payload: {
				word,
				wordInfo: translateResult
			}
		})
	}
	
	const content = document.getElementById(containerId).querySelector(`#content`)
	const saveBtn = document.getElementById(containerId).querySelector(`#save-btn`)
	
	setTimeout(() => {
		saveBtn.innerHTML = 'save'
		content.innerHTML = `
			${translateResult.map(children => {
				return `<ul>${children.map(item => `<li>${item.tgt}</li>`)}</ul>`
			})}
		`
	}, 500)
}

