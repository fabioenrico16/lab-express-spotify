require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(path.join(__dirname + "/public")));

// Register the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, "views/partials"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  let artist = req.query.artist;
  console.log(artist);
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      console.log("The received data from the API body: ", data.body.artists);
      console.log("----------------------------------------------------------");
      res.render("artist-search-results", data.body.artists);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      console.log("#######################################################");
      res.render("albums-search-results", data.body);
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res, next) => {
  let albumId = req.params.albumId;

  console.log("album id ", albumId);
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log("The received data from the API: ", data.body.items);
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      res.render("tracks", data.body);
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(process.env.PORT || 3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
