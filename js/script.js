// nav bar

$(document).ready(function () {
    // Add an event listener for the navbar-toggler button
    $('.navbar-toggler').click(function () {
        // Toggle the navigation menu when the toggler is clicked
        $('.navbar-collapse').toggleClass('show');
    });
});

/*index DOM*/

document.addEventListener("DOMContentLoaded", function () {
    const goalContainer = document.getElementById("goals-container");
    const addGoalButton = document.getElementById("add-goal-button");

    // Function to create a new goal div
    function createGoalDiv() {
        const newGoalDiv = document.createElement("div");
        newGoalDiv.classList.add("goal");
        newGoalDiv.textContent = "New Goal"; // You can customize the content as needed
        goalContainer.appendChild(newGoalDiv);
    }

    // Event listener for the plus button
    addGoalButton.addEventListener("click", function () {
        createGoalDiv();
    });
});