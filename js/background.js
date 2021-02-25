
chrome.browserAction.setBadgeText({text: 'new'});
chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});

chrome.contextMenus.create({
	title: '翻译：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: (context) => {
        console.log('context: ', context);
    }
});