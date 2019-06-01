const { WaifuList } = require('../index.js')

const API = new WaifuList('a_very_lewd_token_tbh')

API.getRandomWaifu().then(console.log)
API.getCurrentPopularWaifus().then(console.log)
API.searchBeta('Saya Amanogawa').then(console.log)
