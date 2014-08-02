define(['domReady', 'jsnx', 'GitHub'],
function(domReady, jsnx, GitHub) {
    domReady(function() {
        var accessToken = localStorage.getItem('flowerers:github:access_token'),
            username = localStorage.getItem('flowerers:github:username'),
            github = new GitHub(accessToken),
            _followers = JSON.parse(localStorage.getItem('flowerers:github:followers:'));

        if (_followers) {
            drawFollowers(_followers);
        }
        else {
            github.followers(username)
                .then(function(followers) {
                    drawFollowers(followers);
                })
                .catch(function(e) {
                    console.error(e);
                });
        }
    });

    function drawFollowers() {
        jsnx.push
    }

});
