function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const mainContent = document.getElementById('main-content');

    // Toggle the sidebar's visibility
    sidebar.classList.toggle('hidden');
    mainContent.classList.toggle('shifted');

    // Toggle the button arrow direction
    toggleBtn.classList.toggle('open');
}

// Function to display the selected crop information
function showCrop(cropName) {
    const crops = ['wheat', 'rice', 'millet'];

    crops.forEach(crop => {
        const cropInfo = document.getElementById(crop);
        if (crop === cropName) {
            cropInfo.style.display = 'block';
        } else {
            cropInfo.style.display = 'none';
        }
    });
}
