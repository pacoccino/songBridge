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
    url: "https://api.soundcloud.com/users/10878169/tracks",
    method: "GET",
    qs: {
        client_id: "bf005413b19842fbf55e6aac73687ac8"
    },
    headers: {
        "Content-Type": "application/json"
    },
    body: undefined,
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