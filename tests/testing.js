const { Murasame } = require('../index.js');

const murasame = new Murasame('a_very_lewd_token_tbh');

murasame.getRandomWaifu().then(console.log);
murasame.getCurrentPopularWaifus().then(console.log);
murasame.searchBeta('Saya Amanogawa').then(console.log);
