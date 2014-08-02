define(['domReady', 'when', 'Graph', 'GitHub'],
function(domReady, when, Graph, GitHub) {
    domReady(function() {
        var accessToken = localStorage.getItem('flowerers:github:access_token'),
            originalGangster = localStorage.getItem('flowerers:github:username'),
            github = new GitHub(accessToken),
            graph = new Graph();

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
            .then(graph.draw.bind(graph))
            .catch(function(e) {
                console.error(e);
            });
    });

});
