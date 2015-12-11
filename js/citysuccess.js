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
        data: [{city: "Software", count: "347", success: "347", failure: "782"},
{city: "Biotechnology", count: "245", success: "245", failure: "406"},
{city: "Mobile", count: "179", success: "179", failure: "362"},
{city: "Curated Web", count: "113", success: "113", failure: "278"},
{city: "E-Commerce", count: "104", success: "104", failure: "271"},
{city: "Enterprise Software", count: "148", success: "148", failure: "206"},
{city: "Advertising", count: "114", success: "114", failure: "229"},
{city: "Games", count: "74", success: "74", failure: "215"},
{city: "Health Care", count: "129", success: "129", failure: "147"},
{city: "Social Media", count: "70", success: "70", failure: "174"},
{city: "Hardware + Software", count: "81", success: "81", failure: "152"},
{city: "Finance", count: "72", success: "72", failure: "145"},
{city: "Clean Technology", count: "73", success: "73", failure: "143"},
{city: "Analytics", count: "88", success: "88", failure: "94"},
{city: "Health and Wellness", count: "45", success: "45", failure: "126"},
{city: "Manufacturing", count: "38", success: "38", failure: "128"},
{city: "SaaS", count: "69", success: "69", failure: "95"},
{city: "Internet", count: "40", success: "40", failure: "122"},
{city: "Education", count: "32", success: "32", failure: "125"},
{city: "Security", count: "72", success: "72", failure: "81"},
{city: "Technology", count: "52", success: "52", failure: "96"},
{city: "Video", count: "45", success: "45", failure: "88"},
{city: "Web Hosting", count: "56", success: "56", failure: "69"},
{city: "Networking", count: "35", success: "35", failure: "86"},
{city: "Consulting", count: "12", success: "12", failure: "102"},
{city: "Semiconductors", count: "56", success: "56", failure: "57"},
{city: "Sales and Marketing", count: "37", success: "37", failure: "68"},
{city: "Search", count: "26", success: "26", failure: "73"},
{city: "News", count: "26", success: "26", failure: "66"},
{city: "Medical", count: "20", success: "20", failure: "70"}],
        name: 'Successes'
    }, {
        data: [{city: "Software", count: "782", success: "347", failure: "782"},
{city: "Biotechnology", count: "406", success: "245", failure: "406"},
{city: "Mobile", count: "362", success: "179", failure: "362"},
{city: "Curated Web", count: "278", success: "113", failure: "278"},
{city: "E-Commerce", count: "271", success: "104", failure: "271"},
{city: "Enterprise Software", count: "206", success: "148", failure: "206"},
{city: "Advertising", count: "229", success: "114", failure: "229"},
{city: "Games", count: "215", success: "74", failure: "215"},
{city: "Health Care", count: "147", success: "129", failure: "147"},
{city: "Social Media", count: "174", success: "70", failure: "174"},
{city: "Hardware + Software", count: "152", success: "81", failure: "152"},
{city: "Finance", count: "145", success: "72", failure: "145"},
{city: "Clean Technology", count: "143", success: "73", failure: "143"},
{city: "Analytics", count: "94", success: "88", failure: "94"},
{city: "Health and Wellness", count: "126", success: "45", failure: "126"},
{city: "Manufacturing", count: "128", success: "38", failure: "128"},
{city: "SaaS", count: "95", success: "69", failure: "95"},
{city: "Internet", count: "122", success: "40", failure: "122"},
{city: "Education", count: "125", success: "32", failure: "125"},
{city: "Security", count: "81", success: "72", failure: "81"},
{city: "Technology", count: "96", success: "52", failure: "96"},
{city: "Video", count: "88", success: "45", failure: "88"},
{city: "Web Hosting", count: "69", success: "56", failure: "69"},
{city: "Networking", count: "86", success: "35", failure: "86"},
{city: "Consulting", count: "102", success: "12", failure: "102"},
{city: "Semiconductors", count: "57", success: "56", failure: "57"},
{city: "Sales and Marketing", count: "68", success: "37", failure: "68"},
{city: "Search", count: "73", success: "26", failure: "73"},
{city: "News", count: "66", success: "26", failure: "66"},
{city: "Medical", count: "70", success: "20", failure: "70"}],
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
                y: o.count,
                x: o.city,
                suc: o.suc,
                fail: o.fail
            };
        });
    }),
    stack = d3.layout.stack();

stack(dataset);

var dataset = dataset.map(function (group) {
    return group.map(function (d) {
        // Invert the x and y values, and y0 becomes x0
        return {
            x: d.y,
            y: d.x,
            x0: d.y0
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
        .on('mouseover', function (d) {
        var xPos = parseFloat(d3.select(this).attr('x')) / 2 + width / 2;
        var yPos = parseFloat(d3.select(this).attr('y'));

        d3.select('#tooltip')
            .style('left', xPos + 'px')
            .style('top', yPos + 'px')
            .select('#value')
            .text("Successes: " + d.suc + " Failures: " + d.fail);

        d3.select('#tooltip').classed('hidden', false);
    })
        .on('mouseout', function () {
        d3.select('#tooltip').classed('hidden', true);
    })

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