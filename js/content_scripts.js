
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

/** content 监听消息 */
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    const { type, tabInfo, selectedInfo, response } = message
    /** 开始构建视图 */
    if (type === 'translateStart') {
        renderView(mousePos, selectedInfo)
        return
    }
    if (type === 'translateEnd') {
        console.log('response: ', response);
        const { errorCode, translateResult } = response || {}
        if (errorCode === 0) {
            renderTranslateResult(translateResult)
        }
        
    }
})

/** 渲染视图 */
const renderView = (position, selectedInfo) => {
    const { selectionText } = selectedInfo
    const container = document.createElement('div')
    container.id = containerId
    const { pageX, pageY } = position
    container.style.width = '300px'
    container.style.height = '200px'
    container.style.position = 'absolute'
    container.style.top = `${pageY}px`
    container.style.left = `${pageX}px`
    container.style.background = `black`
    container.style.borderRadius = `5px`
    container.style.color = `white`
    container.style.wordBreak = `break-all`
    container.style.padding = '5px'
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
