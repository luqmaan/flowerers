define(['domReady', 'when', 'Graph', 'GitHub'],
function(domReady, when, Graph, GitHub) {
    domReady(function() {
        var $username = document.getElementById('username'),
            $token = document.getElementById('token'),
            $visualize = document.getElementById('visualize'),
            _username = localStorage.getItem('flowerers:github:username'),
            _token = localStorage.getItem('flowerers:github:access_token');

        $username.value = _username;
        $token.value = _token;

        $visualize.onclick = function() {
            if (!$username.value || !$token.value) {
                alert('Username or token missing');
                return;
            }
            localStorage.setItem('flowerers:github:username', $username.value);
            localStorage.setItem('flowerers:github:access_token', $token.value);

            document.getElementById('nav').hidden = true;
            document.getElementById('canvas').style.visibility = "visible";
            visualize();
        };

    });

    function visualize() {
        var accessToken = localStorage.getItem('flowerers:github:access_token'),
            originalGangster = localStorage.getItem('flowerers:github:username'),
            github = new GitHub(accessToken),
            graph = window.graph = new Graph();

        github.followers(originalGangster)
            .then(function(followers) {
                var promises = followers.map(function(u) {
                    return github.followers(u.login)
                        .then(function(fol) {
                            var logins = fol.map(function(u) { return u.login; }),
                                login = u.login;
                            graph.addAdjacentNodes(login, logins);
                        });
                });

                return promises;
            })
            .then(function(promises) {
                return when.all(promises);
            })
            .then(function() {
                console.log('all');
                alert('all');
                graph.draw(originalGangster);
            })
            .catch(function(e) {
                alert(JSON.stringify(e));
                console.error(e);
            });
    }

});
