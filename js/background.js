

chrome.contextMenus.create({
	/** %s表示选中的文字 */
	title: '翻译 %s',
	/** 只有当选中文字时才会出现此右键菜单 */
	contexts: ['selection'],
	onclick: (selectedInfo, tabInfo) => {
		const xhr = new XMLHttpRequest()
		xhr.responseType = 'json'
		xhr.open("GET", `http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${selectedInfo.selectionText}`, true)
		xhr.send()
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
				/** 翻译结束 */
				sendMessageToContentScript({
					response: xhr.response,
					type: 'translateEnd',
				})
			}
		}

		/** 开始翻译 */
		sendMessageToContentScript({
			tabInfo,
			selectedInfo,
			type: 'translateStart',
		})
	}
});

/** 监听消息 */
chrome.runtime.onMessage.addListener((message, sender, callback) => {
	console.log(message, sender);
})


/** 向 content 发送消息 */
const sendMessageToContentScript = (message, callback) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
			if (callback) callback(response);
		});
	});
}
