define(['domReady', 'GitHub'],
function(domReady, GitHub) {
    domReady(function() {
        var accessToken = localStorage.getItem('flowerers:github:access_token'),
            username = localStorage.getItem('flowerers:github:username'),
            github = new GitHub(accessToken);

        github.followers(username)
            .then(function(data) {
                console.log('success', data);
            })
            .catch(function(e) {
                console.error(e);
            });
    });
});
