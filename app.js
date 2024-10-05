<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProFarm homepage</title>
    <link rel="stylesheet" href="style.css"> <!-- Link your CSS file -->
    <link rel="icon" type="image/png" href="/faviconwebsite/favicon_io/android-chrome-512x512.png"> <!-- Favicon addition-->
</head>
<body background="/public/images/backgroundimg.webp">

    <!-- Header Section -->
    <header class="header">
        <div class="header-container">
            <div class="header-left">
                <a href="index.html">
                <img src="images/Profarmlogo.jpg" alt="ProFarm Logo" height="200" class="header-logo">
                </a>
                <h1>ProFarm</h1>
            </div>
            <div class="header-right">
                <nav>
                    <ul class="nav-links">
                        <li class="dropdown">
                            <a href="#" class="dropbtn">Important Links</a>
                            <div class="dropdown-content">
                                <a href="/soilwiki/soiltype.html">Soil Type</a>
                                <a href="#">Crop Management</a>
                                <a href="#">Weather Updates</a>
                                <a href="#">Add More Links</a>
                            </div>
                        </li>
                        <li><button class="btn btn-signup">Sign Up</button></li>
                        <li><button class="btn btn-login">Login</button></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    
    <!-- Main Content -->
    <h1>ProFarm</h1>
    <!-- Floating Form -->
    <div class="form-container">
        <form id="farming-form" class="floating-form" action="">
            <h2>Farming Input Form</h2>
            <label for="pincode">Pincode:</label>
            <input type="text" id="pincode" name="pincode" placeholder="Enter your pincode" required>
            
            <label for="soiltype">Soil Type:</label>
            <select id="soiltype" name="soiltype" required>
                <option value="">Select Soil Type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="silty">Silty</option>
                <option value="peaty">Peaty</option>
                <option value="chalky">Chalky</option>
            </select>

            <label for="farmingtype">Farming Type:</label>
            <select id="farmingtype" name="farmingtype" required>
                <option value="">Select Farming Type</option>
                <option value="organic">Organic Farming</option>
                <option value="conventional">Conventional Farming</option>
                <option value="hydroponic">Hydroponic Farming</option>
                <option value="aquaponic">Aquaponic Farming</option>
            </select>

            <button type="submit">Submit</button>
        </form>
    </div>
    <!-- Footer will be loaded here -->
    <footer class="footer" id="footer-placeholder">
        <div class="footer-container">
            <div class="footer-left">
                <h2>ProFarm</h2>
                <p>Optimizing Agriculture, Growing Together.</p>
                <ul class="footer-links">
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
            <div class="footer-right">
                <img src="images/Profarmlogo.jpg" alt="ProFarm Logo" class="footer-logo">
            </div>
        </div>
    </footer>
    
</body>
</html>