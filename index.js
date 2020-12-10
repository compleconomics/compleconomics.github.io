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
var togglelayerlabels=true
var togglenodelabels=true
var toggletimelabels=true
var withinlinks = [];
var nlayers;
var lay;
var mpl;
var nodes = {};
var layers = {};
var times = {};
var nodetypes = {};
var svg_layer=[];
var text_layer=[];
var circle_layer=[];
var link_layer=[];
var dilink_layer=[];
var dititle_layer=[];
var layer_label=[];
var layer_typelabel=[];
var width = 1000
var height = 4/6*width;
var fontsize = height/15;
var linkcolor = "#000";
var arrowcolor = linkcolor;
var linkopacity = 0.5;
var arrowopacity = 1.0;//linkopacity*0.6;
var layeropacity = 0.3;
var textopacity = 1.0;
var nodeopacity = 1;
var nodelabelopacity = 0.6;
var timelabelopacity = 0.6;
var markerbreite = 12;
var markerhoehe = 12;
var timeCounter = 0;
var rscal = 7;
var tempreachedvector = [];
var reachednodes = [];
var reachedlinks = [];
var t1n,t1r,tn,tr = [];
var outtot;
var intot;
var graphlayerlinks;
var simulation = d3.forceSimulation();

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

////random generator and color intializer
//set first colors manually and remaining stochastically
function mulberry32(a) { return function() {
  var t = a += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
}
var seed = 30;
var randco = mulberry32(seed);
function threerand(){ 
  var ra = Array.from(Array(3), () => Math.floor(randco()*105+150))
  return "rgba(" + ra[0] + "," + ra[1] + "," + ra[2] + ","
}
var laycolor = ["rgba(90,240,240,", "rgba(240,190,140,"]
var laymanual = laycolor.length
////random generator and color intializer


////random generator and color intializer
//set nodecolor random generator
var nodelayerseed = 2;
var nlrandco = mulberry32(nodelayerseed);
function nodethreerand(){
  var r1 = nlrandco(); r1 = 0 <= r1 < 0.33 ? Math.floor(r1*255) : 0
  var r2 = nlrandco(); r2 = 0.33 <= r2 < 0.66 ? Math.floor(r2*255) : 0
  var r3 = nlrandco(); r3 = 0.66 <= r3 <= 1 ? Math.floor(r3*255) : 0
  return "rgba(" + r1 + "," + r2 + "," + r3 + ","
}
var nodelaybaselinecolor = ["rgba(255,0,0", "rgba(0,158,0,", "rgba(0,68,255,", "rgba(255,0,155,", "rgba(255,180,0", "rgba(180,0,255"]
var nodelaycolor = []
////random generator and color intializer


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
d3.csv("casdffirms.csv", function(error, links){
  if (error){
    //skiphere
    var links = [
      {source:"N0", target:"N1", layer:"eins", value:10, time:0, sourcetype:"Start", targettype:"Core"},
      {source:"N1", target:"N3", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N10", target:"N2", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Periphery"},
      {source:"N2", target:"N4", layer:"eins", value:10, time:0, sourcetype:"Periphery", targettype:"Core"},
      {source:"N2", target:"N5", layer:"eins", value:10, time:0, sourcetype:"Periphery", targettype:"Foreign"},
      {source:"N4", target:"N5", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Foreign"},
      {source:"Negal", target:"N55", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"Negal", target:"N56", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N55", target:"N56", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N00", target:"N1", layer:"eins", value:10, time:0, sourcetype:"Start", targettype:"Core"},
      {source:"N10", target:"N3", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N10", target:"N2", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Periphery"},
      {source:"N20", target:"N4", layer:"eins", value:10, time:0, sourcetype:"Periphery", targettype:"Core"},
      {source:"N20", target:"N5", layer:"eins", value:10, time:0, sourcetype:"Periphery", targettype:"Foreign"},
      {source:"N40", target:"N5", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Foreign"},
      {source:"Negal", target:"N550", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"Negal", target:"N560", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N550", target:"N56", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N000", target:"N1", layer:"eins", value:10, time:0, sourcetype:"Start", targettype:"Core"},
      {source:"N100", target:"N3", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N100", target:"N2", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Periphery"},
      {source:"N200", target:"N4", layer:"eins", value:10, time:0, sourcetype:"Periphery", targettype:"Core"},
      {source:"N200", target:"N5", layer:"eins", value:10, time:0, sourcetype:"Periphery", targettype:"Foreign"},
      {source:"N400", target:"N5", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Foreign"},
      {source:"Negal", target:"N5500", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"Negal", target:"N5600", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N5500", target:"N56", layer:"eins", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N0", target:"N1", layer:"zwei", value:10, time:0, sourcetype:"Start", targettype:"Core"},
      {source:"N1", target:"N3", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N10", target:"N2", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Periphery"},
      {source:"N2", target:"N4", layer:"zwei", value:10, time:0, sourcetype:"Periphery", targettype:"Core"},
      {source:"N2", target:"N5", layer:"zwei", value:10, time:0, sourcetype:"Periphery", targettype:"Foreign"},
      {source:"N4", target:"N5", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Foreign"},
      {source:"Negal", target:"N55", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"Negal", target:"N56", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N55", target:"N56", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N00", target:"N1", layer:"zwei", value:10, time:0, sourcetype:"Start", targettype:"Core"},
      {source:"N10", target:"N3", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N10", target:"N2", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Periphery"},
      {source:"N20", target:"N4", layer:"zwei", value:10, time:0, sourcetype:"Periphery", targettype:"Core"},
      {source:"N20", target:"N5", layer:"zwei", value:10, time:0, sourcetype:"Periphery", targettype:"Foreign"},
      {source:"N40", target:"N5", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Foreign"},
      {source:"Negal", target:"N550", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"Negal", target:"N560", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N550", target:"N56", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N000", target:"N1", layer:"zwei", value:10, time:0, sourcetype:"Start", targettype:"Core"},
      {source:"N100", target:"N3", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N100", target:"N2", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Periphery"},
      {source:"N200", target:"N4", layer:"zwei", value:10, time:0, sourcetype:"Periphery", targettype:"Core"},
      {source:"N200", target:"N5", layer:"zwei", value:10, time:0, sourcetype:"Periphery", targettype:"Foreign"},
      {source:"N400", target:"N5", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Foreign"},
      {source:"Negal", target:"N5500", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"Negal", target:"N5600", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N5500", target:"N56", layer:"zwei", value:10, time:0, sourcetype:"Core", targettype:"Core"},
      {source:"N5", target:"Negal", layer:"eins", value:10, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"N3", target:"N6", layer:"eins", value:10, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"N3", target:"N7", layer:"eins", value:10, time:1, sourcetype:"Core", targettype:"Missing"},
      {source:"N2", target:"N8", layer:"eins", value:10, time:1, sourcetype:"Periphery", targettype:"Other"},
      {source:"N8", target:"N9", layer:"eins", value:10, time:1, sourcetype:"Other", targettype:"Core"},
      {source:"N2", target:"N3", layer:"eins", value:10, time:1, sourcetype:"Periphery", targettype:"Core"},
      {source:"M1", target:"M2", layer:"zwei", value:4, time:1, sourcetype:"Periphery", targettype:"Periphery"},
      {source:"M1", target:"M3", layer:"zwei", value:4, time:1, sourcetype:"Periphery", targettype:"Core"},
      {source:"M3", target:"M4", layer:"zwei", value:4, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"M3", target:"M2", layer:"zwei", value:4, time:1, sourcetype:"Core", targettype:"Periphery"},
      {source:"M4", target:"M3", layer:"drei", value:4, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"M1", target:"M4", layer:"drei", value:4, time:1, sourcetype:"Periphery", targettype:"Core"},
      {source:"M3", target:"M2", layer:"drei", value:4, time:1, sourcetype:"Core", targettype:"Periphery"},
      {source:"N50", target:"Negal", layer:"eins", value:10, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"N30", target:"N6", layer:"eins", value:10, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"N30", target:"N7", layer:"eins", value:10, time:1, sourcetype:"Core", targettype:"Missing"},
      {source:"N20", target:"N8", layer:"eins", value:10, time:1, sourcetype:"Periphery", targettype:"Other"},
      {source:"N80", target:"N9", layer:"eins", value:10, time:1, sourcetype:"Other", targettype:"Core"},
      {source:"N20", target:"N3", layer:"eins", value:10, time:1, sourcetype:"Periphery", targettype:"Core"},
      {source:"M10", target:"M2", layer:"zwei", value:4, time:1, sourcetype:"Periphery", targettype:"Periphery"},
      {source:"M10", target:"M3", layer:"zwei", value:4, time:1, sourcetype:"Periphery", targettype:"Core"},
      {source:"M30", target:"M4", layer:"zwei", value:4, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"M30", target:"M2", layer:"zwei", value:4, time:1, sourcetype:"Core", targettype:"Periphery"},
      {source:"M40", target:"M3", layer:"drei", value:4, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"M10", target:"M4", layer:"drei", value:4, time:1, sourcetype:"Periphery", targettype:"Core"},
      {source:"M30", target:"M2", layer:"drei", value:4, time:1, sourcetype:"Core", targettype:"Periphery"},
      {source:"N500", target:"Negal", layer:"eins", value:10, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"N300", target:"N6", layer:"eins", value:10, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"N300", target:"N7", layer:"eins", value:10, time:1, sourcetype:"Core", targettype:"Missing"},
      {source:"N200", target:"N8", layer:"eins", value:10, time:1, sourcetype:"Periphery", targettype:"Other"},
      {source:"N800", target:"N9", layer:"eins", value:10, time:1, sourcetype:"Other", targettype:"Core"},
      {source:"N200", target:"N3", layer:"eins", value:10, time:1, sourcetype:"Periphery", targettype:"Core"},
      {source:"M100", target:"M2", layer:"zwei", value:4, time:1, sourcetype:"Periphery", targettype:"Periphery"},
      {source:"M100", target:"M3", layer:"zwei", value:4, time:1, sourcetype:"Periphery", targettype:"Core"},
      {source:"M300", target:"M4", layer:"zwei", value:4, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"M300", target:"M2", layer:"zwei", value:4, time:1, sourcetype:"Core", targettype:"Periphery"},
      {source:"M400", target:"M3", layer:"drei", value:4, time:1, sourcetype:"Core", targettype:"Core"},
      {source:"M100", target:"M4", layer:"drei", value:4, time:1, sourcetype:"Periphery", targettype:"Core"},
      {source:"M300", target:"M2", layer:"drei", value:4, time:1, sourcetype:"Core", targettype:"Periphery"}


      //{source:"N1", target:"N2", layer:"eins", value:100, time:0, sourcetype:"c", targettype:"c"},
      //{source:"N2", target:"N3", layer:"eins", value:1000, time:0, sourcetype:"c", targettype:"p"},
      //{source:"N2", target:"N4", layer:"eins", value:50, time:0, sourcetype:"c", targettype:"p"},
      //{source:"N1", target:"N3", layer:"eins", value:50, time:0, sourcetype:"c", targettype:"p"},
      //{source:"N2", target:"N4", layer:"zwei", value:9, time:0, sourcetype:"c", targettype:"p"},
      //{source:"N3", target:"N4", layer:"zwei", value:50, time:0, sourcetype:"p", targettype:"c"},
      //{source:"N1", target:"N2", layer:"eins", value:4, time:1, sourcetype:"p", targettype:"p"},
      //{source:"N1", target:"N3", layer:"eins", value:4, time:1, sourcetype:"p", targettype:"c"},
      //{source:"N3", target:"N4", layer:"eins", value:4, time:1, sourcetype:"c", targettype:"c"},
      //{source:"N3", target:"N2", layer:"eins", value:4, time:1, sourcetype:"c", targettype:"p"},
      //{source:"N4", target:"N3", layer:"drei", value:4, time:1, sourcetype:"c", targettype:"c"},
      //{source:"N1", target:"N4", layer:"drei", value:4, time:1, sourcetype:"p", targettype:"c"},
      //{source:"N3", target:"N2", layer:"drei", value:4, time:1, sourcetype:"c", targettype:"p"},
      //{source:"N1", target:"N3", layer:"vier", value:4, time:2, sourcetype:"c", targettype:"p"},
      //{source:"N4", target:"N3", layer:"vier", value:4, time:2, sourcetype:"p", targettype:"p"},
      //{source:"N2", target:"N3", layer:"vier", value:4, time:3, sourcetype:"c", targettype:"p"},
      //{source:"N2", target:"N1", layer:"zwei", value:4, time:3, sourcetype:"c", targettype:"c"},
      //{source:"N2", target:"N3", layer:"zwei", value:4, time:3, sourcetype:"c", targettype:"p"}
    ];
  }

  // Compute the distinct nodes and layers from the links.
  allgraphlinks = links;
  allgraphlinks.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    if (link.layer != undefined) { link.layer = layers[link.layer] || (layers[link.layer] = {name: link.layer})
    } else { link.layer = layers["defaultlayer"] || (layers["defaultlayer"] = {name: "defaultlayer"});
    }
    if (link.time != undefined) { link.time = times[link.time] || (times[link.time] = {name: link.time});
    } else { link.time = times["defaulttime"] || (times["defaulttime"] = {name: "defaulttime"});
    }
    //if columns are given, nodes are coloured; to prevent coloring comment out the following 6 lines
    if (link.sourcetype != undefined) { link.sourcetype = nodetypes[link.sourcetype] || (nodetypes[link.sourcetype] = {name: link.sourcetype});
    } else { link.sourcetype = nodetypes["defaulttype"] || (nodetypes["defaulttype"] = {name: "defaulttype"});
    }
    if (link.targettype != undefined) { link.targettype = nodetypes[link.targettype] || (nodetypes[link.targettype] = {name: link.targettype});
    } else { link.targettype = nodetypes["defaulttype"] || (nodetypes["defaulttype"] = {name: "defaulttype"});
    }
  });
  graphnodes = d3.values(nodes);
  graphnodes.forEach(function(d){ d.nodetype = {}; d.degree = {}; d.outdegree = {}; d.indegree = {}; })
  graphlayers = layers;
  graphtimes = times;
  nlayers = Object.keys(graphlayers).length;
  for (var i=0; i<nlayers-laymanual; i++){
    laycolor.push(threerand())
  }
  graphnodetypes = nodetypes;
  ntypes = Object.keys(graphnodetypes).length;
  for (var gnt of Object.keys(graphnodetypes)){
    nodelaycolor[gnt] = nodethreerand()
  }
  for(var i=0; i<Object.keys(nodelaycolor).length; i++){
    if (i<nodelaybaselinecolor.length){
      nodelaycolor[Object.keys(nodelaycolor)[i]] = nodelaybaselinecolor[i] 
    }
    if (i==0 && Object.keys(graphnodetypes).length==1){
      nodelaycolor[Object.keys(nodelaycolor)[i]] = "rgba(0,0,0," 
    }
  }

  graphlayers_without = Object.values(graphlayers)
    .filter(x => x.name != "defaultlayer")
    .map(x => x.name);
  graphnodetypes_without = Object.values(graphnodetypes)
    .filter(x => x.name != "defaulttype")
    .map(x => x.name);
  graphtimes_without = Object.values(graphtimes)
    .filter(x => x.name != "defaulttime")
    .map(x => x.name);

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
      .style("top", (lay*height/4.5).toString()+"px")
      .style("background-color", laycolor[lay]+layeropacity+")" )
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
      .data([Object.values(graphlayers_without)[lay]])
      .enter().append("text")
      .text(function(d){if(togglelayerlabels){return d;}})
      .attr("dx", function(d){if(d){return width-0.8*d.toString().length*fontsize;}})
      .attr("dy", fontsize)
      .style("font-size", fontsize+"px")
      .style("stroke", "#000000")
      .style("stroke-width", "0.1px")
      .style("fill", laycolor[lay]+"1.0)" )
  }

  // NODETYPELABEL LAYER
  var nodetypezaehler=0;
  svg_layer[0].selectAll(".nodetypelabel")
    .data(graphnodetypes_without)
    .enter().append("text")
    .text(function(d){if(togglenodelabels){return d;}})
    .attr("dx", function(d){return width*0.01;})
    .attr("dy", function(d){nodetypezaehler++; return fontsize*0.4*nodetypezaehler;})
    .style("font-size", fontsize*0.5+"px")
    .style("fill", function(d){return nodelaycolor[d]+"1.0)"})
    .style("opacity", nodelabelopacity)

  update();
});



function update() {
    // nodes are fix to allow for smooth visuals
    var graphlinks = allgraphlinks.filter( function(d) {return d.time.name == Object.keys(graphtimes)[timeCounter];} );

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

  // TIMELABEL LAYER
  console.log(graphtimes_without)
  tila = svg_layer[0].selectAll(".timelabel").data([graphtimes_without[timeCounter]])
  tila.exit().remove()
  tila.enter().append("text")
    .merge(tila)
    .attr("class", "timelabel")
    .text(function(d){ if(toggletimelabels){return "t: "+d;}})
    .attr("dx", function(d){return width*0.01;})
    .attr("dy", function(d){return height*0.98;})
    .style("font-size", fontsize*0.6+"px")
    .style("fill", function(d){return nodelaycolor[d]+"1.0)"})
    .style("opacity", timelabelopacity)


    for (lay=nlayers-1; lay>=0; lay--){

        var graphlinks_sublayer = graphlinks.filter( function(d){return d.layer.name == Object.keys(graphlayers)[lay];} );

        //calculate node statistics for circle size
        graphnodes.forEach(function(d) {
            outtot = 0;
            intot = 0;
            d.nodetype = "defaulttype" 
            d.nodetype = "defaulttype" 
            for(var i=0; i<graphlinks_sublayer.length; i++){
                if (d.name == graphlinks_sublayer[i].source.name){
                    outtot += 1 //(graphlinks_sublayer[i].value != 0 ? 1 : 0);
                    d.nodetype= graphlinks_sublayer[i].sourcetype
                }
                if (d.name == graphlinks_sublayer[i].target.name){
                    intot += 1 //(graphlinks_sublayer[i].value != 0 ? 1 : 0);
                    d.nodetype= graphlinks_sublayer[i].targettype
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
            .style("fill", laycolor[lay]+"1.0)" )
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
            .attr("dx", "-2px")
            .attr("dy", "4px")
            .text(function(d) { if(togglenodelabels){return d.name;} })
            .style("font-size", function(d){return rscal*Math.sqrt(d.degree[lay]) })
            .style("fill", function(d){return nodelaycolor[d.nodetype.name]+"1.0)"}) //"#000000"
            .style("stroke", function(d){return nodelaycolor[d.nodetype.name]+"1.0)"})//laycolor[lay]+layeropacity+")"
            .style("opacity", textopacity)
            .style("stroke-width", "0.75px"); //"4px"
         circle_layer[lay].append("svg:title")
             .text(function(d) { 
               if (d.nodetype.name == "defaulttype"){
                 return "Node: " + d.name;
               } else {
                 return "Node: " + d.name +"\nType:  " + d.nodetype.name;
               }
             });

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





      function bfs(start, maxpathlength) {
        var vertices = [];
        var edges = [];
        var cont = [];
        var distances = {};
        var prevvertices = [];
        var newvertices = [];
        cont.push(start.name)
        vertices.push(start.name);
        distances[start.name] = 0;

        while (cont.length > 0) {
          var vert = cont.shift()
          var vertnode = graphnodes.filter(u => u.name==vert)[0];
          var distprev = Math.max(...Object.values(distances))
          var nachbarn = [...new Set(
            [...new Set(vertnode.outneighbors), ...new Set(vertnode.inneighbors) ]
          )]

          nachbarn.forEach(function(x){
            if (!vertices.includes(x)) {
              distances[x] = distances[vert] + 1;
              cont.push(x);
            } 
          });

          if (Math.max(...Object.values(distances)) - distprev>0) {
            newvertices = vertices.filter(x=>!prevvertices.includes(x))
            var edges_oldtoold = graphlinks
              .filter( x => (prevvertices.includes(x.source.name) && !newvertices.includes(x.target.name))
                         || (prevvertices.includes(x.target.name) && !newvertices.includes(x.source.name)) )
              .map( x => [x.source.name, x.target.name] )
            var edges_oldtonew= graphlinks
              .filter( x => (prevvertices.includes(x.source.name ) && newvertices.includes(x.target.name))
                         || (prevvertices.includes(x.target.name ) && newvertices.includes(x.source.name)) )
              .map( x => [x.source.name, x.target.name] )
            edges = [...new Set(
              [...new Set(edges_oldtoold), ...new Set(edges_oldtonew)]
            )]
            prevvertices = vertices.map( x => x)
            if (distprev == maxpathlength) {
              return [vertices, edges]
            }
          }

          nachbarn.forEach(function(x){
            if (!vertices.includes(x)) { vertices.push(x); }
          });

        }

        if (maxpathlength == -1){
          edges = graphlinks
            .filter( x => (vertices.includes(x.source.name) && vertices.includes(x.target.name)) )
            .map( x => [x.source.name, x.target.name] )
        } else {
          newvertices = vertices.filter(x => !prevvertices.includes(x))
          var edges_oldtoold = graphlinks
            .filter( x => (prevvertices.includes(x.source.name) && !newvertices.includes(x.target.name))
              || (prevvertices.includes(x.target.name) && !newvertices.includes(x.source.name)) )
            .map( x => [x.source.name, x.target.name] )
          var edges_oldtonew= graphlinks
            .filter( x => (prevvertices.includes(x.source.name ) && newvertices.includes(x.target.name))
              || (prevvertices.includes(x.target.name ) && newvertices.includes(x.source.name)) )
            .map( x => [x.source.name, x.target.name] )
          edges = [...new Set(
            [...new Set(edges_oldtoold), ...new Set(edges_oldtonew)]
          )]
        }
        return [vertices, edges]
      }


      function outbfs(start, maxpathlength) {
        var vertices = [];
        var edges = [];
        var cont = [];
        var distances = {};
        var prevvertices = [];
        var newvertices = [];
        cont.push(start.name)
        vertices.push(start.name);
        distances[start.name] = 0;

        while (cont.length > 0) {
          var vert = cont.shift()
          var vertnode = graphnodes.filter(u => u.name==vert)[0];
          var distprev = Math.max(...Object.values(distances))

          vertnode.outneighbors.forEach(function(x){
            if (!vertices.includes(x)) {
              distances[x] = distances[vert] + 1;
              cont.push(x);
            } 
          });

          if (Math.max(...Object.values(distances)) - distprev>0) {
            newvertices = vertices.filter(x=>!prevvertices.includes(x))
            var edges_oldtoold = graphlinks
              .filter( x => prevvertices.includes(x.source.name)
                && !newvertices.includes(x.target.name) )
              .map( x => [x.source.name, x.target.name] )
            var edges_oldtonew= graphlinks
              .filter( x => prevvertices.includes(x.source.name )
                && newvertices.includes(x.target.name) )
              .map( x => [x.source.name, x.target.name] )
            edges = [...new Set(
              [...new Set(edges_oldtoold), ...new Set(edges_oldtonew)]
            )]
            prevvertices = vertices.map( x => x)
            if (distprev == maxpathlength) {
              return [vertices, edges]
            }
          }

          vertnode.outneighbors.forEach(function(x){
            if (!vertices.includes(x)) { vertices.push(x); }
          });
        }

        //only in mpl=-1 case: all edges visible;
        //otherwise withinlinks in last step are not displayed
        if (maxpathlength == -1){
          edges = graphlinks
            .filter( x => vertices.includes(x.source.name) )
            .map( x => [x.source.name, x.target.name] )
        } else {
          newvertices = vertices.filter(x => !prevvertices.includes(x))
          var edges_oldtoold = graphlinks
            .filter( x => prevvertices.includes(x.source.name)
              && !newvertices.includes(x.target.name) )
            .map( x => [x.source.name, x.target.name] )
          var edges_oldtonew = graphlinks
            .filter( x => prevvertices.includes(x.source.name)
              && newvertices.includes(x.target.name) )
            .map( x => [x.source.name, x.target.name] )
          edges = [...new Set(
            [...new Set(edges_oldtoold), ...new Set(edges_oldtonew)]
          )]
        }
        return [vertices, edges]
      }


      function inbfs(start, maxpathlength) {
        var vertices = [];
        var edges = [];
        var cont = [];
        var distances = {};
        var prevvertices = [];
        var newvertices = [];
        cont.push(start.name)
        vertices.push(start.name);
        distances[start.name] = 0;

        while (cont.length > 0) {
          var vert = cont.shift()
          var vertnode = graphnodes.filter(u => u.name==vert)[0];
          var distprev = Math.max(...Object.values(distances))

          vertnode.inneighbors.forEach(function(x){
            if (!vertices.includes(x)) {
              distances[x] = distances[vert] + 1;
              cont.push(x);
            } 
          });

          if (Math.max(...Object.values(distances)) - distprev>0) {
            newvertices = vertices.filter(x=>!prevvertices.includes(x))
            var edges_oldtoold = graphlinks
              .filter( x => prevvertices.includes(x.target.name)
                && !newvertices.includes(x.source.name) )
              .map( x => [x.source.name, x.target.name] )
            var edges_oldtonew= graphlinks
              .filter( x => prevvertices.includes(x.target.name )
                && newvertices.includes(x.source.name) )
              .map( x => [x.source.name, x.target.name] )
            edges = [...new Set(
              [...new Set(edges_oldtoold), ...new Set(edges_oldtonew)]
            )]
            prevvertices = vertices.map( x => x)
            if (distprev == maxpathlength) {
              return [vertices, edges]
            }
          }

          vertnode.inneighbors.forEach(function(x){
            if (!vertices.includes(x)) { vertices.push(x); }
          });
        }

        if (maxpathlength == -1){
          edges = graphlinks
            .filter( x => vertices.includes(x.target.name) )
            .map( x => [x.source.name, x.target.name] )
        } else {
          newvertices = vertices.filter(x => !prevvertices.includes(x))
          var edges_oldtoold = graphlinks
            .filter( x => prevvertices.includes(x.target.name)
              && !newvertices.includes(x.source.name) )
            .map( x => [x.source.name, x.target.name] )
          var edges_oldtonew = graphlinks
            .filter( x => prevvertices.includes(x.target.name)
              && newvertices.includes(x.source.name) )
            .map( x => [x.source.name, x.target.name] )
          edges = [...new Set(
            [...new Set(edges_oldtoold), ...new Set(edges_oldtonew)]
          )]
        }
        return [vertices, edges]
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
                //withinlinks prevents automatic closing of triangles 
                //in path calculations happening in the same step
                //otherwise falsely attributed final links in last
                //step of breadth-first algo each step.
                //withinlinks inactive for infinite path lengths
                withinlinks = [];
                reachednodes = [];
                reachedlinks = [];
                if (!d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey){
                    [reachednodes,reachedlinks] = outbfs(d, 1)
                } else if (d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey) {
                    [reachednodes,reachedlinks] = outbfs(d, -1)
                } else if (!d3.event.shiftKey && !d3.event.ctrlKey && d3.event.altKey) {
                    [reachednodes,reachedlinks] = inbfs(d, 1)
                } else if (d3.event.shiftKey && !d3.event.ctrlKey && d3.event.altKey) {
                    [reachednodes,reachedlinks] = inbfs(d, -1)
                } else if (!d3.event.shiftKey && !d3.event.ctrlKey && !d3.event.altKey) {
                    [reachednodes,reachedlinks] = bfs(d, 1)
                } else if (d3.event.shiftKey && !d3.event.ctrlKey && !d3.event.altKey) {
                    [reachednodes,reachedlinks] = bfs(d, -1)
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
                        text_layer[lay].style('opacity', function (o) {
                            const thisOpacity = reachednodes.includes(o.name) ? nodeopacity : opacity
                            this.setAttribute('opacity', thisOpacity);
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
                    [reachednodes,reachedlinks] = outbfs(d, mpl)
                } else if (d3.event.shiftKey && d3.event.ctrlKey && !d3.event.altKey) {
                    [reachednodes,reachedlinks] = outbfs(d, -1)
                } else if (!d3.event.shiftKey && !d3.event.ctrlKey && d3.event.altKey) {
                    [reachednodes,reachedlinks] = inbfs(d, mpl)
                } else if (d3.event.shiftKey && !d3.event.ctrlKey && d3.event.altKey) {
                    [reachednodes,reachedlinks] = inbfs(d, -1)
                } else if (!d3.event.shiftKey && !d3.event.ctrlKey && !d3.event.altKey) {
                    [reachednodes,reachedlinks] = bfs(d, mpl)
                } else if (d3.event.shiftKey && !d3.event.ctrlKey && !d3.event.altKey) {
                    [reachednodes,reachedlinks] = bfs(d, -1)
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
                    text_layer[lay].style('opacity', function (o) {
                        const thisOpacity = reachednodes.includes(o.name) ? nodeopacity : opacity
                        this.setAttribute('opacity', thisOpacity);
                        return thisOpacity;
                    });
                    dilink_layer[lay].style('opacity', function(o){ return (searchForArray(reachedlinks, [o.source.name, o.target.name])>=0 ? 1.0 : opacity)});

                }
            }
        }


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
                    text_layer[lay].style('opacity',textopacity)
                }
            };
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
