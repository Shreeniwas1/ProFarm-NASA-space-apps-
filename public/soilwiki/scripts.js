

// Search Functionality
function searchSoilTypes() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const soilCards = document.querySelectorAll('.soil-card');

    soilCards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        if (title.includes(filter)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter Functionality
function filterSoilTypes() {
    const drainage = document.getElementById('drainageFilter').value;
    const fertility = document.getElementById('fertilityFilter').value;
    const ph = document.getElementById('phFilter').value;

    const soilCards = document.querySelectorAll('.soil-card');

    soilCards.forEach(card => {
        const cardDrainage = card.getAttribute('data-drainage');
        const cardFertility = card.getAttribute('data-fertility');
        const cardPh = card.getAttribute('data-ph');

        let display = true;

        if (drainage && cardDrainage !== drainage) {
            display = false;
        }

        if (fertility && cardFertility !== fertility) {
            display = false;
        }

        if (ph && cardPh !== ph) {
            display = false;
        }

        card.style.display = display ? 'block' : 'none';
    });
}

// Modal Functionality
function openModal(soilType) {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    // Example descriptions; ideally, retrieve dynamically or have a data structure
    const descriptions = {
        'Clay Soil': 'Clay soil is composed of very fine particles and is known for its excellent water retention capabilities. It is fertile but can be heavy and may require proper aeration.',
        'Sandy Soil': 'Sandy soil has larger particles, allowing for good drainage. However, it does not retain nutrients well and may require regular fertilization.',
        'Silt Soil': 'Silt soil is fertile with good water retention. It is smooth and can be easily cultivated but may be prone to erosion.',
        'Loam Soil': 'Loam soil is a balanced mixture of sand, silt, and clay. It offers optimal drainage, nutrient retention, and aeration, making it ideal for most plants.',
        'Peaty Soil': 'Peaty soil is rich in organic material and has a high acidic content. It retains moisture well and is suitable for acid-loving plants.'
    };

    modalTitle.textContent = soilType;
    modalDescription.textContent = descriptions[soilType] || 'Detailed information not available.';

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('infoModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
