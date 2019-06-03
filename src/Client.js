const fetch = require('node-fetch');
const AbortController = require('abort-controller');

class Client {
    /**
     * MyWaifuList client
     * @param {string} token API key that has been registered with MyWaifuList
     */
    constructor(token) {
        /**
         * MyWaifuList API Token
         * @private
         * @type {string}
         */
        Object.defineProperty(this, 'token', { value: token });
        /**
        * The Base URL of the MyWaifuList API
        * @type {string} 
        */
        this.baseurl = 'https://mywaifulist.moe/api/v1';
    }

    // Waifu Endpoints

    /**
     * Returns the waifu specified by the given slug
     * @param {string} slug The slug (Waifu / Series)
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/waifu/get-waifu#responses)
     */
    getWaifu(slug) {
        if (!slug) throw new Error('Parameter \'slug\' cannot be left blank');
        return this._fetch(`/waifu/${slug}`);
    }

    /**
     * Returns paginated images from the gallery, in sets of 10
     * @param {string} slug The slug (Waifu / Series)
     * @param {number} [page=1] For pagination. Defaults to 1
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/waifu/get-waifu-images#responses)
     */
    getWaifuImages(slug, page) {
        if (!slug) throw new Error('Parameter \'slug\' cannot be left blank');
        if (!page) page = 1;
        return this._fetch(`/waifu/${slug}/images`, { page });
    }

    /**
     * Returns an array of Waifus, sorted alphabetically
     * @param {string} letter The letter to fetch (A-Z)
     * @param {number} [page=1] For pagination. Defaults to 1
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/waifu/get-waifus-by-page#responses)
     */
    getWaifuByPage(letter, page) {
        if (!letter) throw new Error('Parameter \'letter\' cannot be left blank');
        if (!page) page = 1;
        return this._fetch('/waifu', { letter, page });
    }

    /**
     * Returns the Waifu of the day
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/waifu/get-daily-waifu#responses)
     */
    getDailyWaifu() {
        return this._fetch('/meta/daily');
    }

    /**
     * Returns a random Waifu from the database
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/waifu/get-random-waifu#responses)
     */
    getRandomWaifu() {
        return this._fetch('/meta/random');
    }

    // Current Season Endpoints

    /**
     * Get a list of currently airing shows
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/current-season/get-airing-shows#responses)
     */
    getAiringShows() {
        return this._fetch('/airing');
    }

    /**
     * Get best waifus of the current season
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/current-season/airingbest#responses)
     */
    getCurrentBestWaifus() {
        return this._fetch('/airing/best');
    }

    /**
     * Get a list of popular waifus (raw count of total votes) of the current season
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/current-season/airingpopular#responses)
     */
    getCurrentPopularWaifus() {
        return this._fetch('/airing/popular');
    }

    /**
     * Get the most disliked waifus of the current season
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/current-season/airingtrash#responses)
     */
    getCurrentTrashWaifus() {
        return this._fetch('/airing/trash');
    }

    // Series

    /**
     * Returns the Waifu of the day
     * @param {string} slug The slug (Waifu / Series)
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/series/get-series#responses)
     */
    getSeries(slug) {
        if (!slug) throw new Error('Parameter \'slug\' cannot be left blank');
        return this._fetch(`/series/${slug}`);
    }

    /**
     * Returns the Waifu of the day
     * @param {string} letter Starting letter (A-Z)
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/series/get-series-by-page#responses)
     */
    getSeriesByPage(letter) {
        if (!letter) throw new Error('Parameter \'letter\' cannot be left blank');
        return this._fetch('/series',{ letter });
    }

    /**
     * Get list of shows that aired in a given season and year
     * @param {string} season The season the work first premiered (`winter`, `summer`, `spring`, `fall`) 
     * @param {number} year The year
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/series/get-airing-shows-by-season#responses)
     */
    getAiredShowsBySeason(season, year) {
        if (!season || !year) throw new Error('Parameter \'season, year\' cannot be left blank');
        return this._fetch(`/airing/${season}/${year}`);
    }

    /**
     * Returns a set of waifus for a given series
     * @param {string} slug The slug (Waifu, Series)
     * @param {number} [page=1] For pagination. Defaults to 1 
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/series/getseriesslugwaifus#responses)
     */
    getSeriesWaifus(slug, page) {
        if (!slug) throw new Error('Parameter \'slug\' cannot be left blank');
        if (!page) page = 1;
        return this._fetch(`/series/${slug}/waifus`, { page });
    }

    // User

    /**
     * Returns information about the user
     * @param {number} id User ID 
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/user/get-user-profile#responses)
     */
    getUserProfile(id) {
        if (!id) throw new Error('Parameter \'id\' cannot be left blank');
        return this._fetch(`/user/${id}`);
    }

    /**
     * Gets the waifus created, liked, or trashed for the given user ID
     * @param {number} id User ID 
     * @param {string} type Type (`created`, `like`, `trash`) 
     * @param {*} [page=1] For pagination. Defaults to 1
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/user/get-user-waifus#responses)
     */
    getUserWaifus(id, type, page) {
        if (!id || !type || !page)
            throw new Error('Parameter \'id, type, page\' cannot be left blank');
        return this._fetch(`/user/${id}/${type}`, { page });
    }

    // Search

    /**
     * Allows searching for a Series or Waifu. Minimum search string: 4 characters.
     * @param {string} term Search term
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/search/search#responses)
     */
    search(term) {
        return this._post('/search', term);
    }

    /**
     * This search is more aggressive when it comes to name matching, resulting in better accuracy in most cases
     * @param {string} term Search term 
     * @returns {*} Refer to [this](https://mywaifulist.docs.stoplight.io/api-reference/search/search#responses)
     */
    searchBeta(term) {
        return this._post('/search/beta', term);
    }

    // Private Functions

    /**
     * Make a POST request to MyWaifuList
     * @private
     * @param {string} endpoint The endpoint
     * @param {*} term Search term
     * @returns {*}
     */
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

    /**
     * Make a GET request to MyWaifuList
     * @private
     * @param {string} endpoint The endpoint
     * @param {string|object|Iterable} [query] Query parameters
     * @returns {*}
     */
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
