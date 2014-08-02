define(['domReady', 'd3', 'jsnx', 'when', 'GitHub'],
function(domReady, d3, jsnx, when, GitHub) {
    domReady(function() {
        var accessToken = localStorage.getItem('flowerers:github:access_token'),
            username = localStorage.getItem('flowerers:github:username'),
            github = new GitHub(accessToken);

        github.followers(username)
            .then(function(followers) {
                var promises = followers.map(function(u) {
                    return github.followers(u.login)
                        .then(function(fol) {
                            if (fol.length < 50) {
                                // hcilab
                                updateGraph(u.login, fol.map(function(u) { return u.login; }));
                            }
                        });
                });

                updateGraph(username, followers.map(function(u) { return u.login; }));

                when.all(promises)
                    .then(function() {
                        drawGraph();
                    })
                    .catch(function(e) {
                        console.error(e);
                    });
            })
            .catch(function(e) {
                console.error(e);
            });
    });

    var G = window.G = jsnx.Graph();
    window.jsnx = jsnx;

    function updateGraph(centerNode, edgeNodes) {

        G.add_nodes_from(centerNode);
        G.add_nodes_from(edgeNodes);

        edgeNodes.forEach(function(edgeNode) {
            G.add_edges_from([[centerNode, edgeNode]]);
        });
    }

    var drawGraph = window.drawGraph = function(argument) {
        jsnx.draw(G, {
            element: '#canvas',
            with_labels: true,
            weighted: false,
            edge_style: {
                'stroke-width': 2,
                'stroke': 'rgb(253,246,227)',
                'fill': 'rgb(253,246,227)'
            },
            node_style: {
                'fill': 'rgba(0,0,0,0)',
                'stroke-width': 0
            }
        }, true);
    };


});
