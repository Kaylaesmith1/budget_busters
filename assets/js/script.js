/**
 * Index dom to handle expenses,
 * budget
 */
document.addEventListener("DOMContentLoaded", function () {
    // Get references to the input fields
    const costInput = document.getElementById("cost-value-input");
    const budgetInput = document.getElementById("budget-input");
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
        const costValue = parseFloat(costInput.value);

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

        // Calculate the remaining budget
        const totalSpend = savedData.reduce((total, entry) => total + parseFloat(entry.expense_value), 0);
        const remainingBudget = initialBudget - totalSpend;

        // Display the updated budget value
        displayBudget(remainingBudget);

        // Log the current content of the database
        console.log(`Current content of "${storageKey}" database after manipulation:`);
        console.log(localStorage.getItem(storageKey));

        // Clear the input field after saving
        costInput.value = "";
    }

    // Function to display the budget value
    function displayBudget(remainingBudget) {
        budgetDisplay.textContent = `Remaining Budget: $${remainingBudget.toFixed(2)}`;
    }

    // Function to read initial budget from local storage
    function readInitialBudget() {
        const storedBudget = localStorage.getItem("initial_budget");

        if (storedBudget !== null) {
            initialBudget = parseFloat(storedBudget);
        }

        // Display the initial budget
        displayBudget(initialBudget);
    }
    //readInitialBudget();


    // Function to set the planned budget manually
    function setPlannedBudget() {
        const plannedBudget = parseFloat(costInput.value);

        if (isNaN(plannedBudget) || plannedBudget < 0) {
            console.log("Please enter a valid planned budget.");
            return;
        }
        console.log("Clicked");

        // Set the initial budget to the planned budget
        initialBudget = plannedBudget;

        // Display the updated budget value
        displayBudget(initialBudget);
         // Clear the input field after saving
         costInput.value = "";
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

    // Display initial budget
    displayBudget(initialBudget);

    // Event listener for setting the planned budget manually
    document.getElementById("update-budget-button").addEventListener("click", setPlannedBudget);
   
});
