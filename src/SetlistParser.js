/* eslint-disable require-jsdoc */

// const songArtwork = require('./song_artwork.json');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class SetlistParser {
  constructor({bandName, skipYears, setlists, skipSongs}) {
    this.bandName = bandName;
    this.skipYears = skipYears;
    this.skipSongs = skipSongs;
    this.setlists = setlists;
    this.csvData = [];
  }

  artistNameFileFormat() {
    return `${this.bandName.toLowerCase().replace(' ', '_')}`;
  }

  artistDirectory(fileSuffix) {
    const directory = this.artistNameFileFormat();
    if (!fileSuffix) return directory;
    return `${directory}/${this.bandName}_${fileSuffix}`;
  }

  filterSetLists() {
    let max = 0;
    let totalSongs = 0;
    let numSetLists = 0;

    const setlistsByYear = {};
    const songFreq = {};
    const years = new Set();
    const yearsSongFreq = {};
    const header = [
      {id: 'name', title: 'Name'},
      {id: 'image', title: 'Image'},
      {id: 'album', title: 'Album'},
    ];

    for (const setlistArray of this.setlists) {
      for (const {sets, eventDate} of setlistArray) {
        const year = eventDate.split('-')[2];
        if (!this.skipYears.includes(year)) years.add(year);
        setlistsByYear[year] = (setlistsByYear[year] || 0) + 1;
        numSetLists++;
        let songsCount = 0;
        for (const {song} of sets.set) {
          const songSet = new Set();
          for (const {name, tape} of song) {
            if (tape) continue;
            if (songSet.has(name)) continue;
            else songSet.add(name);
            if (this.skipSongs.includes(name.toLowerCase())) return;
            songsCount++;

            if (name.trim() === '') continue;
            songFreq[name] = songFreq[name] || {count: 0, years: {}};
            songFreq[name].count += 1;
            songFreq[name].years[year] = (songFreq[name].years[year] || 0) + 1;
            totalSongs++;
          }
        }
        max = Math.max(max, songsCount);
      }
    }

    for (const k of Object.keys(songFreq)) {
      songFreq[k]['freq'] = (songFreq[k].count / numSetLists * 100).toFixed(2);
    }

    const yearsArr = [...years];
    yearsArr.sort((a, b) => a - b)
        .forEach((y) => header.push({id: y, title: y}));
    const csvWriter = createCsvWriter({
      path: __dirname + '/../bands/' + this.artistDirectory('freq.csv'),
      header,
    });

    Object.entries(songFreq)
        .sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => {
          if (this.skipSongs.includes(k)) return v;
          const values = v;
          const songYearsFreq = {};
          let songCount = 0;

          for (const y of yearsArr) {
            yearsSongFreq[y] = (yearsSongFreq[y] || {});

            if (values.years[y]) {
              const fraction = values.years[y] / setlistsByYear[y] * 100;
              const freq = (fraction).toFixed(2);
              const count = values.years[y];
              songCount += count;
              yearsSongFreq[y][k] = {count, freq};
              values.years[y] = {count, freq};
              // songYearsFreq[y] = freq;
              songYearsFreq[y] = songCount;
            } else {
              songYearsFreq[y] = songCount;
              // if (songCount !== 0) songYearsFreq[y] = 0;
              // else songYearsFreq[y] = songCount
            }
          }
          if (values.count > 0) {
            this.csvData.push({
              name: k,
              // image: (songArtwork[k] || {}).image,
              // album: (songArtwork[k] || {}).album,
              ...songYearsFreq,
            });
          }
          return {name: k, ...v};
        }).sort((a, b) => b.count - a.count);

    csvWriter
        .writeRecords(this.csvData)
        .then(()=> {
          console.log(`The ${this.artistNameFileFormat()} 
          CSV file was written successfully`);
        });

    console.log(numSetLists);
    console.log(setlistsByYear);
    console.log(totalSongs);
    console.log(JSON.stringify(yearsSongFreq));
  }
}

module.exports = SetlistParser;
