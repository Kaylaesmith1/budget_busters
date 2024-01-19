/**
 * Index dom to handle expenses
 */
document.addEventListener("DOMContentLoaded", function () {
    // Get reference to the input field for cost value
    const costInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");

    // Function to add click event listener to a button
    function addButtonClickListeners(type) {
        document.getElementById(`${type.toLowerCase()}-button`).addEventListener("click", function () {
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
                expense_category: "Example Category", // Update with the actual category
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

            // Clear the input field after saving
            costInput.value = "";
            // Add the new data to the array
            savedData.push(data);

            // Save the updated array back to localStorage
            localStorage.setItem(storageKey, JSON.stringify(savedData));

            // Display the updated budget value (if needed)
            // displayBudget();

            // Log the current content of the database
            console.log(`Current content of "${storageKey}" database after manipulation:`);
            console.log(localStorage.getItem(storageKey));
        });
    }

    // Function to display the budget value
    function displayBudget() {
        // Try to retrieve existing data from localStorage
        let savedData;
        try {
            savedData = JSON.parse(localStorage.getItem("expense_tracker_DB")) || [];
        } catch (error) {
            console.error("Error parsing existing data:", error);
            savedData = [];
        }

        const totalSpend = savedData.reduce((total, entry) => total + parseFloat(entry.expense_value), 0);
        budgetDisplay.textContent = `Total Expense: $${totalSpend.toFixed(2)}`;
    }

    // Function to check if there's a database with the proper name
    function checkLocalStorage() {
        const dbName = "expense_tracker_DB";
        const localStorageContent = localStorage.getItem(dbName);
        
        if (localStorageContent) {
            console.log(`Database "${dbName}" found in localStorage.`);
            console.log("Content:", localStorageContent);
        } else {
            console.log(`Database "${dbName}" not found in localStorage.`);
        }
    }

    //basic needs buttons
    addButtonClickListeners("Food");
    addButtonClickListeners("Transport");
    addButtonClickListeners("Education");
    addButtonClickListeners("Healthcare");
    addButtonClickListeners("Housing");
    addButtonClickListeners("Utilities");

    //expenses buttons
    addButtonClickListeners("Entertainment");
    addButtonClickListeners("Travel");
    addButtonClickListeners("Dining");
    addButtonClickListeners("Gadgets");
    addButtonClickListeners("Clothing");
    addButtonClickListeners("Beauty");

    // Uncomment the following line to clear local storage (for testing purposes)
    // clearLocalStorage();

    // Check if there's a database with the proper name
    checkLocalStorage();
});
