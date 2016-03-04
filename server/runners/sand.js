var request = require('request');

var data = {
    playlist: {
        tracks: [
            {id: 235911577},
            {id: 2}
        ]
    }
};

var options = {
    url: "https://api.soundcloud.com/users/10878168/playlists/202217371",
    method: "PUT",
    body: JSON.stringify(data),
    qs: {
        client_id: "bf005413b19842fbf55e6aac73687ac8"
    },
    headers: {
        "Authorization": "OAuth 1-163360-10878168-a5fb51a3b1304c",
        "Content-Type": "application/json"
    },
    json: true
};

request(options, function(error, response, body) {
    console.error(error);
    console.log(response.statusCode)
    console.log(body)
});

setTimeout(function() {
    console.log("over");
}, 3000)