/* eslint-disable require-jsdoc */
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

class SetlistFetcher {
  constructor({artistId, apiKey, bandName, pageMax}) {
    this.setlists = [];
    this.pageMax = pageMax || 250;
    this.bandName = bandName;
    this.baseURL = `https://api.setlist.fm/rest/1.0`;
    this.artistId = artistId || 'cc197bad-dc9c-440d-a5b5-d52ba2e14234';
    this.setlistURL = `/artist/${artistId}/setlists`;

    if (!process.env.SETLIST_API_KEY) {
      throw Error('First add your SETLIST_API_KEY in .env');
    }
    this.apiKey = apiKey || process.env.SETLIST_API_KEY;
  }

  artistDirectory(fileSuffix) {
    const directory = `${this.bandName.toLowerCase().replace(' ', '_')}`;
    if (!fileSuffix) return directory;
    return `${directory}/${this.bandName}_${fileSuffix}`;
  }

  apiHeaders() {
    return {
      'content-type': 'application/json',
      'accept': 'application/json',
      'x-api-key': this.apiKey,
    };
  }

  /**
   * Run this to find an artist and use their ID in other functions.
   */
  async findArtistId() {
    const searchURL = `search/artists?artistName=${this.bandName}`;
    const URL = `${this.baseURL}/${searchURL}`;

    try {
      const res = await axios({
        method: 'get',
        url: URL,
        headers: this.apiHeaders(),
      });
      console.log(res.data);
    } catch (err) {
      console.log('Error: ' + err);
    }
  }

  /**
   * Run this to find all setlists for an artist
   */
  async fetchSetlists() {
    for (let pageNum = 1; pageNum <= this.pageMax; pageNum++) {
      setTimeout(async () => {
        const URL = this.baseURL + this.setlistURL + `?p=${pageNum}`;
        const res = await axios({
          method: 'get',
          url: URL,
          headers: this.apiHeaders(),
        });
        const directory = `${__dirname}/../bands/${this.artistDirectory()}/`;
        const filename = directory + 'setlists.json';

        fs.appendFile(filename,
            JSON.stringify(res.data.setlist.flat()) + ',',
            function(err) {
              if (err) console.log('Error saving:' + pageNum + err);
              if (err) throw err;
            });

        console.log('Saved!' + pageNum);
      }, pageNum * 1000);
    }
  }
}

module.exports = SetlistFetcher;
