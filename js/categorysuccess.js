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





// Category Success Rates

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
        data: [{cat: "Software", count: "347", success: "347", failure: "782", rate: "0.307351638618"},
{cat: "Biotechnology", count: "245", success: "245", failure: "406", rate: "0.376344086022"},
{cat: "Mobile", count: "179", success: "179", failure: "362", rate: "0.330868761553"},
{cat: "Curated Web", count: "113", success: "113", failure: "278", rate: "0.289002557545"},
{cat: "E-Commerce", count: "104", success: "104", failure: "271", rate: "0.277333333333"},
{cat: "Enterprise Software", count: "148", success: "148", failure: "206", rate: "0.418079096045"},
{cat: "Advertising", count: "114", success: "114", failure: "229", rate: "0.332361516035"},
{cat: "Games", count: "74", success: "74", failure: "215", rate: "0.256055363322"},
{cat: "Health Care", count: "129", success: "129", failure: "147", rate: "0.467391304348"},
{cat: "Social Media", count: "70", success: "70", failure: "174", rate: "0.286885245902"},
{cat: "Hardware + Software", count: "81", success: "81", failure: "152", rate: "0.347639484979"},
{cat: "Finance", count: "72", success: "72", failure: "145", rate: "0.331797235023"},
{cat: "Clean Technology", count: "73", success: "73", failure: "143", rate: "0.337962962963"},
{cat: "Analytics", count: "88", success: "88", failure: "94", rate: "0.483516483516"},
{cat: "Health and Wellness", count: "45", success: "45", failure: "126", rate: "0.263157894737"},
{cat: "Manufacturing", count: "38", success: "38", failure: "128", rate: "0.228915662651"},
{cat: "SaaS", count: "69", success: "69", failure: "95", rate: "0.420731707317"},
{cat: "Internet", count: "40", success: "40", failure: "122", rate: "0.246913580247"},
{cat: "Education", count: "32", success: "32", failure: "125", rate: "0.203821656051"},
{cat: "Security", count: "72", success: "72", failure: "81", rate: "0.470588235294"},
{cat: "Technology", count: "52", success: "52", failure: "96", rate: "0.351351351351"},
{cat: "Video", count: "45", success: "45", failure: "88", rate: "0.338345864662"},
{cat: "Web Hosting", count: "56", success: "56", failure: "69", rate: "0.448"},
{cat: "Networking", count: "35", success: "35", failure: "86", rate: "0.289256198347"},
{cat: "Consulting", count: "12", success: "12", failure: "102", rate: "0.105263157895"},
{cat: "Semiconductors", count: "56", success: "56", failure: "57", rate: "0.495575221239"},
{cat: "Sales and Marketing", count: "37", success: "37", failure: "68", rate: "0.352380952381"},
{cat: "Search", count: "26", success: "26", failure: "73", rate: "0.262626262626"},
{cat: "News", count: "26", success: "26", failure: "66", rate: "0.282608695652"},
{cat: "Medical", count: "20", success: "20", failure: "70", rate: "0.222222222222"}],
        name: 'Successes'
    }, {
        data: [{cat: "Software", count: "782", success: "347", failure: "782", rate: "0.307351638618"},
{cat: "Biotechnology", count: "406", success: "245", failure: "406", rate: "0.376344086022"},
{cat: "Mobile", count: "362", success: "179", failure: "362", rate: "0.330868761553"},
{cat: "Curated Web", count: "278", success: "113", failure: "278", rate: "0.289002557545"},
{cat: "E-Commerce", count: "271", success: "104", failure: "271", rate: "0.277333333333"},
{cat: "Enterprise Software", count: "206", success: "148", failure: "206", rate: "0.418079096045"},
{cat: "Advertising", count: "229", success: "114", failure: "229", rate: "0.332361516035"},
{cat: "Games", count: "215", success: "74", failure: "215", rate: "0.256055363322"},
{cat: "Health Care", count: "147", success: "129", failure: "147", rate: "0.467391304348"},
{cat: "Social Media", count: "174", success: "70", failure: "174", rate: "0.286885245902"},
{cat: "Hardware + Software", count: "152", success: "81", failure: "152", rate: "0.347639484979"},
{cat: "Finance", count: "145", success: "72", failure: "145", rate: "0.331797235023"},
{cat: "Clean Technology", count: "143", success: "73", failure: "143", rate: "0.337962962963"},
{cat: "Analytics", count: "94", success: "88", failure: "94", rate: "0.483516483516"},
{cat: "Health and Wellness", count: "126", success: "45", failure: "126", rate: "0.263157894737"},
{cat: "Manufacturing", count: "128", success: "38", failure: "128", rate: "0.228915662651"},
{cat: "SaaS", count: "95", success: "69", failure: "95", rate: "0.420731707317"},
{cat: "Internet", count: "122", success: "40", failure: "122", rate: "0.246913580247"},
{cat: "Education", count: "125", success: "32", failure: "125", rate: "0.203821656051"},
{cat: "Security", count: "81", success: "72", failure: "81", rate: "0.470588235294"},
{cat: "Technology", count: "96", success: "52", failure: "96", rate: "0.351351351351"},
{cat: "Video", count: "88", success: "45", failure: "88", rate: "0.338345864662"},
{cat: "Web Hosting", count: "69", success: "56", failure: "69", rate: "0.448"},
{cat: "Networking", count: "86", success: "35", failure: "86", rate: "0.289256198347"},
{cat: "Consulting", count: "102", success: "12", failure: "102", rate: "0.105263157895"},
{cat: "Semiconductors", count: "57", success: "56", failure: "57", rate: "0.495575221239"},
{cat: "Sales and Marketing", count: "68", success: "37", failure: "68", rate: "0.352380952381"},
{cat: "Search", count: "73", success: "26", failure: "73", rate: "0.262626262626"},
{cat: "News", count: "66", success: "26", failure: "66", rate: "0.282608695652"},
{cat: "Medical", count: "70", success: "20", failure: "70", rate: "0.222222222222"}],
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
                cat: o.cat,
                y: o.count,
                x: o.cat,
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
        return "<strong>" + d.cat + "</strong><br />Successes: " + d.suc + "<br />Failures: " + d.fail + "<br /> Rate: " + parseFloat(d.rate * 100).toFixed(1) + "%";

        //return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
      })

var dataset = dataset.map(function (group) {
    return group.map(function (d) {
        // Invert the x and y values, and y0 becomes x0
        return {
            cat: d.cat,
            x: d.y,
            y: d.x,
            x0: d.y0,
            suc: d.suc,
            fail: d.fail,
            rate: d.rate
        };
    });
}),
    svg = d3.select('#categorysuccessrates')
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
    xMax = 1200,
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