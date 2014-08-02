define(['domReady', 'd3', 'jsnx', 'GitHub'],
function(domReady, d3, jsnx, GitHub) {
    domReady(function() {
        var accessToken = localStorage.getItem('flowerers:github:access_token'),
            username = localStorage.getItem('flowerers:github:username'),
            github = new GitHub(accessToken);

        github.followers(username)
            .then(function(followers) {
                window.f = followers;
                var nodes = followers.map(function(u) { return u.login; });
                drawGraph(nodes);
            })
            .catch(function(e) {
                console.error(e);
            });
    });

    function drawGraph(nodes) {
        var G = jsnx.Graph();
        G.add_nodes_from(nodes);
        jsnx.draw(G, {
            element: '#canvas',
            with_labels: true,
            weighted: true,
            edge_style: {
                'stroke-width': 10
            }
        });
    }

});
