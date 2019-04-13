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
})

<<<<<<< HEAD
//query napster for top playlist
const playlistQueryUrl = "https://api.napster.com/v2.1/tracks/top?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm"

  $.ajax({
    url: playlistQueryUrl,
    method: "GET"
  }).then(function(response){
    trackDetails = response;
    console.log("this is what napster returns", response);
    console.log("mp3 link", response.tracks[0].previewURL);
    })




=======
// add event listener too play audio, will connect to elements in html

// <button onclick="playAudio()" type="button">Play Audio</button>
// <button onclick="pauseAudio()" type="button">Pause Audio</button> 

var song=document.getElementById("audiohtml");
function playAudio(){
song.play();
}
function pauseAudio(){
  song.pause();
}
>>>>>>> tori
