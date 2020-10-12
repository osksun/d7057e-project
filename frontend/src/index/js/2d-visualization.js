
function updateChart(chart, value){
    chart.data.datasets[0].data[0] = slider0.value
    chart.update();

}

function addLabels(chart, f, labels, indexOfDataSet) {
     chart.data.labels = [];
     if (chart.data.datasets.length > 0){
        for (i = 0; i < labels.length; i++){
            chart.config.data.labels.push(labels[i]);
            //chart.data.datasets[indexOfDataSet].data.push(dataPoints[i]);
        }
     }
     else{
        data = {
            label: f,
            data: [],
            borderColor: "rgba(75, 192, 192, 1)",
            fill: true
        }
        chart.data.datasets.push(data);
        for (i = 0; i < labels.length; i++){
            chart.data.labels.push(labels[i]);
            //chart.data.datasets[0].data.push(dataPoints[i])
        }

     }
    chart.update();

}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

// Used in createData to calculate datapoints and their respective labels
function calcFuncValues(f, labels){
    let values = [];
    let x;
    for (let i = 0; i < labels.length; i++){
        x = labels[i]
        values.push(f(x));
    }
    return values;
}

function createChart(ctx, chartTypeInString, borderColor, fillSetting){
    const chart = new Chart(ctx, {
        // The type of chart we want to create e.g line
        type: chartTypeInString,
    
        // The data for our dataset
        data: { 
            labels: [],
            datasets: []
        },
    
        // Configuration options go here
        options: {
            response: true,
            maintainAspectRatio: true
        }
    });

    return chart;
}

// creates values of the functions based on lables as input
function createData(equation ,labels){
    try{
         let f = math.evaluate('f(x) = ' + equation);
         let values = calcFuncValues(f, labels);
         return values;

    }
    catch(err){
        throw "Invalid input in createData";
    }
}


function createDataset(f, borderColor, fillSetting){
    let dataset = {
        label: f,
        data: [],
        // example of borderColor value: "rgba(75, 192, 192, 1)"
        borderColor: borderColor,
        fill: fillSetting
    }
    return dataset;
}
    
function addDataset(chart, dataset){
    chart.data.datasets.push(dataset);
    chart.update();

}

// Removes the dataset at the specified index
function removeDataset(chart, Index){
        if(typeof chart.data.datasets[Index] === 'undefined' ) {
            console.log("Dataset at the specified index does not exist");
        }
        else{
            chart.data.datasets.splice(Index, 1);
        }
    chart.update();
}

// User calls this function to add a new dataset to chart
function userAddDataset(chart, f){
    
     let testlabels = [0];
     let values = createData(f, testlabels)
     if (values.length === 0){
         console.log("Invalid user input");
     }
     else{   
         dataset = createDataset(f, "rgba(75, 192, 192, 1)", true);
         addDataset(chart, dataset);
         updateValues(chart);
         chart.update();
        }
}

// User calls this function to update the chart with new ranges
function userUpdateChartRange(chart, min, max, stepSize){
    let newLabels = [];
    if (parseFloat(min) <= parseFloat(max) && stepSize > 0){
        for (i = parseFloat(min); i <= max; i+=parseFloat(stepSize)){
            newLabels.push(i);
        }
        chart.data.labels = newLabels;
        updateValues(chart);
    }

    else{
        console.log("Invalid input in userUpdateChartRange");
    }
}
// Updates every dataset in chart with values from chart.data.labels
function updateValues(chart){
        // For every dataset
        for (let i = 0; i < chart.data.datasets.length; i++) {
            let fct = chart.data.datasets[i].label;
            let values = createData(fct,chart.data.labels);
            chart.data.datasets[i].data = values;
        }
        chart.update();

}

