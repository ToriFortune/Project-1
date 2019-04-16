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

//napster user login
const width = 700;
const height = 400;
const left = (screen.width / 2) - (width / 2);
// const top = (screen.height / 2) - (height / 2);
const $loginButton = $('#btn-login');
const $loginSection = $('#login-section');
const $result = $('#result');
const templateSource = document.getElementById('result-template').innerHTML
const resultsTemplate = Handlebars.compile(templateSource);

const napsterAPI = 'https://api.napster.com';
const APIKEY = 'ZmNiNDU0OGQtZDBhYS00OWI4LTg3ZWItZjc2MTkyY2EwNzgy';
const oauthURL = `${napsterAPI}/oauth/authorize?client_id=${APIKEY}&response_type=code`;

const REDIRECT_URI = 'https://iaiqbal.github.io/Project-1/';

function fetchUserData (accessToken) {
	return $.ajax({
  	url: `${napsterAPI}/v2.1/me`,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });	
}

function login() {
	window.addEventListener('message',(event) => {
    var hash = JSON.parse(event.data);
    if (hash.type === 'access_token') {
      fetchUserData(hash.access_token)
      	.then((data) => {
        	$loginSection.hide();
          $result.html(resultsTemplate(data.me));
          $result.show();
        });
    }
  }, false);
 
	window.open(
  	`${oauthURL}&redirect_uri=${REDIRECT_URI}`,
  	'Napster',
    `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height}, left=${left}`
  );
}

$loginButton.click(() => {
 login();
 console.log("login button was clicked");
})

//query napster for top playlist
console.log("this is code line 82");
const playlistQueryUrl = "https://api.napster.com/v2.2/tracks/top?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm"

  $.ajax({
    url: playlistQueryUrl,
    method: "GET"
  }).then(function(response){
    trackDetails = response;
    console.log("this is what napster returns", response);
    console.log("mp3 link", response.tracks[0].previewURL)
  });