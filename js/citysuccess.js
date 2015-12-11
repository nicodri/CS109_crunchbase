// d3.tip
// Copyright (c) 2013 Justin Palmer
//
// Tooltips for d3.js SVG visualizations

// Public - contructs a new tooltip
//
// Returns a tip
d3.tip = function() {
  var direction = d3_tip_direction,
      offset    = d3_tip_offset,
      html      = d3_tip_html,
      node      = initNode(),
      svg       = null,
      point     = null,
      target    = null

  function tip(vis) {
    svg = getSVGNode(vis)
    point = svg.createSVGPoint()
    document.body.appendChild(node)
  }

  // Public - show the tooltip on the screen
  //
  // Returns a tip
  tip.show = function() {
    var args = Array.prototype.slice.call(arguments)
    if(args[args.length - 1] instanceof SVGElement) target = args.pop()

    var content = html.apply(this, args),
        poffset = offset.apply(this, args),
        dir     = direction.apply(this, args),
        nodel   = d3.select(node), i = 0,
        coords

    nodel.html(content)
      .style({ opacity: 1, 'pointer-events': 'all' })

    while(i--) nodel.classed(directions[i], false)
    coords = direction_callbacks.get(dir).apply(this)
    nodel.classed(dir, true).style({
      top: (coords.top +  poffset[0]) + 'px',
      left: (coords.left + poffset[1]) + 'px'
    })

    return tip
  }

  // Public - hide the tooltip
  //
  // Returns a tip
  tip.hide = function() {
    nodel = d3.select(node)
    nodel.style({ opacity: 0, 'pointer-events': 'none' })
    return tip
  }

  // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
  //
  // n - name of the attribute
  // v - value of the attribute
  //
  // Returns tip or attribute value
  tip.attr = function(n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return d3.select(node).attr(n)
    } else {
      var args =  Array.prototype.slice.call(arguments)
      d3.selection.prototype.attr.apply(d3.select(node), args)
    }

    return tip
  }

  // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
  //
  // n - name of the property
  // v - value of the property
  //
  // Returns tip or style property value
  tip.style = function(n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return d3.select(node).style(n)
    } else {
      var args =  Array.prototype.slice.call(arguments)
      d3.selection.prototype.style.apply(d3.select(node), args)
    }

    return tip
  }

  // Public: Set or get the direction of the tooltip
  //
  // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
  //     sw(southwest), ne(northeast) or se(southeast)
  //
  // Returns tip or direction
  tip.direction = function(v) {
    if (!arguments.length) return direction
    direction = v == null ? v : d3.functor(v)

    return tip
  }

  // Public: Sets or gets the offset of the tip
  //
  // v - Array of [x, y] offset
  //
  // Returns offset or
  tip.offset = function(v) {
    if (!arguments.length) return offset
    offset = v == null ? v : d3.functor(v)

    return tip
  }

  // Public: sets or gets the html value of the tooltip
  //
  // v - String value of the tip
  //
  // Returns html value or tip
  tip.html = function(v) {
    if (!arguments.length) return html
    html = v == null ? v : d3.functor(v)

    return tip
  }

  function d3_tip_direction() { return 'n' }
  function d3_tip_offset() { return [0, 0] }
  function d3_tip_html() { return ' ' }

  var direction_callbacks = d3.map({
    n:  direction_n,
    s:  direction_s,
    e:  direction_e,
    w:  direction_w,
    nw: direction_nw,
    ne: direction_ne,
    sw: direction_sw,
    se: direction_se
  }),

  directions = direction_callbacks.keys()

  function direction_n() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.n.y - node.offsetHeight,
      left: bbox.n.x - node.offsetWidth / 2
    }
  }

  function direction_s() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.s.y,
      left: bbox.s.x - node.offsetWidth / 2
    }
  }

  function direction_e() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.e.y - node.offsetHeight / 2,
      left: bbox.e.x
    }
  }

  function direction_w() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.w.y - node.offsetHeight / 2,
      left: bbox.w.x - node.offsetWidth
    }
  }

  function direction_nw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.nw.y - node.offsetHeight,
      left: bbox.nw.x - node.offsetWidth
    }
  }

  function direction_ne() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.ne.y - node.offsetHeight,
      left: bbox.ne.x
    }
  }

  function direction_sw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.sw.y,
      left: bbox.sw.x - node.offsetWidth
    }
  }

  function direction_se() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.se.y,
      left: bbox.e.x
    }
  }

  function initNode() {
    var node = d3.select(document.createElement('div'))
    node.style({
      position: 'absolute',
      opacity: 0,
      pointerEvents: 'none',
      boxSizing: 'border-box'
    })

    return node.node()
  }

  function getSVGNode(el) {
    el = el.node()
    if(el.tagName.toLowerCase() == 'svg')
      return el

    return el.ownerSVGElement
  }

  // Private - gets the screen coordinates of a shape
  //
  // Given a shape on the screen, will return an SVGPoint for the directions
  // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
  // sw(southwest).
  //
  //    +-+-+
  //    |   |
  //    +   +
  //    |   |
  //    +-+-+
  //
  // Returns an Object {n, s, e, w, nw, sw, ne, se}
  function getScreenBBox() {
    var targetel   = target || d3.event.target,
        bbox       = {},
        matrix     = targetel.getScreenCTM(),
        tbbox      = targetel.getBBox(),
        width      = tbbox.width,
        height     = tbbox.height,
        x          = tbbox.x,
        y          = tbbox.y,
        scrollTop  = document.documentElement.scrollTop || document.body.scrollTop,
        scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft


    point.x = x + scrollLeft
    point.y = y + scrollTop
    bbox.nw = point.matrixTransform(matrix)
    point.x += width
    bbox.ne = point.matrixTransform(matrix)
    point.y += height
    bbox.se = point.matrixTransform(matrix)
    point.x -= width
    bbox.sw = point.matrixTransform(matrix)
    point.y -= height / 2
    bbox.w  = point.matrixTransform(matrix)
    point.x += width
    bbox.e = point.matrixTransform(matrix)
    point.x -= width / 2
    point.y -= height / 2
    bbox.n = point.matrixTransform(matrix)
    point.y += height
    bbox.s = point.matrixTransform(matrix)

    return bbox
  }

  return tip
};





// City Success Rates

 var margins = {
    top: 12,
    left: 200,
    right: 24,
    bottom: 24
},
legendPanel = {
    width: 180
},
width = 1000 - margins.left - margins.right - legendPanel.width,
    height = 500 - margins.top - margins.bottom,
    dataset = [{
        data: [{city: "New York", count: "179", success: "179", failure: "234", rate: "0.433414043584"},
{city: "San Francisco", count: "184", success: "184", failure: "211", rate: "0.46582278481"},
{city: "London", count: "101", success: "101", failure: "183", rate: "0.355633802817"},
{city: "Austin", count: "42", success: "42", failure: "65", rate: "0.392523364486"},
{city: "Seattle", count: "48", success: "48", failure: "55", rate: "0.466019417476"},
{city: "Paris", count: "20", success: "20", failure: "79", rate: "0.20202020202"},
{city: "Los Angeles", count: "37", success: "37", failure: "61", rate: "0.377551020408"},
{city: "Palo Alto", count: "39", success: "39", failure: "59", rate: "0.397959183673"},
{city: "San Diego", count: "44", success: "44", failure: "51", rate: "0.463157894737"},
{city: "Chicago", count: "38", success: "38", failure: "53", rate: "0.417582417582"},
{city: "Boston", count: "36", success: "36", failure: "51", rate: "0.413793103448"},
{city: "Cambridge", count: "38", success: "38", failure: "41", rate: "0.481012658228"},
{city: "Beijing", count: "28", success: "28", failure: "47", rate: "0.373333333333"},
{city: "Mountain View", count: "40", success: "40", failure: "34", rate: "0.540540540541"},
{city: "Singapore", count: "27", success: "27", failure: "43", rate: "0.385714285714"},
{city: "San Jose", count: "33", success: "33", failure: "37", rate: "0.471428571429"},
{city: "Santa Clara", count: "41", success: "41", failure: "26", rate: "0.611940298507"},
{city: "Sunnyvale", count: "30", success: "30", failure: "34", rate: "0.46875"},
{city: "Redwood City", count: "28", success: "28", failure: "31", rate: "0.474576271186"},
{city: "Bangalore", count: "12", success: "12", failure: "47", rate: "0.203389830508"},
{city: "Shanghai", count: "24", success: "24", failure: "34", rate: "0.413793103448"},
{city: "Berlin", count: "18", success: "18", failure: "38", rate: "0.321428571429"},
{city: "San Mateo", count: "28", success: "28", failure: "27", rate: "0.509090909091"},
{city: "Toronto", count: "28", success: "28", failure: "26", rate: "0.518518518519"},
{city: "Dublin", count: "12", success: "12", failure: "42", rate: "0.222222222222"},
{city: "Tel Aviv", count: "15", success: "15", failure: "39", rate: "0.277777777778"},
{city: "Atlanta", count: "15", success: "15", failure: "35", rate: "0.3"},
{city: "Tokyo", count: "18", success: "18", failure: "32", rate: "0.36"},
{city: "Denver", count: "18", success: "18", failure: "27", rate: "0.4"},
{city: "Barcelona", count: "14", success: "14", failure: "31", rate: "0.311111111111"}],
        name: 'Successes'
    }, {
        data: [{city: "New York", count: "234", success: "179", failure: "234", rate: "0.433414043584"},
{city: "San Francisco", count: "211", success: "184", failure: "211", rate: "0.46582278481"},
{city: "London", count: "183", success: "101", failure: "183", rate: "0.355633802817"},
{city: "Austin", count: "65", success: "42", failure: "65", rate: "0.392523364486"},
{city: "Seattle", count: "55", success: "48", failure: "55", rate: "0.466019417476"},
{city: "Paris", count: "79", success: "20", failure: "79", rate: "0.20202020202"},
{city: "Los Angeles", count: "61", success: "37", failure: "61", rate: "0.377551020408"},
{city: "Palo Alto", count: "59", success: "39", failure: "59", rate: "0.397959183673"},
{city: "San Diego", count: "51", success: "44", failure: "51", rate: "0.463157894737"},
{city: "Chicago", count: "53", success: "38", failure: "53", rate: "0.417582417582"},
{city: "Boston", count: "51", success: "36", failure: "51", rate: "0.413793103448"},
{city: "Cambridge", count: "41", success: "38", failure: "41", rate: "0.481012658228"},
{city: "Beijing", count: "47", success: "28", failure: "47", rate: "0.373333333333"},
{city: "Mountain View", count: "34", success: "40", failure: "34", rate: "0.540540540541"},
{city: "Singapore", count: "43", success: "27", failure: "43", rate: "0.385714285714"},
{city: "San Jose", count: "37", success: "33", failure: "37", rate: "0.471428571429"},
{city: "Santa Clara", count: "26", success: "41", failure: "26", rate: "0.611940298507"},
{city: "Sunnyvale", count: "34", success: "30", failure: "34", rate: "0.46875"},
{city: "Redwood City", count: "31", success: "28", failure: "31", rate: "0.474576271186"},
{city: "Bangalore", count: "47", success: "12", failure: "47", rate: "0.203389830508"},
{city: "Shanghai", count: "34", success: "24", failure: "34", rate: "0.413793103448"},
{city: "Berlin", count: "38", success: "18", failure: "38", rate: "0.321428571429"},
{city: "San Mateo", count: "27", success: "28", failure: "27", rate: "0.509090909091"},
{city: "Toronto", count: "26", success: "28", failure: "26", rate: "0.518518518519"},
{city: "Dublin", count: "42", success: "12", failure: "42", rate: "0.222222222222"},
{city: "Tel Aviv", count: "39", success: "15", failure: "39", rate: "0.277777777778"},
{city: "Atlanta", count: "35", success: "15", failure: "35", rate: "0.3"},
{city: "Tokyo", count: "32", success: "18", failure: "32", rate: "0.36"},
{city: "Denver", count: "27", success: "18", failure: "27", rate: "0.4"},
{city: "Barcelona", count: "31", success: "14", failure: "31", rate: "0.311111111111"}],
        name: 'Failures'
    }

    ],
    series = dataset.map(function (d) {
        return d.name;
    }),
    dataset = dataset.map(function (d) {
        return d.data.map(function (o, i) {
            // Structure it so that your numeric
            // axis (the stacked amount) is y
            return {
                city: o.city,
                y: o.count,
                x: o.city,
                suc: o.success,
                fail: o.failure,
                rate: o.rate
            };
        });
    }),
    stack = d3.layout.stack();

stack(dataset);

var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return '<strong style="font-size:24;color:#8debff">' + d.city + "</strong><br />Successes: " + d.suc + "<br />Failures: " + d.fail + "<br /> Rate: " + parseFloat(d.rate * 100).toFixed(1) + "%";
      })

var dataset = dataset.map(function (group) {
    return group.map(function (d) {
        // Invert the x and y values, and y0 becomes x0
        return {
            city: d.city,
            x: d.y,
            y: d.x,
            x0: d.y0,
            suc: d.suc,
            fail: d.fail,
            rate: d.rate
        };
    });
}),
    svg = d3.select('#citysuccessrates')
        .append('svg')
        .attr('width', width + margins.left + margins.right + legendPanel.width)
        .attr('height', height + margins.top + margins.bottom)
        .append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')'),
    xMax = d3.max(dataset, function (group) {
        return d3.max(group, function (d) {
            return d.x + d.x0;
        });
    }),
    xMax = 450,
    xScale = d3.scale.linear()
        .domain([0, xMax])
        .range([0, width]),
    months = dataset[0].map(function (d) {
        return d.y;
    }),
    yScale = d3.scale.ordinal()
        .domain(months)
        .rangeRoundBands([0, height], .1),
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom'),
    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left'),
    colours = ["#4bbf60", "#d92b2b"],
    groups = svg.selectAll('g')
        .data(dataset)
        .enter()
        .append('g')
        .style('fill', function (d, i) {
        return colours[i];
    }),
    rects = groups.selectAll('rect')
        .data(function (d) {
        return d;
    })
        .enter()
        .append('rect')
        .attr('x', function (d) {
        return xScale(d.x0);
    })
        .attr('y', function (d, i) {
        return yScale(d.y);
    })
        .attr('height', function (d) {
        return yScale.rangeBand();
    })
        .attr('width', function (d) {
        return xScale(d.x);
    })
    .on('mouseover', tip.show)
      .on('mouseout', tip.hide)    

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

svg.append('g')
    .attr('class', 'axis')
    .call(yAxis);

svg.append('rect')
    .attr('fill', 'white')
    .attr('width', 160)
    .attr('height', 30 * dataset.length)
    .attr('x', width - 100 + margins.left)
    .attr('y', 0);

    svg.call(tip);
        
series.forEach(function (s, i) {
    svg.append('text')
        .attr('fill', 'black')
        .attr('x', width -100+ margins.left + 8)
        .attr('y', i * 24 + 24)
        .text(s);
    svg.append('rect')
        .attr('fill', colours[i])
        .attr('width', 60)
        .attr('height', 20)
        .attr('x', width -100+ margins.left + 90)
        .attr('y', i * 24 + 6);
});