const fetch = require('node-fetch');
const AbortController = require('abort-controller');

class Client {
    constructor(token) {
        Object.defineProperty(this, 'token', { value: token });
        this.baseurl = 'https://mywaifulist.moe/api/v1';
    }

    // Waifu Endpoints

    getWaifu(slug) {
        if (!slug) throw new Error('Parameter \'slug\' cannot be left blank');
        return this._fetch(`/waifu/${slug}`);
    }

    getWaifuImages(slug, page) {
        if (!slug) throw new Error('Parameter \'slug\' cannot be left blank');
        if (!page) page = 1;
        return this._fetch(`/waifu/${slug}/images`, { page });
    }

    getWaifuByPage(letter, page) {
        if (!letter) throw new Error('Parameter \'letter\' cannot be left blank');
        if (!page) page = 1;
        return this._fetch('/waifu', { letter, page });
    }

    getDailyWaifu() {
        return this._fetch('/meta/daily');
    }

    getRandomWaifu() {
        return this._fetch('/meta/random');
    }

    // Current Season Endpoints

    getAiringShows() {
        return this._fetch('/airing');
    }

    getCurrentBestWaifus() {
        return this._fetch('/airing/best');
    }

    getCurrentPopularWaifus() {
        return this._fetch('/airing/popular');
    }

    getCurrentTrashWaifus() {
        return this._fetch('/airing/trash');
    }

    // Series

    getSeries(slug) {
        if (!slug) throw new Error('Parameter \'slug\' cannot be left blank');
        return this._fetch(`/series/${slug}`);
    }

    getSeriesByPage(letter) {
        if (!letter) throw new Error('Parameter \'letter\' cannot be left blank');
        return this._fetch('/series',{ letter });
    }

    getAiredShowsBySeason(season, year) {
        if (!season || !year) throw new Error('Parameter \'season, year\' cannot be left blank');
        return this._fetch(`/airing/${season}/${year}`);
    }

    getSeriesWaifus(slug, page) {
        if (!slug) throw new Error('Parameter \'slug\' cannot be left blank');
        if (!page) page = 1;
        return this._fetch(`/series/${slug}/waifus`, { page });
    }

    // User

    getUserProfile(id) {
        if (!id) throw new Error('Parameter \'id\' cannot be left blank');
        return this._fetch(`/user/${id}`);
    }

    getUserWaifus(id, type, page) {
        if (!id || !type || !page)
            throw new Error('Parameter \'id, type, page\' cannot be left blank');
        return this._fetch(`/user/${id}/${type}`, { page });
    }

    // Search

    search(term) {
        return this._post('/search', term);
    }

    searchBeta(term) {
        return this._post('/search/beta', term);
    }

    // Private Function for the SEARCH POST ENDPOINTS

    _post(endpoint, term) {
        const url = new URL(this.baseurl + endpoint);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        return fetch(url.toString(), {
            method: 'POST',
            body: JSON.stringify({ term }),
            headers: { 'Content-Type': 'application/json', apikey: this.token },
            signal: controller.signal
        }).then((body, error) => {
            if (error) {
                if (error.name === 'AbortError') {
                    throw new Error('My Waifu List Wrapper Request Timeout.');
                }
                clearTimeout(timeout);
                throw error;
            }
            clearTimeout(timeout);
            if (!body.ok)
                throw new Error('My Waifu List API is probably offline');
            if (body.status !== 200)
                throw new Error(`My Waifu List API Error ${body.status}: ${body.body}`);
            return body.json();
        });
    }

    // Private Function for GET endpoints of the My Waifu List API

    _fetch(endpoint, query) {
        const url = new URL(this.baseurl + endpoint);
        if (query) url.search = new URLSearchParams(query);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        return fetch(url.toString(), { headers: { apikey: this.token }, signal: controller.signal })
            .then((body, error) => {
                if (error) {
                    if (error.name === 'AbortError') {
                        throw new Error('My Waifu List Wrapper Request Timeout.');
                    }
                    clearTimeout(timeout);
                    throw error;
                }
                clearTimeout(timeout);
                if (!body.ok)
                    throw new Error('My Waifu List API is probably offline');
                if (body.status !== 200)
                    throw new Error(`My Waifu List API Error ${body.status}: ${body.body}`);
                return body.json();
            });
    }
}

module.exports = Client;
