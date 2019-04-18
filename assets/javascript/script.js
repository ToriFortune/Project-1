let genreId;

//initialize fireBase
  const config = {
    apiKey: "AIzaSyDdjDReSUF_rEyL8yMP9sPXsEiIbhMEndk",
    authDomain: "musify-4f523.firebaseapp.com",
    databaseURL: "https://musify-4f523.firebaseio.com",
    projectId: "musify-4f523",
    storageBucket: "musify-4f523.appspot.com",
    messagingSenderId: "384262036426"
  };
  firebase.initializeApp(config);

  const database = firebase.database();

//see how many connections there are with fireBase
let connections = database.ref("connections");

let connected = database.ref(".info/connected");

connected.on("value", function(snapshot) {
    if(snapshot.val()) {
        const con = connections.push(true);
        con.onDisconnect().remove();
    }
});

//see how many connections there are to the app
connections.on("value", function(snapshot) {
    $("#connections").text(snapshot.numChildren());
});

// new WOW().init();

//napster user login
// const width = 700;
// const height = 400;
// const left = (screen.width / 2) - (width / 2);
// // const top = (screen.height / 2) - (height / 2);
// const $loginButton = $('#btn-login');
// const $loginSection = $('#login-section');
// const $result = $('#result');
// const templateSource = document.getElementById('result-template').innerHTML
// const resultsTemplate = Handlebars.compile(templateSource);

// const napsterAPI = 'https://api.napster.com';
// const APIKEY = 'ZmNiNDU0OGQtZDBhYS00OWI4LTg3ZWItZjc2MTkyY2EwNzgy';
// const oauthURL = `${napsterAPI}/oauth/authorize?client_id=${APIKEY}&response_type=code`;

// const REDIRECT_URI = 'https://iaiqbal.github.io/Project-1/';

// function fetchUserData (accessToken) {
// 	return $.ajax({
//   	url: `${napsterAPI}/v2.1/me`,
//     headers: {
//       'Authorization': 'Bearer ' + accessToken
//     }
//   });	
// }

// function login() {
// 	window.addEventListener('message',(event) => {
//     var hash = JSON.parse(event.data);
//     if (hash.type === 'access_token') {
//       fetchUserData(hash.access_token)
//       	.then((data) => {
//         	$loginSection.hide();
//           $result.html(resultsTemplate(data.me));
//           $result.show();
//         });
//     }
//   }, false);
 
// 	window.open(
//   	`${oauthURL}&redirect_uri=${REDIRECT_URI}`,
//   	'Napster',
//     `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height}, left=${left}`
//   );
// }

// $loginButton.click(() => {
//  login();
//  console.log("login button was clicked");
// })

//query napster for genre list and push to firebase
const genreQueryUrl = "https://api.napster.com/v2.2/genres?apikey=ZmNiNDU0OGQtZDBhYS00OWI4LTg3ZWItZjc2MTkyY2EwNzgy"

$.ajax({
  url: genreQueryUrl,
  method: "GET"
}).then(function(data){
console.log("this is the response: " + data.genres[0].id);
let genres = (data.genres);
for (j=0; j<genres.length; j++) {
  console.log(genres[j].id);
  let genreId = genres[j].id;
  console.log(genres[j].name);
  let genreName = genres[j].name;
  if(genreName === "Classical"){
    $("#classical-btn").attr("genreId", genreId);
    } else if (genreName === "Pop"){
      $("#pop-btn").attr("genreId", genreId);
      } else if (genreName === "Rap/Hip-Hop") {
      $("#hiphop-btn").attr("genreId", genreId);
        } else if (genreName === "Rock") {
      $("#rock-btn").attr("genreId", genreId);
          } else if (genreName === "Electronic") {
      $("#edm-btn").attr("genreId", genreId);
            } else if (genreName === "Country") {
    $("#country-btn").attr("genreId", genreId);
    };
  }
});

//on genre 'a' click grab the genreId attribute and use it in the query URL
  $("a").on("click", function(event){
    genreId = $(this).attr("genreId");
    console.log(genreId);

//query napster for top tracks based on genre
const playlistQueryUrl = "https://api.napster.com/v2.2/genres/" + genreId + "/tracks/top?apikey=ZmNiNDU0OGQtZDBhYS00OWI4LTg3ZWItZjc2MTkyY2EwNzgy"

  $.ajax({
    url: playlistQueryUrl,
    method: "GET"
  }).then(function(response){
    trackDetails = response.tracks;
    console.log("this is what napster returns", response);
    for (i=0; i<trackDetails.length; i++) {
      let artistName =response.tracks[i].artistName;
    let songTitle = (response.tracks[i].name);
    $("#previewURL").append("Song Title: " + songTitle);
    let trackId = (response.tracks[i].id);
    console.log(response.tracks[i].id);
    $("#previewURL").append("this is the trackId: " + trackId);
    let previewURL = (response.tracks[i].previewURL);
    $("#previewURL").append("this is the URL" + previewURL + "<br>");
    console.log("mp3 link", response.tracks[i].previewURL);
    // let genre = (response.tracks.links.genres.id);
    // for (j=0; j<genre.length; j++){
    // console.log("this is the genre id: " + genre[j]);
    // }

    //currently only adding one song from the response results
    database.ref("/tracks").set({
      songTitle: songTitle,
      trackId: trackId,
      previewURL: previewURL
    })
    // created url variable to call song from returned array from database also making an ajax call. 
    // const artist= "Coldplay"
    // const title= "Adventure of a Lifetime"
    // create a variable for artist based on napster response
    const url = "https://api.lyrics.ovh/v1/"+ artistName +"/"+songTitle;
    $.ajax({
        url: url, 
        method:"GET"
    }).then(function(lyrics){
        console.log(lyrics);
    });
    }
  });
});