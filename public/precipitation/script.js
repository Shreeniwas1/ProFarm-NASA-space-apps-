document.addEventListener("DOMContentLoaded", () => {
    const districtSelect = document.getElementById("districtSelect");
    const ctx = document.getElementById("rainfallChart").getContext("2d");
    
    // Initial chart setup
    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Actual Rainfall', 'Normal Rainfall'],
            datasets: [{
                label: 'Rainfall in mm',
                data: [0, 0],  // Default values
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Rainfall (mm)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Rainfall Type'
                    }
                }
            }
        }
    });

    // Fetch data from local JSON file
    fetch('data.json')  // Replace with the actual path to your data.json file
        .then(response => response.json())
        .then(data => {
            // Populate the dropdown with district names
            data.forEach(districtData => {
                if (districtData["STATE/DISTRICT (NAME)"]) {
                    const option = document.createElement("option");
                    option.value = districtData["STATE/DISTRICT (NAME)"];
                    option.textContent = districtData["STATE/DISTRICT (NAME)"];
                    districtSelect.appendChild(option);
                }
            });

            // Update chart when a district is selected
            districtSelect.addEventListener("change", (event) => {
                const selectedDistrict = event.target.value;
                const districtInfo = data.find(d => d["STATE/DISTRICT (NAME)"] === selectedDistrict);
                
                if (districtInfo) {
                    // Update the chart with selected district's data
                    chart.data.datasets[0].data = [
                        districtInfo["ACTUAL"], 
                        districtInfo["NORMAL"]
                    ];
                    chart.update();
                }
            });
        })
        .catch(error => console.error('Error loading the JSON file:', error));
});