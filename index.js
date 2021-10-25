
// const SetlistFetcher = require('./src/SetlistFetcher');
// const SetlistParser = require('./src/SetlistParser');

// Coldplay
/**
const coldplayContent = require('./bands/coldplay/setlists_formatted.json');
const coldplayOptions = {
  bandName: 'Coldplay',
  artistId: 'cc197bad-dc9c-440d-a5b5-d52ba2e14234',
  skipYears: ['1997', '2004'],
  skipSongs: [],
  setlists: coldplayContent.setlists,
  pageMax: 63,
};
const setlistFetcher = new SetlistFetcher(coldplayOptions);
setlistFetcher.fetchSetlists();
setlistFetcher.findArtistId();

const setlistParser = new SetlistParser(coldplayOptions);
setlistParser.filterSetLists();
*/

// Grateful Dead

/**
const gratefulDeadContent = require('./bands/grateful_dead/gd-setlists.json');
const gratefulDeadOptions = {

  bandName: 'Grateful Dead',
  skipYears: [],
  skipSongs: ['Drums', 'Space'],
  artistId: '6faa7ca7-0d99-4a5e-bfa6-1fd5037520c6',
  setlists: gratefulDeadContent.setlists,
  pageMax: 250,
};
const setlistFetcher = new SetlistFetcher(gratefulDeadOptions);
setlistFetcher.fetchSetlists();
setlistFetcher.findArtistId();

const setlistParser = new SetlistParser(gratefulDeadOptions);
setlistParser.filterSetLists();
*/
