// app.js

// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Default to world view

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Variable to hold the marker
let marker;

// Function to handle map clicks
function onMapClick(e) {
    const { lat, lng } = e.latlng;

    // If marker already exists, update its position
    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        // Create a new marker
        marker = L.marker(e.latlng, { draggable: true }).addTo(map);

        // Update hidden input fields when marker is dragged
        marker.on('dragend', function(event) {
            const position = event.target.getLatLng();
            document.getElementById('latitude').value = position.lat;
            document.getElementById('longitude').value = position.lng;
        });
    }

    // Update hidden input fields
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
}

// Add click event listener to the map
map.on('click', onMapClick);

// Handle "Use Current Location" button click
document.getElementById('useCurrentLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13); // Zoom in to current location

            if (marker) {
                marker.setLatLng([latitude, longitude]);
            } else {
                marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);

                // Update hidden input fields when marker is dragged
                marker.on('dragend', function(event) {
                    const pos = event.target.getLatLng();
                    document.getElementById('latitude').value = pos.lat;
                    document.getElementById('longitude').value = pos.lng;
                });
            }

            // Update hidden input fields
            document.getElementById('latitude').value = latitude;
            document.getElementById('longitude').value = longitude;
        }, function(error) {
            alert('Error retrieving your location. Please select location manually.');
            console.error(error);
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Handle form submission
document.getElementById('predictionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Gather form data
    const cropType = document.getElementById('cropType').value;
    const soilQuality = document.getElementById('soilQuality').value;
    const fertilizerUsage = document.getElementById('fertilizerUsage').value;
    const temperature = document.getElementById('temperature').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    // Basic validation
    if (!cropType || !soilQuality || !fertilizerUsage || !temperature || !latitude || !longitude) {
        alert('Please fill in all required fields.');
        return;
    }

    // Example: Display the collected data (Replace with actual prediction logic)
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Prediction Result</h2>
        <p><strong>Crop Type:</strong> ${cropType}</p>
        <p><strong>Soil Quality:</strong> ${soilQuality}</p>
        <p><strong>Fertilizer Usage:</strong> ${fertilizerUsage} kg/ha</p>
        <p><strong>Temperature:</strong> ${temperature} °C</p>
        <p><strong>Location:</strong> Latitude ${latitude}, Longitude ${longitude}</p>
        <!-- Add your prediction result here -->
    `;

    // Optional: You can integrate with your Weather API and prediction backend here
});
