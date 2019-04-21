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

connected.on("value", function (snapshot) {
  if (snapshot.val()) {
    const con = connections.push(true);
    con.onDisconnect().remove();
  }
});

$(document).ready(function () {


  //see how many connections there are to the app
  connections.on("value", function (snapshot) {
    $("#connections").text(snapshot.numChildren());
  });

  new WOW().init();

  //future state - napster user login, provided by napster API examples (https://developer.napster.com/examples)
  // const width = 700;
  // const height = 400;
  // const left = (screen.width / 2) - (width / 2);
  // const top = (screen.height / 2) - (height / 2);
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
  //   return $.ajax({
  //     url: `${napsterAPI}/v2.1/me`,
  //     headers: {
  //       'Authorization': 'Bearer ' + accessToken
  //     }
  //   });	
  // }
  
  // function login() {
  //   window.addEventListener('message',(event) => {
  //     var hash = JSON.parse(event.data);
  //     if (hash.type === 'access_token') {
  //       fetchUserData(hash.access_token)
  //         .then((data) => {
  //           $loginSection.hide();
  //           $result.html(resultsTemplate(data.me));
  //           $result.show();
  //         });
  //     }
  //   }, false);
   
  //   window.open(
  //     `${oauthURL}&redirect_uri=${REDIRECT_URI}`,
  //     'Napster',
  //     `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height},top=${top}, left=${left}`
  //   );
  // };
  
  // $loginButton.click(() => {
  //  login();
  // })
  //This ends the future state napster login code

  $("#reset-btn").click(() => {
    reset();
});

function reset() {
  database.ref("/tracks").remove();
  database.ref("/lyrics").remove();
  $("tr").remove();
};


 //query napster for genre list and push to firebase
const genreQueryUrl = "https://api.napster.com/v2.2/genres?apikey=ZmNiNDU0OGQtZDBhYS00OWI4LTg3ZWItZjc2MTkyY2EwNzgy"

$.ajax({
  url: genreQueryUrl,
  method: "GET"
}).then(function (data) {
  console.log("this is the response: " + data.genres[0].id);
  let genres = (data.genres);
  for (j = 0; j < genres.length; j++) {
    console.log(genres[j].id);
    let genreId = genres[j].id;
    console.log(genres[j].name);
    let genreName = genres[j].name;
    if (genreName === "Classical") {
    $("#classical-btn").attr("genreId", genreId);
    $("#classical-btn").attr("genreName", genreName)
    } 
    else if (genreName === "Pop") {
    $("#pop-btn").attr("genreId", genreId);
    $("#pop-btn").attr("genreName", genreName)
    } 
    else if (genreName === "Rap/Hip-Hop") {
    $("#hiphop-btn").attr("genreId", genreId);
    $("#hiphop-btn").attr("genreName", genreName)
    } 
    else if (genreName === "Rock") {
    $("#rock-btn").attr("genreId", genreId);
    $("#rock-btn").attr("genreName", genreName)
    } 
    else if (genreName === "Electronic") {
    $("#edm-btn").attr("genreId", genreId);
    $("#edm-btn").attr("genreName", genreName)
    } 
    else if (genreName === "Country") {
    $("#country-btn").attr("genreId", genreId);
    $("#country-btn").attr("genreName", genreName)
    };
  }
});


//on genre 'a' click grab the genreId attribute and use it in the query URL
$("button").on("click", function (event) {
  genreId = $(this).attr("genreId");
  genreName = $(this).attr("genreName");
  // added bounce animation to genre buttons
  $(this).addClass('animated bounce')
  console.log(genreId);
  console.log("this should be genrename", genreName);

  //query napster for top tracks based on genre
  const playlistQueryUrl = "https://api.napster.com/v2.2/genres/" + genreId + "/tracks/top?apikey=ZmNiNDU0OGQtZDBhYS00OWI4LTg3ZWItZjc2MTkyY2EwNzgy"

  $.ajax({
    url: playlistQueryUrl,
    method: "GET"
  }).then(function (response) {
    trackDetails = response.tracks;
    console.log("this is what napster returns", response);
    console.log(genreId);
    for (i = 0; i < trackDetails.length; i++) {
      let songTitle = (response.tracks[i].name);
      let artistName = (response.tracks[i].artistName);
      console.log(response.tracks[i].artistName);
      let trackId = (response.tracks[i].id);
      console.log(response.tracks[i].id);
      let previewURL = (response.tracks[i].previewURL);
      console.log(previewURL);
      console.log(artistName);
      console.log("this is genreName", genreName);
      database.ref("/tracks").push({
        songTitle: songTitle,
        artistName: artistName,
        trackId: trackId,
        previewURL: previewURL,
        genreName: genreName,
      });
      
      const url = "https://api.lyrics.ovh/v1/" +artistName +"/" +songTitle; 

         $.ajax({
             url: url, 
             method:"GET"
         }).then(function(lyrics){
           console.log(lyrics);
          let lyrics2 = lyrics.lyrics;
          console.log(lyrics2);
          console.log(songTitle);
          
            database.ref("/lyrics").push({
              artistName: artistName,
              songTitle: songTitle,
              lyrics: lyrics2
            });
          });
      
    };
  });
});

database.ref("/lyrics").on("child_added", function(data){
  let lyrics = data.val().lyrics;
  console.log(lyrics);
  

});

database.ref("/tracks").on("child_added", function(snapshot) {
  console.log("this is snapshot: ", snapshot.val().songTitle);
  let songTitle = snapshot.val().songTitle;
  console.log(songTitle);  let artistName = snapshot.val().artistName;
  let trackId = snapshot.val().trackId;
  let previewURL = snapshot.val().previewURL;
  let genreName = snapshot.val().genreName;

  var ref = database.ref("/lyrics");
  ref.orderByChild("songTitle").equalTo(songTitle).on("child_added", function(snapshot) {
    let songTitle2 = snapshot.val().songTitle;
    console.log(songTitle2)
    let lyricsSnapshot = snapshot.val().lyrics;
  // console.log(snapshot.key);
  // console.log(songTitle);
  console.log(lyricsSnapshot);
  let popover = $("<a tabindex='0' class='btn btn-lg btn-primary popoverclass' role='button' data-toggle='popover' data-trigger='focus' data-placement='bottom' title='Lyrics'>Lyrics</a>");
  $(".popoverclass").popover({
    content: lyricsSnapshot,
  });

  // var newRow5 = $("<tr>");
  // var newTableData5 = $("<td>").append(popover)
  // newRow5.append(newTableData5);
  // $("#lyrics").append(newRow5);
  let audio = $("<audio controls>");
    audio.attr("id", "sourceid" + i);
    audio.attr("src", previewURL);
    audio.wrapInner("<source id='sourceid'>");
  const newRow = $("<tr>").append(
    $("<td>").text(songTitle),
    $("<td>").text(artistName),
    $("<td>").text(genreName),
    $("<td>").html(audio),
    $("<td>").html(popover),
  );
  $("#song-table > tbody").append(newRow);
});
  
  // const url = "https://api.lyrics.ovh/v1/" + artistName + "/" + songTitle;
  // var encodedUrl = encodeURI(url)
  // console.log(url);
  // console.log(encodedUrl);
  // getLyrics();

  //the next two lines of code need to be replaced with Ibrahim's code
  // var newRow = $("<tr>");
  // var newTableData = $("<td>").text(songTitle);
  // newRow.append(newTableData);
  // $("#songs").append(newRow);

  // var newRow2 = $("<tr>");
  // var newTableData2 = $("<td>").text(artistName);
  // newRow2.append(newTableData2);
  // $("#artist").append(newRow2);

  // var newRow4 = $("<tr>");
  // var newTableData4 = $("<td>").text(genreName);
  // newRow4.append(newTableData4);
  // $("#genres").append(newRow4);

  // let audio = $("<audio controls>");
  // audio.attr("id", "sourceid" + i);
  // audio.attr("src", previewURL);
  // // audio.wrapInner("<source id='sourceid'>");

  // console.log(audio);

  // var newRow3 = $("<tr>");
  // var newTableData3 = $("<td>").wrapInner(audio);
  // newRow3.append(newTableData3);
  // $("#previewURL").append(newRow3);
});

//the line below ends the on document ready function
});
