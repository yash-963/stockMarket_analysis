const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'];

// variables 
let currentStock = "";
let profitStatus = "";

// fetch elements
const stockList = document.querySelector("#stockList");
const detailSection = document.querySelector(".detailSection");




// inital calling
fetchApis()
initalDataShow('AAPL')
loadChart('AAPL', '5y', 'green')




// functions
async function fetchApis() {
    const response = await fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata');
    const data = await response.json()
    fetchStockList(data)
}
function fetchStockList(data) {
    for (let i of stocks) {
        for (let j of data.stocksStatsData) {
            addStocksInList(i, j[i])
        }
    }
}
function addStocksInList(i, j) {
    const parentDiv = document.createElement("div");
    const button = document.createElement("button");
    button.className = "stocksListButton mt-2";
    button.textContent = i
    button.addEventListener("click", () => {
        renderStockData(i, j)
    })
    const span1 = document.createElement("span");
    span1.textContent = `$${j.bookValue}`;
    let profit = j.profit.toFixed(2)
    const span2 = document.createElement("span");
    span2.textContent = `${profit}%`;
    if (j.profit > 0) {
        span2.className = "profit green"
    }
    else {
        span2.className = "profit red"
    }
    parentDiv.append(button, span1, span2)
    stockList.append(parentDiv)
}


function renderStockData(i, j) {
    currentStock = i
    fetchSummary(i, j);
    if (j.profit > 0) {
        profitStatus = "green";
        loadChart(i, "5y", "green")

    }
    else {
        profitStatus = "red";
        loadChart(i, "5y", "red")

    }
}
async function fetchSummary(i, j) {
    const response = await fetch('https://stocks3.onrender.com/api/stocks/getstocksprofiledata');
    const data = await response.json();
    renderSummary(data, i, j)
}
function renderSummary(data, i, j) {
    for (let k of data.stocksProfileData) {
        let summary = k[i].summary
        renderSummaryInDiv(i, j, summary)
    }
}
function renderSummaryInDiv(i, j, sum) {
    detailSection.textContent = ""
    const name = document.createElement("h3")
    let profit = j.profit.toFixed(5)
    if (j.profit > 0) {
        name.innerHTML = `${i} <span class="value">$${j.bookValue}</span> <span class="profit green">${profit}%</span>`
    }
    else {
        name.innerHTML = `${i} <span class="value">$${j.bookValue}</span> <span class="profit red">${profit}%</span>`
    }
    const summary = document.createElement("p");
    summary.className = "fontChange"
    summary.textContent = sum;
    detailSection.append(name, summary)
}

async function initalDataShow(stock) {
    const response = await fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata');
    const data = await response.json();
    let t;
    for (let p of data.stocksStatsData) {
        t = p[stock]
    }
    renderStockData(stock, t)
}
async function loadChart(company, time, color) {
    const response = await fetch('https://stocks3.onrender.com/api/stocks/getstocksdata');
    const data = await response.json()
    let finalDAta = data.stocksData[0][company][time]
    plotChart(finalDAta, color)
}

function plotChart(data, color) {
    const timeStamps = data.timeStamp.map((ele) => {
        new_timestamp = new Date(ele * 1000).toLocaleDateString()
        return new_timestamp
    })
    const values = data.value.map((ele) => {
        return ele
    })

    // Creating trace for stock price
    const trace = {
        x: timeStamps,
        y: values,
        type: 'scatter',
        mode: 'lines',
        name: 'AAPL Stock Price',
        marker: {
            color: color
        }
    };
    layout = {
        plot_bgcolor: "blue",
        paper_bgcolor: "transparent",
        yaxis: {
            fixedrange: true,
            // showticklabels: false,
            // visible: false,
            // showgrid: true
        },
        xaxis: {
            fixedrange: true,
            showticklabels: false,
            visible: false,
            showgrid: true
        }

    }
    // Plotting the chart
    Plotly.newPlot('chart', [trace], layout, { displayModeBar: false }, { modeBarButtonsToRemove: ['toImage'] });
}

$('.buttons').click(function () {
    value = $(this).val();
    loadChart(currentStock, value, profitStatus)
});
