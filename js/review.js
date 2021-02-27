
const todayKey = dayjs().format('YYYY-MM-DD')
const yesterdayKey = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
console.log('todayKey: ', todayKey);
console.log('yesterdayKey: ', yesterdayKey);

const ReviewApp = {
  data() {
    return {
      todayWordList: [],
      yesterdayWordList: [],
    }
  },

  created() {
    chrome.storage.sync.get(todayKey, (dataRes) => {
      this.todayWordList = dataRes[todayKey] || []
    })

    chrome.storage.sync.get(yesterdayKey, (dataRes) => {
      this.yesterdayWordList = dataRes[yesterdayKey] || []
    })
  },
}

Vue.createApp(ReviewApp).mount('#simple-translate-plugin-preview')