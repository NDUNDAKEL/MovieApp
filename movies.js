document.addEventListener("DOMContentLoaded", function () {
  const moviesContainer = document.getElementById("moviesContainer");
  const nextButton = document.getElementById("nextButton");
  const backButton = document.getElementById("backButton");

  let currentPage = 1;
  const moviesPerPage = 6;

  // Fetch movies from jspon server API
  async function fetchMovies(page) {
    try {
      const response = await fetch("http://localhost:3001/films", { cache: "reload" });
      const movies = await response.json();

      const startIndex = (page - 1) * moviesPerPage;
      const paginatedMovies = movies.slice(startIndex, startIndex + moviesPerPage);

      displayMovies(paginatedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  // Display movies
  function displayMovies(movies) {
    moviesContainer.innerHTML = ""; // Clearing previous content

    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className = "bg-white shadow-lg rounded-lg overflow-hidden text-center p-4 relative";

      movieCard.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" class="w-full h-[200px] object-cover rounded-lg">
        <h2 class="text-lg font-bold mt-3">${movie.title}</h2>
        <p class="text-gray-600">${movie.description.slice(0, 60)}...</p>
        <p class="text-gray-800 font-bold">Runtime: ${movie.runtime} min</p>
        <p class="text-gray-800 mb-6 font-bold">Available Tickets: ${movie.capacity - movie.tickets_sold}</p>
        <button class="bg-orange-500 p-3 rounded-lg text-white hover:bg-blue-600 book-btn" data-id="${movie.id}">
          Check it!
        </button>
      <button class="bg-blue-500 p-3 rounded-lg text-white hover:bg-red-700 delete-btn" 
        data-id="${movie.id}" 
        style="background-color: red;">
  Delete Film
</button>

      `;

      moviesContainer.appendChild(movieCard);
    });

    // Adding event listeners for "Book Now" buttons
    document.querySelectorAll(".book-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const movieId = this.getAttribute("data-id");
        window.location.href = `about.html?id=${movieId}`; // Redirecting to About.js
      });
    });

    // Adds event listeners for "Delete Film" buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async function () {
        const movieId = this.getAttribute("data-id");
        await deleteMovie(movieId);
      });
    });
  }

// Function to delete a movie with confirmation
async function deleteMovie(movieId) {
  const isConfirmed = confirm("Are you sure you want to delete this movie?");
  
  if (!isConfirmed) {
    return; 
  }

  try {
    const response = await fetch(`http://localhost:3001/films/${movieId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Movie deleted successfully!");
      fetchMovies(currentPage); // Refreshing the list
    } else {
      alert("Failed to delete movie.");
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
  }
}

  // Handles Next button click
  nextButton.addEventListener("click", () => {
    currentPage++;
    fetchMovies(currentPage);
  });

  // Handles Back button click
  backButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchMovies(currentPage);
    }
  });

  // Initial load.
  fetchMovies(currentPage);
});
