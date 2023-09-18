
function createLineChart(years, principal, finalAmount, rate, monthlyContribution, swipeAmount, swipeCount) {
    const ctx = document.getElementById('line-chart').getContext('2d');

    const chartData = {
        labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i}`), 
        datasets: [
            {
                label: 'Principal',
                data: Array.from({ length: years + 1 }, () => principal.toFixed(2)), 
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false,
            },
            {
                label: 'Calculated Amount',
                data: Array.from({ length: years + 1 }, (_, i) => i === 0 ? principal.toFixed(2) : (principal * Math.pow(1 + rate, i)).toFixed(2)), 
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
            {
                label: 'Calculated Amount (With Monthly Contribution and Swipes)',
                data: Array.from({ length: years + 1 }, (_, i) => {
                    if (i === 0) {
                        return 0;
                    } else {
                        let monthlyToYear = (monthlyContribution + (swipeAmount * swipeCount * 4)); 
                        let total = principal;
                        
                        
                        for (let year = 1; year <= i; year++) {
                            total += monthlyToYear; 
                            total += (total * rate); 
                        }
                        
                        return total.toFixed(2);
                    }
                }),
                borderColor: 'rgba(0, 128, 0, 1)',
                backgroundColor: 'rgba(0, 128, 0, 0.2)',
                fill: true,
            },
        ],
    };

    const maxYValue = Math.max(finalAmount, principal * (1 + rate) * 1.1);

    const yTickStep = maxYValue / 10; 

    const yTicks = Array.from({ length: 11 }, (_, i) => i * yTickStep);
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Year',
  
                },
                ticks: {
                    color: 'white', 
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Amount',

                    
                },
                ticks: {
                    beginAtZero: true,
                    max: maxYValue,
                    stepSize: yTickStep,
                    callback: (value) => value.toFixed(2),
                    color: 'white', // Change the Y-axis ticks text color to white
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white', // Change the legend text color to white
                },
            },
        },
    };
    

    if (window.myLineChart) {
        window.myLineChart.destroy();
    }

    window.myLineChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions,
    });
}

// The calculate function for the compound interest calculator
function calculate() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const years = parseInt(document.getElementById('years').value);
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribute').value);
    const swipeAmount = parseFloat(document.getElementById('swipe-amount').value);
    const swipeCount = parseFloat(document.getElementById('swipe-count').value);

    const compoundInterest = (principal * Math.pow(1 + rate, years)).toFixed(2);

    // Create the line chart with the rate
    createLineChart(years, principal, compoundInterest, rate, monthlyContribution, swipeAmount, swipeCount);
}
