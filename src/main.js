define(['domReady', 'when', 'Graph', 'GitHub'],
function(domReady, when, Graph, GitHub) {
    var TOAST_INTERVAL = 2000;

    domReady(function() {
        var $username = document.getElementById('username'),
            $token = document.getElementById('token'),
            $visualize = document.getElementById('visualize'),
            _username = localStorage.getItem('flowerers:github:username'),
            _token = localStorage.getItem('flowerers:github:access_token');

        $username.value = _username;
        $token.value = _token;

        $visualize.onclick = function() {
            toast();
            if (!$username.value || !$token.value) {
                toast('Username or token is missing', true);
                return;
            }

            localStorage.setItem('flowerers:github:username', $username.value);
            localStorage.setItem('flowerers:github:access_token', $token.value);

            document.getElementById('main').hidden = true;
            document.getElementById('canvas').style.visibility = "visible";

            visualize();
        };

    });

    function toast(msg) {
        var $nav = document.getElementById('nav'),
            $toast = document.getElementById('toast');

        function untoast() {
            $nav.style.top = '-500px';
            $toast.innerHTML = null;
        }

        if (msg) {
            console.log('msg', msg);
            $nav.style.top = 0;
            $toast.innerHTML = msg;
        }
        else {
            untoast();
        }
    }

    function visualize() {
        var accessToken = localStorage.getItem('flowerers:github:access_token'),
            originalGangster = localStorage.getItem('flowerers:github:username'),
            github = new GitHub(accessToken),
            graph = window.graph = new Graph();

        toast('Loading...');

        github.followers(originalGangster)
            .then(function(followers) {
                return followers.map(function(u) {
                    return github.followers(u.login)
                        .then(function(fol) {
                            toast('Loaded ' + u.login);
                            var logins = fol.map(function(u) { return u.login; }),
                                login = u.login;
                            graph.addAdjacentNodes(login, logins);
                        });
                });
            })
            .then(function(promises) {
                return when.all(promises);
            })
            .tap(function() {
                toast();
                graph.draw(originalGangster);
            })
            .catch(function(e) {
                toast(JSON.stringify(e));
                console.error(e);
            });
    }

});
