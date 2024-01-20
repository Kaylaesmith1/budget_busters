/**
 * Index dom to handle expenses,
 * budget
 */
document.addEventListener("DOMContentLoaded", function () {
    // Get references to the input fields
    const costBudgetInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");

    // Initial budget value
    let initialBudget = 0; // Set initial budget to 0

    // Function to add click event listener to a button
    function addButtonClickListeners(category, type) {
        document.getElementById(`${type.toLowerCase()}-button`).addEventListener("click", function () {
            manipulateExpenses(category, type);
        });
    }

    // Function to handle button click events
    function manipulateExpenses(category, type) {
        // Get the entered cost value
        const costValue = parseFloat(costBudgetInput.value);

        // Check if the entered value is empty
        if (isNaN(costValue) || costValue <= 0) {
            console.log("Please enter a valid amount.");
            return;
        }

        // Create a data object with current date, type, category, and amount
        const currentDate = new Date().toLocaleDateString();
        const data = {
            expense_date: currentDate,
            expense_type: type,
            expense_category: category,
            expense_value: costValue,
        };

        // Try to retrieve existing data from localStorage
        let savedData;
        const storageKey = "expense_tracker_DB";
        try {
            savedData = JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch (error) {
            console.error("Error parsing existing data:", error);
            savedData = [];
        }

        // Add the new data to the array
        savedData.push(data);

        // Save the updated array back to localStorage
        localStorage.setItem(storageKey, JSON.stringify(savedData));

        // Subtract the expense amount from the budget
        initialBudget -= costValue;

        // Update and store the current budget in local storage
        localStorage.setItem("budget", initialBudget);

        // Display the updated budget value
        displayBudget(initialBudget);

        // Log the current content of the database
        console.log(`Current content of "${storageKey}" database after manipulation:`);
        console.log(localStorage.getItem(storageKey));

        // Clear the input field after saving
        costBudgetInput.value = "";
    }

 // Function to display the budget value
function displayBudget(remainingBudget) {
    const formattedBudget = remainingBudget.toFixed(2);
    budgetDisplay.textContent = `Remaining Budget: $${formattedBudget}`;

    // Remove existing classes
    budgetDisplay.classList.remove("positive-budget", "negative-budget");

    // Add class based on the remaining budget
    if (remainingBudget >= 0) {
        budgetDisplay.classList.add("positive-budget");
    } else {
        budgetDisplay.classList.add("negative-budget");
    }
}


    // Function to read initial budget from local storage
    function readInitialBudget() {
        const storedBudget = localStorage.getItem("budget");

        if (storedBudget !== null) {
            initialBudget = parseFloat(storedBudget);
        }

        // Display the initial budget
        displayBudget(initialBudget);
    }

    // Function to set the planned budget manually
    function setPlannedBudget() {
        const plannedBudget = parseFloat(costBudgetInput.value);

        if (isNaN(plannedBudget) || plannedBudget < 0) {
            console.log("Please enter a valid planned budget.");
            return;
        }

        // Set the initial budget to the planned budget
        initialBudget += plannedBudget;

        // Save the initial budget to local storage
        localStorage.setItem("budget", initialBudget);

        // Display the updated budget value
        displayBudget(initialBudget);

        // Clear the input field after saving
        costBudgetInput.value = "";
    }

    // Example usage:
    // Basic Needs buttons
    addButtonClickListeners("Basic Needs", "Food");
    addButtonClickListeners("Basic Needs", "Transport");
    addButtonClickListeners("Basic Needs", "Education");
    addButtonClickListeners("Basic Needs", "Healthcare");
    addButtonClickListeners("Basic Needs", "Housing");
    addButtonClickListeners("Basic Needs", "Utilities");

    // Luxury buttons
    addButtonClickListeners("Luxury", "Entertainment");
    addButtonClickListeners("Luxury", "Travel");
    addButtonClickListeners("Luxury", "Dining");
    addButtonClickListeners("Luxury", "Gadgets");
    addButtonClickListeners("Luxury", "Clothing");
    addButtonClickListeners("Luxury", "Beauty");

    // Read initial budget from local storage
    readInitialBudget();

    // Display initial budget
    displayBudget(initialBudget);

    // Event listener for setting the planned budget manually
    document.getElementById("update-budget-button").addEventListener("click", setPlannedBudget);
});
