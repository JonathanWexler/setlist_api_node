const discography = require('./discography.json');
const artwork = require('./artwork.json');
// const songArtwork = require('./songArtwork.json');


const printAlbums = () => {
  const albums = new Set();
  discography.forEach((d) => {
    const a = d['Original release'].replace('\"', '');
    if (!a.includes('B-side')) albums.add(a);
  });
  const list = [...albums].sort((a, b) => a.localeCompare(b));
  console.log(list);
};

const addArtwork = () => {
  const songArt = {};
  discography.map((d) => {
    const album = d['Original release'];
    const art = artwork.find(((v) => v.name === album));
    if (art) {
      const {image} = art;
      songArt[d.Song] = {image, album};
      return {...d, image, album};
    } else {
      return {...d, album};
    }
  });
  console.log(JSON.stringify(songArt));
};

module.exports = {
  printAlbums,
  addArtwork,
};
