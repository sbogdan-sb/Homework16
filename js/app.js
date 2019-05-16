var svgWidth = 1000 ;
var svgHeight = 700;

var chartMargin = {
    top: 20,
    right: 20,
    bottom: 120,
    left: 120
  };

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv('../data/data.csv', data => {
 
  var xExtent = d3.extent(data, d => +d.poverty);
  var yExtent = d3.extent(data, d => +d.obesity);

  var xScale = d3.scaleLinear()
  .domain([xExtent[0] * .95, xExtent[1] * 1.05])
  .range([0, chartWidth]);

  var yScale = d3.scaleLinear()
  .domain([yExtent[0] * .95, yExtent[1] * 1.05])
  .range([chartHeight, 0]);

  var circlesGroup = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.poverty))
  .attr("cy", d => yScale(d.obesity))
  .attr("r", "15")
  .attr("fill", "red");

  var textGroup = chartGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.obesity))
    .style("text-anchor", "middle")
    .style("font", "14px times")
    .attr("dy", ".4em")
    .text(d => d.abbr);

  var x_axis = d3.axisBottom().scale(xScale);
  var y_axis = d3.axisLeft().scale(yScale);

  chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`)
    .call(x_axis);

  chartGroup.append("g").attr("transform", `translate(0, 0)`)
    .call(y_axis);


  // Set up axes lable groups and configure/add labels
  var xLabels = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`);

  var yLabels = chartGroup.append("g")
    .attr("transform", `translate(${0}, ${chartHeight/2})`);

  var povertyLabel = xLabels.append("text")
    .attr("value", "poverty")
    .attr("class", "active")
    .attr("x", 0)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text("Poverty Rate (%)")

  var povertyLabel = xLabels.append("text")
    .attr("value", "age")
    .attr("class", "inactive")
    .attr("x", 0)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .text("Age (median)")

  var povertyLabel = xLabels.append("text")
    .attr("value", "age")
    .attr("class", "inactive")
    .attr("x", 0)
    .attr("y", 90)
    .attr("text-anchor", "middle")
    .text("Household Income (median)")

  var obesityLabel = yLabels.append("text")
    .attr("value", "obesity")
    .attr("class", "active")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .text("Obesity Rate (%)")

  var smokesLabel = yLabels.append("text")
    .attr("value", "smokes")
    .attr("class", "inactive")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -65)
    .attr("text-anchor", "middle")
    .text("Smokes (%)")

  var insuranceLabel = yLabels.append("text")
    .attr("value", "insurance")
    .attr("class", "inactive")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -95)
    .attr("text-anchor", "middle")
    .text("Lacks Health Ins(%)")

  });




