
// DOM Manipulation: Welcome Message Updates
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("welcomeMessage").textContent = "Explore Our Innovative Solutions!";
    }, 3000);
});

// Header Text Animation
const headerText = document.getElementById("headerText");
headerText.addEventListener("mouseover", () => {
    headerText.classList.add("text-yellow-300", "scale-105");
});
headerText.addEventListener("mouseout", () => {
    headerText.classList.remove("text-yellow-300", "scale-105");
});

// Theme Toggle Feature
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("bg-gray-900");
    document.body.classList.toggle("text-white");
    themeToggle.textContent = document.body.classList.contains("bg-gray-900") ? "Switch Theme ☀️" : "Switch Theme 🌙";
});

// Product Button: Show More Details
document.querySelectorAll(".product-btn").forEach((button, index) => {
    button.addEventListener("click", () => {
        alert(`You clicked on Product ${index + 1}. More details coming soon!`);
    });
});
