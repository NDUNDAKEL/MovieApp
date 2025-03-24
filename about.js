document.addEventListener("DOMContentLoaded", async function () {
    // Get the movie ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    if (!movieId) {
        console.error("Movie ID not found");
        return;
    }

    try {
        // Fetch movie details from the JSON server
        const response = await fetch(`http://localhost:3001/films/${movieId}`);
        const movie = await response.json();

        // Populate the movie details on the page
        document.getElementById("movieTitle").textContent = movie.title;
        document.getElementById("moviePoster").src = movie.poster;
        document.getElementById("movieDescription").textContent = movie.description;
        document.getElementById("movieRuntime").textContent = `Runtime: ${movie.runtime} min`;
        document.getElementById("movieShowtime").textContent = `Showtime: ${movie.showtime}`;

        // Initialize available tickets count
        const availableTicketsElement = document.getElementById("availableTickets");
        const bookButton = document.getElementById("bookButton");
        let availableTickets = movie.capacity - movie.tickets_sold;
        availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`;

        // Function to update button state based on ticket availability
        function updateButtonState() {
            if (availableTickets <= 0) {
                bookButton.textContent = "Sold Out";
                bookButton.disabled = true;
                bookButton.classList.add("bg-gray-500", "cursor-not-allowed");
                bookButton.classList.remove("bg-orange-500", "hover:bg-blue-600");
            }
        }

        // Initially check the button state
        updateButtonState();

        // Event listener for the "Book Now" button
        bookButton.addEventListener("click", async function () {
            if (availableTickets > 0) {
                const updatedTicketsSold = movie.tickets_sold + 1;

                // Send PATCH request to update the number of tickets sold
                const updateResponse = await fetch(`http://localhost:3001/films/${movieId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tickets_sold: updatedTicketsSold })
                });

                if (updateResponse.ok) {
                    // Update the local movie object and recalculate available tickets
                    movie.tickets_sold = updatedTicketsSold;
                    availableTickets = movie.capacity - movie.tickets_sold;
                    availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`;

                    // Send POST request to store purchased ticket in /tickets
                    const ticketResponse = await fetch("http://localhost:3001/tickets", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            movieId: movie.id,
                            title: movie.title,
                            poster: movie.poster,
                            description:movie.description,
                            runtime:movie.runtime,
                            showtime:movie.showtime,
                            tickets_sold:movie.tickets_sold,
                            capacity:movie.capacity
                       
                        
                            })
                    });

                    if (ticketResponse.ok) {
                        alert("Ticket saved successfully!");
                    } else {
                       alert("Failed to save ticket.");
                    }

                    // Update button state after purchase
                    updateButtonState();

                    // Confirm booking
                    alert(`Booking for ${movie.title} confirmed!`);
                } else {
                    alert("Error booking ticket. Please try again.");
                }
            }
        });

    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
});
