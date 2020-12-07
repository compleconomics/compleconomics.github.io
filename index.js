//// REVEAL.JS SLIDES (HERE 4 SLIDE CHANGES)
var _transitions = [
    {
        transitionForward: timeforwards,
        transitionBackward: timebackwards
    },
    {
        transitionForward: timeforwards,
        transitionBackward: timebackwards
    },
    {
        transitionForward: timeforwards,
        transitionBackward: timebackwards
    },
    {
        transitionForward: timeforwards,
        transitionBackward: timebackwards
    }
]
// Variable declarations
var linkedByIndex;
var nlayers;
var lay;
function laycolor(alpha) {
    var colstring = "rgba("+
        (90+Math.sqrt(lay)*150)
        +","+
        (240-50*lay)
        +","+
        (240-100*Math.sqrt(lay))
        +","+alpha
        +")";
    return colstring
};
var mpl = 1;
var nodes = {};
var layers = {};
var times = {};
var svg_layer=[];
var text_layer=[];
var circle_layer=[];
var link_layer=[];
var dilink_layer=[];
var dititle_layer=[];
var layer_label=[];
var width = 1300
var height = 4/6*width;
var fontsize = height/15;
var linkcolor = "#000";
var arrowcolor = linkcolor;
var linkopacity = 0.5;
var arrowopacity = 1.0;//linkopacity*0.6;
var textopacity = 1.0;
var nodeopacity = 1;
var markerbreite = 12;
var markerhoehe = 12;
var timeCounter = 0;
var rscal = 10;
var reachednodes = [];
var reachedlinks = [];
var t1n,t1r,tn,tr = [];
var outtot;
var intot;
var graphlayerlinks;
var simulation = d3.forceSimulation();

////BUTTON AND/OR REVEAL FUNCTIONS
////click layer to stop simulation; drag node to resume
function timebackwards(){
    if (timeCounter > 0) {
        timeCounter = timeCounter - 1;
        update();
    }
};
function timeforwards(){
    if (timeCounter+1 < Object.keys(graphtimes).length) {
        timeCounter = timeCounter + 1;
        update();
    }
};
d3.select("#goback-btn").on("click", timebackwards);
d3.select("#stop-btn").on("click", () => simulation.stop());
d3.select("#goforward-btn").on("click", timeforwards);


// Load network data from external file with toy net as fallback
d3.csv("testset.csv", function(error, links){
    if (error){
        var links = [
            {source:"N1", target:"N2", layer:"eins", value:100, time:0},
            {source:"N2", target:"N3", layer:"eins", value:2000, time:0},
            {source:"N2", target:"N4", layer:"eins", value:50, time:0},
            {source:"N1", target:"N3", layer:"eins", value:50, time:0},
            {source:"N2", target:"N4", layer:"zwei", value:9, time:0},
            {source:"N3", target:"N4", layer:"zwei", value:50, time:0},
            {source:"N1", target:"N2", layer:"eins", value:4, time:1},
            {source:"N1", target:"N3", layer:"eins", value:4, time:1},
            {source:"N3", target:"N4", layer:"eins", value:4, time:1},
            {source:"N3", target:"N2", layer:"eins", value:4, time:1},
            {source:"N4", target:"N3", layer:"drei", value:4, time:1},
            {source:"N2", target:"N4", layer:"drei", value:4, time:1},
            {source:"N3", target:"N2", layer:"drei", value:4, time:1},
            {source:"N1", target:"N3", layer:"vier", value:4, time:2},
            {source:"N4", target:"N3", layer:"vier", value:4, time:2},
            {source:"N2", target:"N3", layer:"vier", value:4, time:3},
            {source:"N2", target:"N1", layer:"zwei", value:4, time:3},
            {source:"N2", target:"N3", layer:"zwei", value:4, time:3}
        ];
    }

    // Compute the distinct nodes and layers from the links.
    allgraphlinks = links;
    allgraphlinks.forEach(function(link) {
        link.source = nodes[link.source] ||
            (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] ||
            (nodes[link.target] = {name: link.target});
        if (link.layer) {
            link.layer = layers[link.layer] ||
                (layers[link.layer] = {name: link.layer})
        } else {
            link.layer = layers["Network"] ||
                (layers["Network"] = {name: "Network"});
        }
        if (link.time) {
            link.time = times[link.time] ||
                (times[link.time] = {name: link.time});
        } else {
            link.time = times["t"] ||
                (times["t"] = {name: "t"});
        }
    });
    graphnodes = d3.values(nodes);
    graphnodes.forEach(function(d){ d.degree = {}; d.outdegree = {}; d.indegree = {}; })
    graphlayers = layers;
    graphtimes = times;
    nlayers = Object.keys(graphlayers).length;

    // SIMULATION INIT
    simulation.force("charge", d3.forceManyBody()
        .strength(-2000-200*Math.sqrt(Object.keys(graphlayers).length))
        .distanceMin(100)
        .distanceMax(500)
    )
        .force("link", d3.forceLink().id( function(d){
            return d.index;})
        )
        .force("center", d3.forceCenter(width/2, height/2))
        .force('collide', d3.forceCollide(25))
        .force("y", d3.forceY(0.01))
        .force("x", d3.forceX(0.01))

    for (lay=nlayers-1; lay>=0; lay--){
        // SVG LAYER
        svg_layer[lay] = d3.select("body").append("svg")
            .attr("layer", Object.keys(graphlayers)[lay])
            .style("position", "absolute")
            .style("left", "100px")
            .style("top", (lay*height/2.5).toString()+"px")
            .style("background-color", laycolor(0.3))
            .style("transform","rotate3D(-0.9,0.4,0.4,70deg)")
            .style("-webkit-transform","rotate3D(-0.9,0.4,0.4,70deg)")
            .style("outline","1px solid black")
            .attr("width", width)
            .attr("height", height)
            .on("click", function() { simulation.stop(); })

        // ARROWS (IN CASE OF DIRECTED LINKS)
        svg_layer[lay].append("svg:defs").selectAll("marker")
            .data(["end"])
            .enter().append("svg:marker")
            .attr("id", "arrowGray")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 0)
            .attr("refY", 0)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("markerWidth", markerbreite)
            .attr("markerHeight", markerhoehe)
            .attr("orient", "auto")
            .attr("opacity", arrowopacity)
            .attr("fill", arrowcolor)
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5"); 

        // LABEL LAYER
        layer_label[lay] = svg_layer[lay].selectAll(".layerlabel")
            .data([Object.keys(graphlayers)[lay]])
            .enter().append("text")
            .text(function(d){return d;})
            .attr("dx", function(d){return width-0.8*d.toString().length*fontsize;})
            .attr("dy", fontsize)
            .style("font-size", fontsize+"px")
            .style("stroke", "#000000")
            .style("stroke-width", "0.2px")
            .style("fill", laycolor(1.0));
    }

    update();
});



function update() {
    // nodes are fix to allow for smooth visuals
    var graphlinks = allgraphlinks.filter( function(d) {return d.time.name == Object.keys(graphtimes)[timeCounter];} );

    // get across layer connections for mouseover-to-fade
    linkedByIndex = {};
    graphlinks.forEach(d => {
        linkedByIndex[`${d.source.name},${d.target.name}`] = 1;
    });


    graphnodes.forEach(function(d) {
        d.inneighbors = [];
        d.outneighbors = [];
        for(var i=0; i<graphlinks.length; i++){
            if (d.name === graphlinks[i].source.name) {
                if (!d.outneighbors.includes(graphlinks[i].target.name)){
                    d.outneighbors.push(graphlinks[i].target.name)
                }
            } else if (d.name === graphlinks[i].target.name){
                if (!d.inneighbors.includes(graphlinks[i].source.name)){
                    d.inneighbors.push(graphlinks[i].source.name)
                }
            }
        }
    });

    for (lay=nlayers-1; lay>=0; lay--){

        var graphlinks_sublayer = graphlinks.filter( function(d){return d.layer.name == Object.keys(graphlayers)[lay];} );

        //calculate node statistics for circle size
        graphnodes.forEach(function(d) {
            outtot = 0;
            intot = 0;
            for(var i=0; i<graphlinks_sublayer.length; i++){
                if (d.name == graphlinks_sublayer[i].source.name){
                    outtot += 1 //(graphlinks_sublayer[i].value != 0 ? 1 : 0);
                }
                else if (d.name == graphlinks_sublayer[i].target.name){
                    intot += 1 //(graphlinks_sublayer[i].value != 0 ? 1 : 0);
                }
            }
            d.outdegree[lay] = outtot;
            d.indegree[lay] = intot;
            d.degree[lay] = outtot + intot;
        });

        // DIRECTED LINK LAYER
        dilink_layer[lay] = svg_layer[lay].selectAll(".link")
            .data(graphlinks_sublayer)
        dilink_layer[lay].exit().remove();
        dilink_layer[lay] = dilink_layer[lay].enter().insert("svg:path",":first-child")
            .merge(dilink_layer[lay])
            .attr("class", "link")
            .attr("marker-end", "url(#arrowGray)")
            .style("stroke-width", function(d){return Math.sqrt(d.value);})
            .style("fill", linkcolor)
            .style("stroke-opacity", linkopacity);
        dilink_layer[lay].selectAll(".linktitle").remove();
        dilink_layer[lay].append("title")
            .attr("class","linktitle")
            .text(function(d) {
                linkinfo = "Source:  " + d.source.name
                    + "\nTarget:   " + d.target.name
                    + "\nLayer:    " + d.layer.name
                    + "\nWeight: " + d.value;
                return linkinfo;
            });

        // CIRCLE LAYER
        nola = svg_layer[lay].selectAll(".circles").data(graphnodes)
        nola.exit().remove();
        circle_layer[lay] = nola.enter().append("circle")
            .merge(nola)
            .attr("class", "circles")
            .attr("r", function(d){ return rscal*Math.sqrt(d.degree[lay]) })
            .style("stroke", "#000000")
            .style("stroke-width", "2px")
            .style("opacity", nodeopacity)
            .style("fill", laycolor(1.0))
            .on('mouseover.fade', fade(0.05))
            .on('click.fade', connectivityfade(0.05))
            //.on('dblclick.fade', connectivityfade(0.05))
            .on('mouseout.fade', restorefade())
            .call(d3.drag()
                .filter(x => {return (d3.event.altKey||d3.event.ctrlKey?false:true);})
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );
        // TEXT LAYER (issue: adds redundant label each timestep)
        nola = svg_layer[lay].selectAll(".texts").data(graphnodes)
        nola.exit().remove();
        text_layer[lay] = nola.enter().append("text")
            .merge(nola)
            .attr("class", "texts")
            .attr("x", function(d){return -5*d.name.length*rscal*Math.sqrt(d.degree[lay])/20+"px"})
            .attr("dx", "0px")
            .attr("dy", "5px")
            .text(function(d) { return d.name; })
            .style("font-size", function(d){return rscal*Math.sqrt(d.degree[lay]) })
            .style("fill","#000")
            .style("stroke", laycolor(0.3))
            .style("opacity", textopacity)
            .style("stroke-width", "4px");
        circle_layer[lay].append("title")
            .text(function(d) { return "Node: " + d.name; });

        // SIMULATION SETUP
        simulation.nodes(graphnodes);
        simulation.on("tick", tick);
        simulation.force("link").links(graphlinks);
        simulation.alphaTarget(0.3).restart();

        function tick() {
            for (lay=nlayers-1; lay>=0; lay--){

                dilink_layer[lay].attr("d", function(d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = 0;//Math.sqrt(dx * dx + dy * dy);
                    return "M" + 
                        d.source.x + "," + 
                        d.source.y + "A" + 
                        dr + "," + dr + " 0 0,1 " + 
                        d.target.x + "," + 
                        d.target.y;
                });

                //// adjusts arrowpath length 
                dilink_layer[lay].attr("d", function(d) {
                    var pl = this.getTotalLength(),
                        // radius of circle plus marker head
                        cor = 1.5;
                    r = rscal/cor*Math.sqrt(d.target.degree[lay])  +  Math.sqrt(markerhoehe*markerhoehe+markerbreite*markerbreite), 
                        //get position close to where path intercepts circle
                        m = this.getPointAtLength(pl - r);

                    var dx = m.x - d.source.x,
                        dy = m.y - d.source.y,
                        dr = 0; //Math.sqrt(dx * dx + dy * dy);

                    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + m.x + "," + m.y;
                });

                circle_layer[lay]
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                text_layer[lay]
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                //circle_layer[lay]
                //  .attr("cx", function(d) { 
                //    radius = rscal*Math.sqrt(d.degree[lay]) 
                //    return (d.x = Math.max(radius, Math.min(width - radius, d.x)));
                //  })
                //  .attr("cy", function(d) { 
                //    return (d.y = Math.max(radius, Math.min(height - radius, d.y)));
                //  });

            }
        }


        //function oldfade(opacity) {
        //    return d => {
        //        for (lay=nlayers-1; lay>=0; lay--){
        //            circle_layer[lay].style("stroke", function(s){
        //                if (d.name == s.name) {
        //                    return "rgb(255,0,0)"
        //                } else {
        //                    return "rgb(0,0,0)"
        //                }
        //            })
        //            circle_layer[lay].style('stroke-opacity', function (o) {
        //                //// Alt+hover: indegree; hover:out-degree
        //                if (!d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey){
        //                    var thisOpacity = (linkedByIndex[`${d.name},${o.name}`] || d.name === o.name) ? nodeopacity : opacity;
        //                } else if (d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey){
        //                    var thisOpacity = (linkedByIndex[`${d.name},${o.name}`] || d.name === o.name) ? nodeopacity : opacity;
        //                } else if (!d3.event.shiftkey && !d3.event.ctrlKey && d3.event.altKey){
        //                    var thisOpacity = (linkedByIndex[`${o.name},${d.name}`] || d.name === o.name) ? nodeopacity : opacity;
        //                } else {
        //                    var thisOpacity = nodeopacity;
        //                }
        //                this.setAttribute('fill-opacity', thisOpacity);
        //                return thisOpacity;
        //            });

        //                //// Ctrl+hover: indegree; hover:out-degree
        //            if (!d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey){
        //                dilink_layer[lay].style('opacity', o => (o.source === d ? 1.0 : opacity));
        //            } else if (!d3.event.shiftkey && !d3.event.ctrlKey && d3.event.altKey){
        //                dilink_layer[lay].style('opacity', o => (o.target === d ? 1.0 : opacity));
        //            } else {
        //                dilink_layer[lay].style('opacity', 1.0)
        //            }
        //        }
        //    };
        //}
        function restorefade() {
            return d => {
                mpl=1;
                for (lay=nlayers-1; lay>=0; lay--){
                    circle_layer[lay]
                        .style('stroke-opacity', function (o) {
                            this.setAttribute('fill-opacity', 1); 
                        })
                        .style('stroke', '#000');
                    dilink_layer[lay].style('opacity', o => 1.0);
                }
            };
        }


        function bfs(start, reachedvector, reachedvector2, maxpathlength) {
            var cont = [];
            cont.push(start.name)
            reachedvector.push(start.name);
            var distances = {};
            distances[start.name] = 0;

            while (cont.length > 0) {
                // console.log(distances)
                var vert = cont.shift()
                var vertnode = graphnodes.filter(u => u.name==vert)[0];
                var distprev = Math.max(...Object.values(distances))
                var nachbarn = [...new Set([...vertnode.outneighbors, ...vertnode.inneighbors])]
                for (const x of nachbarn) {
                    if (!reachedvector.includes(x)) {
                        distances[x] = distances[vert] + 1;
                        cont.push(x);
                    }
                }
                if(Math.max(...Object.values(distances)) - distprev>0) { 
                    console.log("all nodes of level <=", distprev) 
                    if (distprev == maxpathlength) { return 1 }
                }
                for (const x of nachbarn) {
                    if (!reachedvector.includes(x)) {
                        reachedvector.push(x);
                    }
                    //INCLUDES TOO MUCH (POSSIBLE NONEXISTENT OUTLINK WHEN INLINK OR VICE VERSA) HERE
                    //BUT FILTERED OUT LATER WHEN COMPARING WITH GRAPHLINKS
                    if ( !reachedvector2.includes([vert,x]) ) {
                        reachedvector2.push([vert,x])
                    }
                    if ( !reachedvector2.includes([x,vert]) ) {
                        reachedvector2.push([x,vert])
                    }
                }
            }
            return 1;
        }
        function outbfs(start, reachedvector, reachedvector2, maxpathlength) {
            var cont = [];
            cont.push(start.name)
            reachedvector.push(start.name);
            var distances = {};
            distances[start.name] = 0;

            while (cont.length > 0) {
                // console.log(distances)
                var vert = cont.shift()
                var vertnode = graphnodes.filter(u => u.name==vert)[0];
                var distprev = Math.max(...Object.values(distances))
                vertnode.outneighbors.forEach(function(x){
                    if (!reachedvector.includes(x)) {
                        distances[x] = distances[vert] + 1;
                        cont.push(x);
                    }
                });
                if(Math.max(...Object.values(distances)) - distprev>0) { 
                    console.log("all nodes of level <=", distprev) 
                    if (distprev == maxpathlength) { return 1 }
                }
                vertnode.outneighbors.forEach(function(x){
                    if (!reachedvector.includes(x)) {
                        reachedvector.push(x);
                    }
                    if ( !reachedvector2.includes([vert,x]) ) {
                        reachedvector2.push([vert,x])
                    }
                });
            }
            return 1;
        }
        function inbfs(start, reachedvector, reachedvector2, maxpathlength) {
            var cont = [];
            cont.push(start.name)
            reachedvector.push(start.name);
            var distances = {};
            distances[start.name] = 0;
            while (cont.length > 0) {
                // console.log(distances)
                var vert = cont.shift()
                var vertnode = graphnodes.filter(u => u.name==vert)[0];
                var distprev = Math.max(...Object.values(distances))
                vertnode.inneighbors.forEach(function(x){
                    if (!reachedvector.includes(x)) {
                        distances[x] = distances[vert] + 1;
                        cont.push(x);
                    }
                });
                if(Math.max(...Object.values(distances)) - distprev>0) { 
                    console.log("all nodes of level <=", distprev) 
                    if (distprev == maxpathlength) { return 1 }
                }
                vertnode.inneighbors.forEach(function(x){
                    if (!reachedvector.includes(x)) {
                        reachedvector.push(x);
                    }
                    if ( !reachedvector2.includes([x,vert]) ) {
                        reachedvector2.push([x,vert])
                    }
                });
            }
            return 1;
        }

        //function outdfs(start, reachedvector) {
        //    if ( !reachedvector.includes(start.name) ){
        //        reachedvector.push(start.name)
        //    }
        //    for(var i=0; i<Object.keys(start.outneighbors).length; i++){
        //        if ( !reachedvector.includes(start.outneighbors[i]) ) {
        //            outdfs( graphnodes.filter(function(a){return a.name == start.outneighbors[i];})[0], reachedvector);
        //        }
        //        if ( reachedvector.length == graphnodes.length){
        //            return 1;
        //        }
        //    }
        //}
        //
        function fade(opacity) {
            return d => {
                reachednodes = [];
                reachedlinks = [];
                if (!d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey){
                    outbfs(d, reachednodes, reachedlinks, 1)
                } else if (d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey) {
                    outbfs(d, reachednodes, reachedlinks, -1)
                } else if (!d3.event.shiftKey && !d3.event.ctrlKey && d3.event.altKey) {
                    inbfs(d, reachednodes, reachedlinks, 1)
                } else if (d3.event.shiftKey && !d3.event.ctrlKey && d3.event.altKey) {
                    inbfs(d, reachednodes, reachedlinks, -1)
                } else if (d3.event.shiftKey && !d3.event.ctrlKey && d3.event.altKey) {
                    inbfs(d, reachednodes, reachedlinks, -1)
                } else if (!d3.event.shiftKey && !d3.event.ctrlKey && !d3.event.altKey) {
                    bfs(d, reachednodes, reachedlinks, 1)
                } else if (d3.event.shiftKey && !d3.event.ctrlKey && !d3.event.altKey) {
                    bfs(d, reachednodes, reachedlinks, -1)
                }

                for (lay=nlayers-1; lay>=0; lay--){
                    circle_layer[lay].style("stroke", function(s){
                        if (d.name == s.name) {
                            return "rgb(255,0,0)"
                        } else {
                            return "rgb(0,0,0)"
                        }
                    })

                        circle_layer[lay].style('stroke-opacity', function (o) {
                            const thisOpacity = reachednodes.includes(o.name) ? nodeopacity : opacity
                            this.setAttribute('fill-opacity', thisOpacity);
                            return thisOpacity;
                        });
                        dilink_layer[lay].style('opacity', function(o){ return (searchForArray(reachedlinks, [o.source.name, o.target.name])>=0 ? 1.0 : opacity)});
                }
            }
        }

        function connectivityfade(opacity) {
            return d => {
                reachednodes = [];
                reachedlinks = [];
                mpl=mpl+1;
                // Ctrl/Alt-Click: +1Pathlength; Shift+Ctrl/Alt-Click: +InfPathlength
                if (!d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey){
                    outbfs(d, reachednodes, reachedlinks, mpl)
                } else if (d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey) {
                    outbfs(d, reachednodes, reachedlinks, -1)
                } else if (!d3.event.shiftKey && !d3.event.ctrlKey && d3.event.altKey) {
                    inbfs(d, reachednodes, reachedlinks, mpl)
                } else if (d3.event.shiftKey && !d3.event.ctrlKey && d3.event.altKey) {
                    inbfs(d, reachednodes, reachedlinks, -1)
                } else if (!d3.event.shiftKey && !d3.event.ctrlKey && !d3.event.altKey) {
                    bfs(d, reachednodes, reachedlinks, mpl)
                } else if (d3.event.shiftKey && !d3.event.ctrlKey && !d3.event.altKey) {
                    bfs(d, reachednodes, reachedlinks, -1)
                }

                for (lay=nlayers-1; lay>=0; lay--){
                    circle_layer[lay].style("stroke", function(s){
                        if (d.name == s.name) {
                            return "rgb(255,0,0)"
                        } else {
                            return "rgb(0,0,0)"
                        }
                    })
                    circle_layer[lay].style('stroke-opacity', function (o) {
                        const thisOpacity = reachednodes.includes(o.name) ? nodeopacity : opacity
                        this.setAttribute('fill-opacity', thisOpacity);
                        return thisOpacity;
                    });
                    dilink_layer[lay].style('opacity', function(o){ return (searchForArray(reachedlinks, [o.source.name, o.target.name])>=0 ? 1.0 : opacity)});

                }
            }
        }

        function searchForArray(haystack, needle){
            var i, j, current;
            for(i = 0; i < haystack.length; ++i){
                if(needle.length === haystack[i].length){
                    current = haystack[i];
                        for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
                            if(j === needle.length)
                            return i;
                }
            }
            return -1
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.5).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0.5);
            d.fx = null;
            d.fy = null;

        }
    }
}