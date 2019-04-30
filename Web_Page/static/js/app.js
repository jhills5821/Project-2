function init() {
  // Grab a reference to the dropdown select element
  var propSelector = d3.select("#selProp");

  // Use the list of sample names to populate the select options
  d3.json("/properties").then((prop) => {
    prop.forEach((group) => {
      propSelector
        .append("option")
        .text(group)
        .property("value", group);
    });
  });
  
  var compSelector = d3.select("#selComp");

  // Use the list of sample names to populate the select options
  d3.json("/composition").then((comp) => {
    comp.forEach((elem) => {
      compSelector
        .append("option")
        .text(elem)
        .property("value", elem);
    });
  });

  // Use the first sample from the list to build the initial plots
  buildBubble("Mechanical Properties");
  buildChord();
  buildBar();
  
}

function buildChord() {
  
  var url = `/chord-data`
  d3.json(url).then(function(data) {
    
    var chordData= JSON.parse("[" + data.data + "]");
    console.log(chordData)

    var svg = d3.select("#pie")
      .append("svg")
        .attr("width", 500)
        .attr("height", 500)
      .append("g")
        .attr("transform", "translate(250,250)");

    // create a matrix
    var matrix = chordData

    var colors = [ "#440154ff", "#31668dff", "#37b578ff", "#fde725ff","#440154ff", "#31668dff", "#37b578ff", "#fde725ff","#440154ff", "#31668dff", "#37b578ff", "#fde725ff"]

    var names = data.labels

    // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
    var res = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
        (matrix)

    // add the groups on the inner part of the circle
    svg
      .datum(res)
      .append("g")
      .selectAll("g")
      .data(function(d) { return d.groups; })
      .enter()
      .append("g")
      .append("path")
        .style("fill", "grey")
        .style("stroke", "black")
        .attr("d", d3.arc()
          .innerRadius(230)
          .outerRadius(240)
        )

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3.select("#pie")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var showTooltip = function(d) {
      tooltip
        .style("opacity", 1)
        .html("Source: " + names[d.source.index] + "<br>Target: " + names[d.target.index])
        .style("left", (d3.event.pageX - 400) + "px")
        .style("top", (d3.event.pageY - 250) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(1000)
        .style("opacity", 0)
    }

    // Add the links between groups
    svg
      .datum(res)
      .append("g")
      .selectAll("path")
      .data(function(d) { return d; })
      .enter()
      .append("path")
        .attr("d", d3.ribbon()
          .radius(220)
        )
        .style("fill", "#69b3a2")
        .style("stroke", "black")
      .on("mouseover", showTooltip )
      .on("mouseleave", hideTooltip )
  })
}

function buildBar() {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/bar-data`
  d3.json(url).then(function(data) {

    var values = data.values
    var parsedValues = JSON.parse("[" + values + "]");
    var label = data.labels

    console.log(parsedValues)
    console.log(label)

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: label.split(','),
          datasets: [{
              data: parsedValues,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }],
      },
      options: {
        legend: { display: false},
        title: {
         display: true,
         text: "Number of Articles Published per Institution"
        },
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
        }
      }
    });
  })
}

function buildBubble(prop) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/bubble-data/${prop}`
  d3.json(url).then(function(data) {
    
    var ids = data.year;
    var labels = data.title;
    var values = data.citations;

    // @TODO: Build a Bubble Chart using the sample data
    let bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: 'markers',
        marker: {
          color: values,
          colorscale: 'Portland'
        }
      }
    ]

    let bubbleLayout = {
      xaxis: {title: "Citations by Year"}
    }
      
    Plotly.plot("bubble", bubbleData, bubbleLayout);
  })
}



function PropOptionChanged(prop) {
  // Fetch new data each time a new sample is selected
  buildBubble(prop);
}

// Initialize the dashboard
init()

