/**
 * Index dom to handle expenses
 */
document.addEventListener("DOMContentLoaded", function () {
    // Get reference to the input field for cost value
    const costInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");

    // Function to add click event listener to a button
    function addButtonClickListeners(category, type) {
        document.getElementById(`${type.toLowerCase()}-button`).addEventListener("click", function () {
            manipulateExpenses(category, type);
     // Get the entered cost value
     const costValue = parseFloat(costInput.value);

     // Check if the entered value is empty
     if (isNaN(costValue) || costValue <= 0) {
         console.log("Please enter a valid amount.");
         return;
     }

     // Log all relevant variables in one statement
     console.log(`Manipulated Category: ${category}, Type: ${type}, Cost Value: ${costValue}`);

           
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

        // Create a data object with timestamp, category, type, and amount
        const data = {
            username: "exampleUser",
            goal_id: 1,
            user_id: 1,
            goal_title: "Example Goal",
            goal_start_value: 100,
            goal_end_value: 500,
            goal_start_month: "January",
            goal_end_month: "February",
            goal_status: "In Progress",
            goal_notes: "Example notes",
            spend_category: category,
            spend_type: type,
            spend_amount_value: costValue,
            budget_value: 233,
        };

        // Try to retrieve existing data from localStorage
        let savedData;
        try {
            savedData = JSON.parse(localStorage.getItem("budget_busters_DB")) || [];
        } catch (error) {
            console.error("Error parsing existing data:", error);
            savedData = [];
        }

        // Add the new data to the array
        savedData.push(data);

        // Save the updated array back to localStorage
        localStorage.setItem("budget_busters_DB", JSON.stringify(savedData));
        console.log("Data saved locally:", data);

        // Display the updated budget value
        displayBudget();
    }

    // Function to display the budget value
    function displayBudget() {
        // Try to retrieve existing data from localStorage
        let savedData;
        try {
            savedData = JSON.parse(localStorage.getItem("budget_busters_DB")) || [];
        } catch (error) {
            console.error("Error parsing existing data:", error);
            savedData = [];
        }

        const totalSpend = savedData.reduce((total, entry) => total + parseFloat(entry.spend_amount_value), 0);
        budgetDisplay.textContent = `Budget: $${Math.max(0, 233 - totalSpend).toFixed(2)}`;
    }

    // Function to check if there's a database with the proper name
    function checkLocalStorage() {
        const dbName = "budget_busters_DB";
        const localStorageContent = localStorage.getItem(dbName);
        
        if (localStorageContent) {
            console.log(`Database "${dbName}" found in localStorage.`);
            console.log("Content:", localStorageContent);
        } else {
            console.log(`Database "${dbName}" not found in localStorage.`);
        }
    }

    // Function to clear local storage (for testing purposes)
    function clearLocalStorage() {
        localStorage.clear();
        console.log("Local storage cleared.");
    }

    // Add click event listeners for Basic Needs buttons
    addButtonClickListeners("basicNeeds", "Food");
    addButtonClickListeners("basicNeeds", "Transport");
    addButtonClickListeners("basicNeeds", "Education");
    addButtonClickListeners("basicNeeds", "Healthcare");
    addButtonClickListeners("basicNeeds", "Housing");
    addButtonClickListeners("basicNeeds", "Utilities");

    // Add click event listeners for Luxury buttons
    addButtonClickListeners("luxury", "Entertainment");
    addButtonClickListeners("luxury", "Travel");
    addButtonClickListeners("luxury", "Dining");
    addButtonClickListeners("luxury", "Gadgets");
    addButtonClickListeners("luxury", "Clothing");
    addButtonClickListeners("luxury", "Beauty");

    // Uncomment the following line to clear local storage (for testing purposes)
    // clearLocalStorage();

    function clearLocalStorage() {
        const dbName = "budget_busters_DB";
        localStorage.removeItem(dbName);
        console.log(`Local storage cleared for "${dbName}". Starting fresh.`);
    }
    //clearLocalStorage();
    // Check if there's a database with the proper name
    checkLocalStorage();
});
