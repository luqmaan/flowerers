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
            document.getElementById('canvas').style.display = "block";

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
                graph.addAdjacentNodes(originalGangster, followers);
                return followers.map(function(u) {
                    return github.followers(u.login)
                        .then(function(flowerers) {
                            toast('Loaded ' + u.login);
                            var logins = flowerers.map(function(u) { return u.login; }),
                                login = u.login;
                            graph.addAdjacentNodes(login, logins);
                        });
                });
            })
            .then(function(promises) {
                return when.all(promises);
            })
            .tap(function() {
                toast(originalGangster + '\'s Followers');
                graph.draw(originalGangster);
            })
            .catch(function(e) {
                var msg = e;
                console.error(e);

                if (typeof e === String) {
                    msg = e;
                }
                else if (e.message) {
                    msg = e.message;
                }
                else if (e.body && e.body.message) {
                    // github api
                    msg = e.body.message;
                }
                else if (typeof e === Object) {
                    msg = JSON.stringify(e);
                }
                toast(msg);
            });
    }

});
