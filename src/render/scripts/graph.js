(function() {
	$("body")
		.hide()
		.delay(1000)
		.fadeIn(500);
})();
$("img.lazy")
	.lazyload({
		effect: "fadeIn",
		container: $("#window-right")
	});
var nodes = [{
	id: "practice",
	group: 0,
	label: "RESEARCH",
	level: 1
}, {
	id: "maps",
	group: 0,
	label: "MAPS",
	level: 2
}, {
	id: "spaces",
	group: 0,
	label: "SPACES",
	level: 2
}, {
	id: "space",
	group: 0,
	label: "SPACE",
	level: 2
}, {
	id: "bio",
	group: 0,
	label: "SYNBIO",
	level: 2
}, {
	id: "mixed_reality",
	group: 0,
	label: "MIXED REALITY",
	level: 2
}, {
	id: "ai",
	group: 0,
	label: "AI",
	level: 2
}, {
	id: "oso",
	group: 1,
	label: "OSO",
	level: 3,
	url: "/projects/open-space-observatory"
}, {
	id: "proximity",
	group: 1,
	label: "PROXIMITY",
	level: 3,
	url: "/projects/proximity"
}, {
	id: "unmonastery",
	group: 1,
	label: "UNMONASTERY",
	level: 3,
	url: "/projects/unmonastery"
}, {
	id: "patternist",
	group: 1,
	label: "PATTERNIST",
	level: 3,
	url: "/projects/patternist"
}, {
	id: "forever_alpha",
	group: 1,
	label: "FOREVER ALPHA",
	level: 3,
	url: "/projects/forever-alpha"
}, {
	id: "transformap",
	group: 1,
	label: "TRANSFORMAP",
	level: 3,
	url: "http://transformap.co"
}, {
	id: "memory_palace",
	group: 1,
	label: "MEMORY PALACE",
	level: 3,
	url: "/projects/studio-practice"
}, {
	id: "second_foundation",
	group: 1,
	label: "SECOND FOUNDATION",
	level: 3,
	url: "/projects/studio-practice"
}]
var links = [{
		target: "practice",
		source: "spaces",
		strength: 0.7
  }, {
		target: "practice",
		source: "space",
		strength: 0.7
  }, {
		target: "practice",
		source: "mixed_reality",
		strength: 0.7
  }, {
		target: "practice",
		source: "bio",
		strength: 0.7
  }, {
		target: "practice",
		source: "ai",
		strength: 0.7
  }, {
		target: "practice",
		source: "maps",
		strength: 0.7
  }, {
		target: "maps",
		source: "transformap",
		strength: 0.7
  }, {
		target: "maps",
		source: "oso",
		strength: 0.5
  }, {
		target: "maps",
		source: "proximity",
		strength: 0.5
  }, {
		target: "maps",
		source: "patternist",
		strength: 0.3
  }, {
		target: "spaces",
		source: "unmonastery",
		strength: 0.7
  }, {
		target: "spaces",
		source: "forever_alpha",
		strength: 0.7
  }, {
		target: "spaces",
		source: "memory_palace",
		strength: 0.3
  }, {
		target: "spaces",
		source: "second_foundation",
		strength: 0.3
  }, {
		target: "space",
		source: "oso",
		strength: 0.7
  }, {
		target: "space",
		source: "proximity",
		strength: 0.5
  }, {
		target: "space",
		source: "patternist",
		strength: 0.3
  }, {
		target: "bio",
		source: "forever_alpha",
		strength: 0.7
  }, {
		target: "mixed_reality",
		source: "patternist",
		strength: 0.7
  }, {
		target: "mixed_reality",
		source: "memory_palace",
		strength: 0.7
  },
  // Alt links
	{
		target: "oso",
		source: "proximity",
		strength: 0.5
  }, {
		target: "unmonastery",
		source: "memory_palace",
		strength: 0.1
  }, {
		target: "ai",
		source: "patternist",
		strength: 0.2
  },
]

function getNeighbors(node) {
	return links.reduce(function(neighbors, link) {
		if (link.target.id === node.id) {
			neighbors.push(link.source.id)
		} else if (link.source.id === node.id) {
			neighbors.push(link.target.id)
		}
		return neighbors
	}, [node.id])
}

function isNeighborLink(node, link) {
	return link.target.id === node.id || link.source.id === node.id
}

function getNodeColor(node, neighbors) {
	if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
		return node.level === 1 ? 'blue' : 'blue'
	}
	return node.level === 1 ? 'red' : 'gray'
}

function getLinkColor(node, link) {
	return isNeighborLink(node, link) ? 'blue' : 'gray'
}

function getTextColor(node, neighbors) {
	return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'blue' : 'black'
}

function addTextClass(node, neighbors) {
	if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
		return 'project-label-show';
	}
}
var width;
var height = window.innerHeight
if (window.innerWidth < 768) {
	width = window.innerWidth
} else {
	width = window.innerWidth / 2
}
var svg = d3.select('svg')


svg.attr('width', width)
	.attr('height', height)

// simulation setup with all forces
var linkForce = d3.forceLink()
	.id(function(link) {
		return link.id 
	})
	.strength(function(link) {
		return link.strength 
	})
var simulation = d3.forceSimulation()
	.force('link', linkForce)
	.force('charge', d3.forceManyBody()
		.strength(-800))
	.force('center', d3.forceCenter(width / 2, height / 2))
var dragDrop = d3.drag()
	.on('start', function(node) {
		node.fx = node.x
		node.fy = node.y
	})
	.on('drag', function(node) {
		simulation.alphaTarget(0.7)
			.restart()
		node.fx = d3.event.x
		node.fy = d3.event.y
	})
	.on('end', function(node) {
		if (!d3.event.active) {
			simulation.alphaTarget(0)
		}
		node.fx = null
		node.fy = null
	})

function selectNode(selectedNode) {
	var neighbors = getNeighbors(selectedNode)
		// we modify the styles to highlight selected nodes
	nodeElements.attr('fill', function(node) {
		return getNodeColor(node, neighbors) 
	})
	textElements.attr('fill', function(node) {
		return getTextColor(node, neighbors)
	})
	textElements.attr('id', function(node) {
		return addTextClass(node, neighbors)
	})
	linkElements.attr('stroke', function(link) {
		return getLinkColor(selectedNode, link)
	})
}
var linkElements = svg.append("g")
	.attr("class", "links")
	.selectAll("line")
	.data(links)
	.enter()
	.append("line")
	.attr("stroke-width", 1)
	.attr("stroke", "rgba(50, 50, 50, 0.2)")

var nodeElements = svg.append("g")
	.attr("class", "nodes")
	.selectAll("circle")
	.data(nodes)
	.enter()
	.append("circle")
	.attr("r", 6)
	.attr("fill", getNodeColor)
	.call(dragDrop)
	.on('click', selectNode)

var textElements = svg.append("g")
	.attr("class", "texts")
	.selectAll("text")
	.data(nodes)
	.enter()
	.append("text")
	.text(function(node) {
		return node.label
	})
	.attr("class", function(node) {
		if (node.level === 3) {
			return "project-label-hide";
		}
	})
	.attr("font-size", 12)
	.attr("text-anchor", "middle")
	.attr("dx", 0)
	.attr("dy", -15)
	.on("click", function(node) {
		if (node.level === 3) {
			$(location)
				.attr('href', node.url);
			window.location = node.url;
		}
	})


simulation.nodes(nodes)
	.on('tick', () => {
		nodeElements.attr('cx', function(node) {
				return node.x
			})
			.attr('cy', function(node) {
				return node.y
			})
		textElements.attr('x', function(node) {
				return node.x
			})
			.attr('y', function(node) {
				return node.y
			})
		linkElements.attr('x1', function(link) {
				return link.source.x
			})
			.attr('y1', function(link) {
				return link.source.y
			})
			.attr('x2', function(link) {
				return link.target.x
			})
			.attr('y2', function(link) {
				return link.target.y
			})
	})
simulation.force("link")
	.links(links)