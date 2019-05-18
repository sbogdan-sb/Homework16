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
var dollarSign = "";
var percentSign = "%";

function getXscale(data, axis){
  var xExtent = d3.extent(data, d => +d[selectedXaxis]);

  var xScale = d3.scaleLinear()
    .domain([xExtent[0] * .95, xExtent[1] * 1.05])
    .range([0, chartWidth]);

  return xScale;
}

function getYscale(data, axis){
  var yExtent = d3.extent(data, d => +d[selectedYaxis]);

  var yScale = d3.scaleLinear()
    .domain([yExtent[0] * .90, yExtent[1] * 1.1])
    .range([chartHeight, 0]);

  return yScale;
}

function updateXaxis(xScale, x_axis) {
  var newAxis = d3.axisBottom().scale(xScale);

  x_axis.transition()
    .duration(2000)
    .call(newAxis);

  return;
}


function updateYaxis(yScale, y_axis) {
  var newyAxis = d3.axisLeft().scale(yScale);

  y_axis.transition()
    .duration(2000)
    .call(newyAxis);

  return;
}

function updateCircles(data, circlesGroup, textGroup, tip, xScale, 
    yScale, selectedXaxis, selectedYaxis) {

  if(selectedXaxis == "poverty") {
    dollarSign = "";
    percentSign = "%";
  } else if(selectedXaxis == "age") {
    dollarSign = "";
    percentSign = "";
  } else {
    dollarSign = "$";
    percentSign = "";
  }

  textGroup.transition()
    .duration(2000)
    .attr("x", data => xScale(data[selectedXaxis]))
    .attr("y", data => yScale(data[selectedYaxis]));

  
  circlesGroup.transition()
    .duration(2000)
    .attr("cx", data => xScale(data[selectedXaxis]))
    .attr("cy", data => yScale(data[selectedYaxis]));
  
  return;
}

d3.csv('../data/data.csv', data => {

  var xScale = getXscale(data, selectedXaxis);
  var yScale = getYscale(data, selectedYaxis);
  

  var tip = d3.select('#scatter')
    .append('div')
    .attr('class', 'd3-tip')
    .style('position', 'absolute')
    .style('display', 'none')
    .on('mouseover', d => {
      tip.transition().duration(0);
    })
    .on('mouseout', d => {
      tip.style('display', 'none');
    });

  var circlesGroup = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d[selectedXaxis]))
  .attr("cy", d => yScale(d[selectedYaxis]))
  .attr("r", "15")
  .attr("fill", "slateblue")
  .attr("opacity", ".7")
  .on('mouseover', d => {
    tip.transition().duration(0);
    tip.style('top', yScale(d[selectedYaxis]) - 40 + 'px');
    tip.style('left', xScale(d[selectedXaxis]) + 'px');
    tip.style('display', 'block')
    .html(`${d.state} <br> 
      ${selectedXaxis}: ${dollarSign}${d[selectedXaxis]}${percentSign} <br> 
      ${selectedYaxis}: ${d[selectedYaxis]}%`);
  })
  .on('mouseout', d => {
    tip.transition()
    .delay(500)
    .style('display', 'none');
  });

  var textGroup = chartGroup.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .attr("x", d => xScale(d[selectedXaxis]))
  .attr("y", d => yScale(d[selectedYaxis]))
  .style("text-anchor", "middle")
  .style("font", "14px times")
  .style("fill", "white")
  .attr("dy", ".4em")
  .text(d => d.abbr);

  var bottomAxis = d3.axisBottom().scale(xScale);
  var leftAxis = d3.axisLeft().scale(yScale);

  var x_axis = chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  var y_axis = chartGroup.append("g")
    .call(leftAxis);

  
  // Set up axes lable groups and configure/add labels
  var xLabels = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var yLabels = chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight / 2})`);

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
    .attr("value", "healthcare")
    .classed("inactive", true)
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -95)
    .attr("text-anchor", "middle")
    .text("Lacks Healthcare(%)")


  xLabels.selectAll("text")
    .on("click", function () {
      // get value of selection
      var axisValue = d3.select(this).attr("value");
      if (axisValue != selectedXaxis) {

        // replaces chosenXaxis with value
        selectedXaxis = axisValue;

        xScale = getXscale(data, selectedXaxis);
        // x_axis = updateXaxis(xScale, x_axis)
        updateXaxis(xScale, x_axis);

        updateCircles(data, circlesGroup, textGroup, tip, xScale, 
          yScale, selectedXaxis, selectedYaxis);
        
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

        yScale = getYscale(data, selectedYaxis)
        updateYaxis(yScale, y_axis)

        updateCircles(data, circlesGroup, textGroup, tip, xScale, 
          yScale, selectedXaxis, selectedYaxis);

        
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




