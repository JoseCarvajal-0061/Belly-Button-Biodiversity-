function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = "/metadata/sample";
    d3.json(url).then(function(sample) {
      
      var metadata_panel = d3.select("#sample-metadata"); 
    // Use `.html("") to clear any existing metadata

      metadata_panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(sample).forEach(([key, value]) => {

        metadata_panel.append("p").text(`${key}: ${value}`);
      
      });
  })
}

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/$<sample>").then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    
    let trace = {
      x: data.otu.ids,
      y: data.sample_values,
      mode = "markers",
      text = data.otu.labels,
      
      marker = {
        color: data.otu_ids,
        size: data.sample_values
      },

    } 

    let layout = {
      title: "Sample Volume and Spread",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Samples"},
    };

    Plotly.newPlot('bubble', trace, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    let trace1 = {
      values: data.sample_values.slice(0, 10), 
      labels: data.otu_ids.slice(0, 10),
      type: "pie",
      hovertext: data.otu.labels.slice(0, 10),
    }

    let layout1 = { 
      title: "Top 1o OTU Microbiomes" 
    }; 

    Plotly.newPlot('pie', trace1, layout1);


  });

    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
