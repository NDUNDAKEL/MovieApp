document.addEventListener("DOMContentLoaded", function () {
    const moviesContainer = document.getElementById("moviesContainer");
    const nextButton = document.getElementById("nextButton");
    const backButton = document.getElementById("backButton");
  
    let currentPage = 1;
    const moviesPerPage = 6;
    let totalMovies = 0; // To manage pagination
  
    // Fetching movies from API
    async function fetchMovies(page) {
      try {
        const response = await fetch("http://localhost:3001/tickets", {
          cache: "reload",
        });
        const movies = await response.json();
        totalMovies = movies.length; // Update total movie count
  
        const startIndex = (page - 1) * moviesPerPage;
        const paginatedMovies = movies.slice(
          startIndex,
          startIndex + moviesPerPage
        );
  
        displayMovies(paginatedMovies);
        updatePaginationButtons();
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
  
    // Displaying movies
    function displayMovies(movies) {
      moviesContainer.innerHTML = ""; // Clearing previous content
  
      movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.className =
          "bg-white shadow-lg rounded-lg overflow-hidden text-center p-4 relative";
  
        movieCard.innerHTML = `
                  <img src="${movie.poster}" alt="${
          movie.title
        }" class="w-full h-[200px] object-cover rounded-lg">
                  <h2 class="text-lg font-bold mt-3">${movie.title}</h2>
                  <p class="text-gray-600">${
                    movie.description?.slice(0, 70) || ""
                  }...</p>
                  <p class="text-gray-800 font-bold">ShowTime: ${movie.showtime}</p>
                  <p class="text-gray-800 font-bold">Runtime: ${movie.runtime} min</p>
                  <p class="text-gray-800 font-bold slots-count">Available Slots: ${
                    movie.capacity - movie.tickets_sold
                  }</p>
  
                  <!-- Delete Ticket Button -->
                  <button class="bg-blue-500 justify-center items-center mt-3 p-3 rounded-lg text-white hover:bg-red-600 delete-btn" data-id="${
                    movie.id
                  }" data-movie-id="${movie.movieId}">
                      Delete Ticket
                  </button>
              `;
  
        moviesContainer.appendChild(movieCard);
      });
  
      attachDeleteListeners();
    }
  
    // Attaching event listeners to Delete buttons
    function attachDeleteListeners() {
        document.querySelectorAll(".delete-btn").forEach((button) => {
          button.addEventListener("click", async function () {
            const ticketId = this.getAttribute("data-id");
            const movieId = this.getAttribute("data-movie-id");
      
            try {
              // Fetching the movie data using movieId
              const response = await fetch(`http://localhost:3001/films/${movieId}`);
              if (!response.ok) throw new Error("Movie not found");
              const movie = await response.json();
      
              const updatedTicketsSold = movie.tickets_sold - 1;
      
              // Updating `tickets_sold` in the database
              const updateResponse = await fetch(`http://localhost:3001/films/${movieId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
              });
      
              if (!updateResponse.ok) throw new Error("Failed to update tickets_sold");
      
              const confirmDelete = confirm("Are you sure you want to delete this ticket?");
              if (!confirmDelete) return;
      
              // Delete the ticket
              const deleteResponse = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
                method: "DELETE",
              });
      
              if (deleteResponse.ok) {
                alert("Ticket deleted successfully! ✅");
                fetchMovies(currentPage); // Refreshing the  UI
              } else {
                alert("Failed to delete ticket ❌");
              }
            } catch (error) {
              console.error("Error deleting ticket:", error);
              alert("Something went wrong! ❌");
            }
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
      if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentPage);
      }
    });
  
    // Update pagination buttons
    function updatePaginationButtons() {
      backButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage * moviesPerPage >= totalMovies;
    }
  
    // Initial load
    fetchMovies(currentPage);
  });
  