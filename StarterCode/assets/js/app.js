// define the dimension of the svg area
var svgWidth = 900;
var svgHeight = 500;

//Define the chart's margins
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Define the chart area dimensions
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// selecting the hmtl id and append the svg to it, give it dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height", svgHeight);

// creating a variable for our chart. appending "g" groups svgs shapes so they can be transformed and manipulated
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// get the csv data
d3.csv("assets/data/data.csv").then(function(healthData) {
    // console.log(healthData)
    healthData.forEach(function(data) {
        // data.state = +data.abbr;
        data.poverty = +data.poverty;
        // data.healthcare = +data.healthcare;
        // data.age = +data.age;
        // data.income = +data.income;
        // data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    //set the range and scale for the x axis
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, data => data.poverty) - 1, d3.max(healthData, data => data.poverty)])
        .range([0,width]);
    
    // set the range and scale for the y axis
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, data => data.healthcare)])
        .range([height, 0]);

    // create a function that will pass in the axis scale as an argument
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append an svg group element to our chartGroup variable from before and call our axis funtion inside it.
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // append circles to our circles group
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 18)
        .attr("fill", "pink")
        .attr("opacity", ".5");

  
        
    // set up the tooltip abd set it to be called by click

    // old code

        // add the mouseover tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);

        });
    
        chartGroup.call(toolTip);

        circlesGroup.on("click", function(data) {
            toolTip.show(data, this);
        })

        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
      //set up labels in circles

      circlesGroup
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty) -8)
        .attr("y", d => yLinearScale(d.healthcare) +5)
        .attr("font-size", "10px")
        .attr("fill", "black");

    //   console.log(healthData);
    //   var textLabelGroup = circlesGroup.selectAll("text")
    //   .data(healthData)
    //   .enter()
    //   .append("text")
    //   .attr("font-size", "10px")
    //   .attr("fill", "black")
    //   .attr("x", d=> xLinearScale(d.poverty) -8)
    //   .attr("y", d => yLinearScale(d.healthcare) +5)
    //   .text(d => d.abbr);

    // Append axes titles
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 1.3))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% of Population without Healthcare");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("% of Population in Poverty");

});

 