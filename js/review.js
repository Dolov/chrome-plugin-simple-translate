
const todayKey = dayjs().format('YYYY-MM-DD')
const yesterdayKey = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

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

Vue.createApp(ReviewApp).mount('#chrome-plugin-simple-translate-preview')