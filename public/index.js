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

    // You can add further form validation or processing logic here
    alert('Form submitted successfully!');

    // Reset the form after submission
    document.getElementById('farming-form').reset();
});