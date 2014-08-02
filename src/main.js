define(['domReady', 'd3', 'jsnx', 'when', 'GitHub'],
function(domReady, d3, jsnx, when, GitHub) {
    domReady(function() {
        var accessToken = localStorage.getItem('flowerers:github:access_token'),
            originalGangster = localStorage.getItem('flowerers:github:username'),
            github = new GitHub(accessToken);

        github.followers(originalGangster)
            .then(function(followers) {
                var promises = followers.map(function(u) {
                    return github.followers(u.login)
                        .then(function(fol) {
                            if (fol.length < 200) {
                                var logins = fol.map(function(u) { return u.login; }),
                                    login = u.login;
                                updateGraph(login, logins);
                            }
                        });
                });

                when.all(promises)
                    .then(function() {
                        drawGraph(originalGangster);
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
        G.add_nodes_from([centerNode]);
        G.add_nodes_from(edgeNodes);

        var edges = edgeNodes.map(function(edgeNode) {
            return [centerNode, edgeNode];
        });

        G.add_edges_from(edges);
    }

    function removeWeakNodes(min) {
        var degreeIter = G.degree_iter(),
            weakNodes = [],
            node;

        while (true) {
            try {
                node = degreeIter.next();
            }
            catch(e) {
                if (e.message !== 'StopIteration') console.error(e);
                break;
            }

            console.log(node[0], node[1]);
            if (node[1] < min) {
                weakNodes.push(node[0]);
            }
        }

        G.remove_nodes_from(weakNodes);
    }

    var drawGraph = window.drawGraph = function(centerNode) {
        G.remove_nodes_from([centerNode]);
        removeWeakNodes(2);
        removeWeakNodes(1);

        jsnx.draw(G, {
            element: '#canvas',
            with_labels: true,
            weighted: false,
            label_style: {
                'fill': 'rgb(9,24,76)',
            },
            edge_style: {
                'stroke-width': 2,
                'stroke': 'rgb(172,178,198)',
                'fill': 'rgb(172,178,198)'
            },
            node_style: {
                'fill': 'rgba(0,0,0,0)',
                'stroke-width': 0
            }
        }, true);
    };


});
