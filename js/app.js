var svgWidth = 1000;
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

var selectedXaxis = "poverty";
var selectedYaxis = "obesity";

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
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var yLabels = chartGroup.append("g")
    .attr("transform", `translate(${0}, ${chartHeight / 2})`);

  var povertyLabel = xLabels.append("text")
    .attr("value", "poverty")
    .classed("active", true)
    .attr("x", 0)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text("Poverty Rate (%)")

  var ageLabel = xLabels.append("text")
    .attr("value", "age")
    .classed("inactive", true)
    .attr("x", 0)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .text("Age (median)")

  var incomeLabel = xLabels.append("text")
    .attr("value", "income")
    .classed("inactive", true)
    .attr("x", 0)
    .attr("y", 90)
    .attr("text-anchor", "middle")
    .text("Household Income (median)")

  var obesityLabel = yLabels.append("text")
    .attr("value", "obesity")
    .classed("active", true)
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .text("Obesity Rate (%)")

  var smokesLabel = yLabels.append("text")
    .attr("value", "smokes")
    .classed("inactive", true)
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -65)
    .attr("text-anchor", "middle")
    .text("Smokes (%)")

  var insuranceLabel = yLabels.append("text")
    .attr("value", "insurance")
    .classed("inactive", true)
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -95)
    .attr("text-anchor", "middle")
    .text("Lacks Health Ins(%)")


  xLabels.selectAll("text")
    .on("click", function () {
      // get value of selection
      var axisValue = d3.select(this).attr("value");
      if (axisValue != selectedXaxis) {

        // replaces chosenXaxis with value
        selectedXaxis = axisValue;
        console.log(selectedXaxis);

        // functions here found above csv import
        // updates x scale for new data
        // xLinearScale = xScale(hairData, chosenXAxis);

        // // updates x axis with transition
        // xAxis = renderAxes(xLinearScale, xAxis);

        // // updates circles with new x values
        // circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (selectedXaxis == "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (selectedXaxis == "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  yLabels.selectAll("text")
    .on("click", function () {
      // get value of selection
      var axisValue = d3.select(this).attr("value");
      if (axisValue != selectedYaxis) {

        // replaces chosenXaxis with value
        selectedYaxis = axisValue;
        console.log(selectedYaxis);

        // functions here found above csv import
        // updates x scale for new data
        // xLinearScale = xScale(hairData, chosenXAxis);

        // // updates x axis with transition
        // xAxis = renderAxes(xLinearScale, xAxis);

        // // updates circles with new x values
        // circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (selectedYaxis == "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          insuranceLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (selectedYaxis == "smokes") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          insuranceLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          insuranceLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });



});




