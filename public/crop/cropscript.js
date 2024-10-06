function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    var toggleBtn = document.getElementById("toggleBtn");
    var mainContent = document.getElementById("main-content");

    if (sidebar.classList.contains("hidden")) {
        sidebar.classList.remove("hidden");
        toggleBtn.classList.add("open"); // Change button to indicate open state
        mainContent.classList.remove("shifted");
    } else {
        sidebar.classList.add("hidden");
        toggleBtn.classList.remove("open"); // Change button back to normal state
        mainContent.classList.add("shifted");
    }
}

function showCrop(cropId) {
    // Hide all crops
    document.querySelectorAll('.plant-info').forEach(function(plant) {
        plant.style.display = 'none';
    });

    // Show the selected crop
    document.getElementById(cropId).style.display = 'block';
}

// JavaScript to handle form submission
document.getElementById('farming-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page from refreshing

    const pincode = document.getElementById('pincode').value;
    const soiltype = document.getElementById('soiltype').value;
    const farmingtype = document.getElementById('farmingtype').value;

    // Log the form values to the console for now
    console.log('Pincode:', pincode);
    console.log('Soil Type:', soiltype);
    console.log('Farming Type:', farmingtype);
  
    // Further form validation or processing logic
    alert('Form submitted successfully!');

    // Reset the form after submission
    document.getElementById('farming-form').reset();
});
