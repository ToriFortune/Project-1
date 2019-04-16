




// created function to get song by title making an ajax call to the indicated database
function getSongs(songTitle){
    // created url variable to call song from returned array from database also making an ajax call. 
    const url = "https://musicdemons.com/api/v1/song";
    $.ajax({
        url: url, 
        method:"GET"
    }).then(function(response){
        //Used filter method to compare selected song title queried from the URL with returned value in the response
        const thisSong = response.filter(function(song){return song.title === songTitle})[0];
        // ajax call to get lyrics, embed song title in html using element id, embed song in html using element id.
        $.ajax({
            url: `${url}/${thisSong.id}/lyrics`, 
            method:"GET"
        }).then(function(lyrics){
            $("#lyricHeader").text(songTitle)
            $("#lyricZone").text(lyrics);
        })

    })
}