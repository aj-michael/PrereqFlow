//var linksUrl = 'http://ajmichael.net/prereqs/links';
var linksUrl = 'http://localhost:8000/links';
$.get(linksUrl, function(data, status) {
    
});

var prereq = "licensing",
    coreq = "suit",
    recommended = "resolved";
  
var links = [];

$.ajax({
    url: linksUrl,
    success: function(data) {
        $.each(data.split("\n"), function(index, value) {
            var edge = value.split(' ');
            if (edge[0] !== '') {
                links.push({source: edge[0], target: edge[1], type: prereq });
            }
        });    
    },
    async: false
});

var nodes = {};

links.forEach(function(link) {
   link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
   link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});


var svg, force, path, circle, text;

makeGraph();

$(window).resize(function() {
    makeGraph();
});


function makeGraph() {
    $('svg').remove();

    var width = $(window).width(),
        height = $(window).height();

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height*3/4])
        .linkDistance(50)
        .linkStrength(1.6)
        .charge(-450)
        .on("tick", tick)
        .start();

    svg = d3.select("body").append("svg");
        //.attr("width", width)
        //.attr("height", height);

    svg.append("defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
        .enter().append("marker")
        .attr("id", function(d) { return d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");
     
    path = svg.append("g").selectAll("path")
        .data(force.links())
      .enter().append("path")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

    circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
      .enter().append("circle")
        .attr("r", 6)
        .call(force.drag);

    text = svg.append("g").selectAll("text")
        .data(force.nodes())
        .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function(d) { return d.name; });
}

function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);
}

function linkArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}
