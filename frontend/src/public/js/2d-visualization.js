
function updateChart(chart, value){
    chart.data.datasets[0].data[0] = slider0.value
    chart.update();

}

function addDataPoints(chart, labels, dataPoints, indexOfDataSet) {
     chart.data.labels = []
    for (i = 0; i < dataPoints.length; i++){
        chart.data.labels.push(labels[i]);
        chart.data.datasets[indexOfDataSet].data.push(dataPoints[i])
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

function calcFuncValues(f, min, max, steps){
    let values = [];
    let labels = [];
    let x = min;
    let stepSize = math.abs(max-min)/steps
    for (let i = 0; i < steps; i++){
        values.push(f(x + i * stepSize));
        labels.push(i * stepSize)
    }

    let returnPair = [values,labels]
    return returnPair;
}

function createChart(ctx, chartTypeInString, functionLabel, borderColor, fillSetting){
    const chart = new Chart(ctx, {
        // The type of chart we want to create e.g line
        type: chartTypeInString,
    
        // The data for our dataset
        data: { 
            labels: [],
            datasets: [{
                label: functionLabel,
                data: [],
                // example of borderColor value: "rgba(75, 192, 192, 1)"
                borderColor: borderColor,
                fill: fillSetting
            }]
        },
    
        // Configuration options go here
        options: {
            response: true,
            maintainAspectRatio: true
        }
    });

    return chart
}

// creates data and labels based on function and desired range values
function createData(equation, min, max, steps){
    try{
         let f = math.evaluate('f(x) = ' + equation)
         let dataAndLabels = calcFuncValues(f, min, max, steps)
         return dataAndLabels

    }
    catch(err){
        throw "Invalid input"
    }
}


function createDataset(functionLabel, borderColor, fillSetting, data){
   let dataset = {
        label: functionLabel,
        data: data,
        // example of borderColor value: "rgba(75, 192, 192, 1)"
        borderColor: borderColor,
        fill: fillSetting
    }

    return dataset
}
    
function addDataset(chart, dataset){
    chart.data.datasets.push(dataset)
    chart.update();

}