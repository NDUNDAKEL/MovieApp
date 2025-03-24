document.addEventListener("DOMContentLoaded", function () {
  const moviesContainer = document.getElementById("moviesContainer");
  const nextButton = document.getElementById("nextButton");
  const backButton = document.getElementById("backButton");

  let currentPage = 1;
  const moviesPerPage = 6;

  // Fetch movies from API
  async function fetchMovies(page) {
    try {
        const response = await fetch("http://localhost:3001/films", { cache: "reload" });
      const movies = await response.json();

      const startIndex = (page - 1) * moviesPerPage;
      const paginatedMovies = movies.slice(
        startIndex,
        startIndex + moviesPerPage
      );

      displayMovies(paginatedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  // Display movies
  function displayMovies(movies) {
    moviesContainer.innerHTML = ""; // Clear previous content

    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className =
        "bg-white shadow-lg rounded-lg overflow-hidden text-center p-4";

      movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="w-full h-[200px] object-cover rounded-lg">
                <h2 class="text-lg font-bold mt-3">${movie.title}</h2>
                <p class="text-gray-600">${movie.description.slice(0,60)}..</p>
                <p class="text-gray-800 font-bold">Runtime: ${movie.runtime} min</p>
                <p class="text-gray-800 mb-6 font-bold">Available Tickets : ${movie.capacity - movie.tickets_sold}</p>
                <button class="bg-orange-500 absolute botton-0  p-3  rounded-lg text-white hover:bg-blue-600 book-btn" data-id="${movie.id}">
                    Check it!
                </button>
            `;

      moviesContainer.appendChild(movieCard);
    });

    // Add event listeners to "Book Now" buttons
    document.querySelectorAll(".book-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const movieId = this.getAttribute("data-id");
        window.location.href = `about.html?id=${movieId}`; // Redirect to About.js
      });
    });
  }

  // Handle Next button click
  nextButton.addEventListener("click", () => {
    currentPage++;
    fetchMovies(currentPage);
  });

  // Handle Back button click
  backButton.addEventListener("click", () => {
    currentPage--;
    fetchMovies(currentPage);
  });

  // Initial load
  fetchMovies(currentPage);
});
