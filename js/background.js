

/** 向 content 发送消息 */
const sendMessageToContentScript = (message, callback) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
			if (callback) callback(response);
		})
	})
}

/**
 * 发送请求调用有道云翻译
 * @param {String} text 需要翻译的文本
 * @param {Function} callback 获取返回结果后的回调
 */
const fetchTranslateResult = (text, callback) => {
	const xhr = new XMLHttpRequest()
	xhr.responseType = 'json'
	xhr.open("GET", `http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${text}`, true)
	xhr.send()
	xhr.onreadystatechange = () => {
		/** 翻译结束 */
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			callback(xhr.response)
		}
	}
}

/**
 * 触发翻译流程
 * 通知 Content 构建翻译视图
 * 发送请求
 * @param {String} selectionText 需要翻译的文本
 */
const triggerTranslate = (selectionText) => {
	/** 开始翻译 */
	sendMessageToContentScript({
		type: 'onTranslateStart',
		payload: selectionText,
	})

	fetchTranslateResult(selectionText, (response) => {
		sendMessageToContentScript({
			type: 'onTranslateEnd',
			payload: {
				word: selectionText,
				...response
			},
		})
	})
}

/**
 * 构建右键菜单
 */
chrome.contextMenus.create({
	/** %s表示选中的文字 */
	title: '翻译 %s',
	/** 只有当选中文字时才会出现此右键菜单 */
	contexts: ['selection'],
	onclick: (selectedInfo) => {
		const { selectionText } = selectedInfo || {}
		triggerTranslate(selectionText)
	}
})


/** 监听消息 */
chrome.runtime.onMessage.addListener((message, sender, callback) => {
	const { type, payload } = message
	/** 页面选中了文本 */
	if (type === 'onSelected') {
		triggerTranslate(payload)
		return
	}
	if (type === 'saveWord') {
		// triggerTranslate(payload)
		const { word, wordInfo } = payload
		saveWord(word, wordInfo)
	}
})

/**
 * 保存单词
 * @param {String} word 需要保存的单词信息
 * @param {Object} wordInfo 需要保存的单词信息
 */
const saveWord = (word, wordInfo) => {
	/** 设置今天日期为 key */
	const todayKey = dayjs().format('YYYY-MM-DD')
	/** 读取数据 */
	chrome.storage.sync.get(todayKey, (dataRes) => {

		const wordList = dataRes[todayKey] || []

		const currentWord = {
			[word]: wordInfo
		}
		/** 保存数据 */
		chrome.storage.sync.set({[todayKey]: [currentWord, ...wordList]}, () => {
			
		})
	})
}
