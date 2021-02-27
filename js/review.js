const todayKey = dayjs().format('YYYY-MM-DD')
const yesterdayKey = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

const ReviewApp = {
  data() {
      return {
        wordListMap: {
          [todayKey]: [],
          [yesterdayKey]: [],
        }
      }
  },

  methods: {
    remove(word, key) {
      chrome.storage.sync.get(key, (dataRes) => {
        const list = dataRes[key] || []
        const filteredList = list.filter(item => {
          return word !== Object.keys(item)[0]
        })
        this.wordListMap[key] = filteredList
        chrome.storage.sync.set({[key]: [...filteredList]}, () => {
          
        })
      })
    }
  },
  created() {
    Object.keys(this.wordListMap).forEach(dateKey => {
      chrome.storage.sync.get(dateKey, (dataRes) => {
        this.wordListMap[dateKey] = dataRes[dateKey] || []
      })
    })
  },
}

Vue.createApp(ReviewApp).mount('#chrome-plugin-simple-translate-preview')