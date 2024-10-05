// main.js

// Replace with your actual API keys
const WEATHER_API_KEY = 'fc7951e5122227005304d82601ae9798';
const MARKET_PRICE_API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

// Default Farm Location Coordinates (example: Los Angeles)
let FARM_LATITUDE = 34.0522;
let FARM_LONGITUDE = -118.2437;

// Initialize Charts
let cropYieldsChart;
let soilMoistureChart;

// Function to initialize the dashboard
function initDashboard() {
    loadSavedLocation();
    fetchCropYields();
    fetchSoilMoisture();
    fetchWeatherData();
    fetchMarketPrices();
    updateLastUpdated();
    // Set interval for real-time updates (e.g., every 5 minutes)
    setInterval(() => {
        fetchCropYields();
        fetchSoilMoisture();
        fetchWeatherData();
        fetchMarketPrices();
        updateLastUpdated();
    }, 300000); // 300,000 ms = 5 minutes

    // Handle location form submission
    document.getElementById('locationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        setLocation();
    });
}

// Load saved location from localStorage or use default
function loadSavedLocation() {
    const savedLocation = JSON.parse(localStorage.getItem('farmLocation'));
    if (savedLocation) {
        FARM_LATITUDE = savedLocation.latitude;
        FARM_LONGITUDE = savedLocation.longitude;
        document.getElementById('currentLocation').innerHTML = `<strong>Location:</strong> ${savedLocation.city || `Lat: ${FARM_LATITUDE}, Lon: ${FARM_LONGITUDE}`}`;
    } else {
        document.getElementById('currentLocation').innerHTML = `<strong>Location:</strong> Default (Los Angeles)`;
    }
}

// Set location based on user input
function setLocation() {
    const city = document.getElementById('cityInput').value.trim();
    const latitude = parseFloat(document.getElementById('latitudeInput').value);
    const longitude = parseFloat(document.getElementById('longitudeInput').value);
    const locationError = document.getElementById('locationError');

    if (city) {
        // Fetch coordinates based on city name using OpenWeatherMap Geocoding API
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${WEATHER_API_KEY}`;
        fetch(geocodeURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Geocoding API response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    throw new Error('City not found');
                }
                FARM_LATITUDE = data[0].lat;
                FARM_LONGITUDE = data[0].lon;
                const selectedCity = data[0].name + (data[0].state ? `, ${data[0].state}` : '') + `, ${data[0].country}`;
                // Save to localStorage
                localStorage.setItem('farmLocation', JSON.stringify({ city: selectedCity, latitude: FARM_LATITUDE, longitude: FARM_LONGITUDE }));
                // Update current location display
                document.getElementById('currentLocation').innerHTML = `<strong>Location:</strong> ${selectedCity}`;
                // Refresh data
                refreshDashboard();
                // Close modal
                const locationModal = bootstrap.Modal.getInstance(document.getElementById('locationModal'));
                locationModal.hide();
            })
            .catch(error => {
                console.error('Error setting location by city:', error);
                locationError.textContent = 'Invalid city name. Please try again.';
            });
    } else if (!isNaN(latitude) && !isNaN(longitude)) {
        // Validate latitude and longitude ranges
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            locationError.textContent = 'Latitude must be between -90 and 90 and Longitude between -180 and 180.';
            return;
        }
        // Save to localStorage
        localStorage.setItem('farmLocation', JSON.stringify({ latitude: latitude, longitude: longitude }));
        // Update current location display
        document.getElementById('currentLocation').innerHTML = `<strong>Location:</strong> Lat: ${latitude}, Lon: ${longitude}`;
        // Update global variables
        FARM_LATITUDE = latitude;
        FARM_LONGITUDE = longitude;
        // Refresh data
        refreshDashboard();
        // Close modal
        const locationModal = bootstrap.Modal.getInstance(document.getElementById('locationModal'));
        locationModal.hide();
    } else {
        // Invalid input
        locationError.textContent = 'Please enter a valid city name or both latitude and longitude.';
    }
}

// Refresh all data
function refreshDashboard() {
    fetchCropYields();
    fetchSoilMoisture();
    fetchWeatherData();
    fetchMarketPrices();
    updateLastUpdated();
}

// Fetch Crop Yields Data (Mock Data or Replace with Actual API)
function fetchCropYields() {
    // Example mock data
    const cropData = {
        labels: ['Wheat', 'Corn', 'Soybean', 'Rice', 'Barley'],
        data: [1500, 2300, 1800, 1200, 900]
    };

    if (cropYieldsChart) {
        cropYieldsChart.data.datasets[0].data = cropData.data;
        cropYieldsChart.update();
    } else {
        const ctx = document.getElementById('cropYieldsChart').getContext('2d');
        cropYieldsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cropData.labels,
                datasets: [{
                    label: 'Yield (kg)',
                    data: cropData.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
                    hoverBorderColor: 'rgba(54, 162, 235, 1)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} kg`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' kg';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Fetch Soil Moisture Data (Mock Data or Replace with Actual API)
function fetchSoilMoisture() {
    // Example mock data
    const moistureData = {
        labels: ['Field A', 'Field B', 'Field C', 'Field D'],
        data: [30, 45, 25, 60]
    };

    if (soilMoistureChart) {
        soilMoistureChart.data.datasets[0].data = moistureData.data;
        soilMoistureChart.update();
    } else {
        const ctx = document.getElementById('soilMoistureChart').getContext('2d');
        soilMoistureChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: moistureData.labels,
                datasets: [{
                    label: 'Soil Moisture (%)',
                    data: moistureData.data,
                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.r}%`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        angleLines: { 
                            display: true 
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20,
                            color: '#212529' // Direct color value instead of CSS variable
                        },
                        pointLabels: {
                            font: {
                                size: 14
                            },
                            color: '#212529' // Direct color value instead of CSS variable
                        }
                    }
                }
            }
        });
    }
}

// Fetch Weather Data from OpenWeatherMap API
function fetchWeatherData() {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${FARM_LATITUDE}&lon=${FARM_LONGITUDE}&units=metric&appid=${WEATHER_API_KEY}`;

    fetch(weatherURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather API response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const weatherInfo = `
                <div class="d-flex align-items-center">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon" class="me-3" width="60">
                    <div>
                        <strong>Location:</strong> ${data.name}<br>
                        <strong>Temperature:</strong> ${data.main.temp} °C<br>
                        <strong>Humidity:</strong> ${data.main.humidity}%<br>
                        <strong>Condition:</strong> ${data.weather[0].description}
                    </div>
                </div>
            `;
            document.getElementById('weatherInfo').innerHTML = weatherInfo;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weatherInfo').innerHTML = `
                <div class="text-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>Error loading weather data.
                </div>
            `;
        });
}

// Fetch Market Prices Data from Market Price API
function fetchMarketPrices() {
    // Example API endpoint (Replace with actual API)
    const marketPriceURL = `https://api.marketprices.com/v1/prices?apiKey=${MARKET_PRICE_API_KEY}`;

    fetch(marketPriceURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Market Price API response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('marketPricesTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear existing data

            if (data.prices && data.prices.length > 0) {
                data.prices.forEach(item => {
                    const row = tableBody.insertRow();
                    row.innerHTML = `
                        <td>${item.crop}</td>
                        <td>$${item.pricePerKg} / kg</td>
                    `;
                });
            } else {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="2" class="text-center">No data available.</td>
                    </tr>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching market prices:', error);
            const tableBody = document.getElementById('marketPricesTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>Error loading market prices.
                    </td>
                </tr>
            `;
        });
}

// Update Last Updated Timestamp
function updateLastUpdated() {
    const now = new Date();
    const formattedTime = now.toLocaleString();
    document.getElementById('lastUpdated').textContent = formattedTime;
}

// Initialize the dashboard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initDashboard);
