define('Graph', ['d3', 'jsnx'],
function(d3, jsnx) {

    function Graph() {
        this.G = jsnx.DiGraph();
    }

    Graph.prototype.addAdjacentNodes = function(centerNode, adjacentNodes) {
        this.G.add_nodes_from([centerNode]);
        this.G.add_nodes_from(adjacentNodes);

        var edges = adjacentNodes.map(function(node) {
            return [centerNode, node];
        });

        this.G.add_edges_from(edges);
    };

    Graph.prototype.removeWeakNodes = function(min) {
        var degreeIter = this.G.degree_iter(),
            weakNodes = [],
            node;

        while (true) {
            try {
                node = degreeIter.next();
            }
            catch(e) {
                if (e.message !== 'StopIteration') {
                    throw e;
                }
                break;
            }

            if (node[1] < min) {
                weakNodes.push(node[0]);
            }
        }

        console.log('Removing weak nodes', weakNodes);
        this.G.remove_nodes_from(weakNodes);
    };

    Graph.prototype.removeSpamNodes = function() {
        var iter = this.G.nodes_iter(),
            spamNodes = [],
            inDeg,
            outDeg,
            ratio,
            node;

        while (true) {
            try {
                node = iter.next();
            }
            catch(e) {
                if (e.message !== 'StopIteration') {
                    throw e;
                }
                break;
            }
            inDeg = this.G.in_degree(node);
            outDeg = this.G.out_degree(node);
            ratio =  Math.max(inDeg, 1) / Math.max(outDeg, 1);

            if (ratio < 0.03) {
                console.log(node, ratio, outDeg);
                spamNodes.push(node);
            }
        }

        console.log('Removing spammy nodes', spamNodes);
        this.G.remove_nodes_from(spamNodes);
    };

    Graph.prototype.draw = function(centerNode) {
        this.G.remove_nodes_from([centerNode]);
        this.removeSpamNodes();
        this.removeWeakNodes(2);
        this.removeWeakNodes(1);

        jsnx.draw(this.G, {
            element: '#canvas',
            with_labels: true,
            weighted: false,
            label_style: {
                fill: 'rgb(9,24,76)',
            },
            edge_style: {
                stroke: 'rgb(172,178,198)',
                fill: 'rgb(172,178,198)',
                'stroke-width': 2,
            },
            node_style: {
                fill: 'rgba(0,0,0,0)',
                'stroke-width': 0,
            }
        }, false);
    };

    return Graph;

});
