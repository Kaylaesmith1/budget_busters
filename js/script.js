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
    // Get reference to the input field for cost value
    const costInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");
    const goalAmountInput = document.getElementById("goal-amount");
    const savingsNameInput = document.getElementById("savings-name");
    const goalDetailsParagraph = document.getElementById("goal-details");

   // localStorage.removeItem("budget_busters_DB");
    displayBudget();

    // Function to get the current timestamp
    function getCurrentTimestamp() {
        return new Date().toISOString();
    }

    // Function to handle button click events
    function handleButtonClick(category, costType) {
        // Get the entered cost value
        const costValue = costInput.value;

        // Check if the entered value is empty
        if (costValue.trim() === "") {
            console.log("Please enter a valid amount.");
            return;
        }
      

        // Create a data object with timestamp, category, costType, and amount
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
            spend_category: "Food",
            spend_type: "Groceries",
            spend_amount_value: 50,
            budget_value:233,   
        };

        // Retrieve existing data from localStorage or initialize an empty array
        const savedData = JSON.parse(localStorage.getItem("budget_busters_DB")) || [];

        // Add the new data to the array
        savedData.push(data);

        // Save the updated array back to localStorage
        localStorage.setItem("budget_busters_DB", JSON.stringify(savedData));

        // Log the saved data
        console.log("Data saved locally:", data);

        // Deduct the cost amount from the saved budget_busters_DB
        const savedBudget = parseFloat(localStorage.getItem("budget_busters_DB")) || 0;
        const newBudget = savedBudget - parseFloat(costValue);

        // Save the updated budget value to localStorage
        localStorage.setItem("budget_busters_DB", newBudget);

        // Log the updated budget value
        console.log("Budget updated:", newBudget);

        // Clear the input field after saving
        costInput.value = "";
    }

    // Function to display the budget_busters_DB value
    function displayBudget() {
        const savedBudget = parseFloat(localStorage.getItem("budget_busters_DB")) || 0;
        budgetDisplay.textContent = `Budget: $${savedBudget.toFixed(2)}`;
    }

    // Event listeners for Basic Needs buttons
    document.getElementById("food-button").addEventListener("click", function () {
        handleButtonClick("basicNeeds", "Food");
        displayBudget();
    });

    document.getElementById("transport-button").addEventListener("click", function () {
        handleButtonClick("basicNeeds", "Transport");
        displayBudget();
    });

    document.getElementById("education-button").addEventListener("click", function () {
        handleButtonClick("basicNeeds", "Education");
        displayBudget();
    });

    document.getElementById("healthcare-button").addEventListener("click", function () {
        handleButtonClick("basicNeeds", "Healthcare");
        displayBudget();
    });

    document.getElementById("housing-button").addEventListener("click", function () {
        handleButtonClick("basicNeeds", "Housing");
        displayBudget();
    });

    document.getElementById("utilities-button").addEventListener("click", function () {
        handleButtonClick("basicNeeds", "Utilities");
        displayBudget();
    });

    // Event listeners for Luxury buttons
    document.getElementById("entertainment-button").addEventListener("click", function () {
        handleButtonClick("luxury", "Entertainment");
        displayBudget();
    });

    document.getElementById("travel-button").addEventListener("click", function () {
        handleButtonClick("luxury", "Travel");
        displayBudget();
    });

    document.getElementById("dining-button").addEventListener("click", function () {
        handleButtonClick("luxury", "Dining");
        displayBudget();
    });

    document.getElementById("gadgets-button").addEventListener("click", function () {
        handleButtonClick("luxury", "Gadgets");
        displayBudget();
    });

    document.getElementById("clothing-button").addEventListener("click", function () {
        handleButtonClick("luxury", "Clothing");
        displayBudget();
    });

    document.getElementById("beauty-button").addEventListener("click", function () {
        handleButtonClick("luxury", "Beauty");
        displayBudget();
    });

    // Function to display goal details
    function displayGoalDetails(goal) {
        goalDetailsParagraph.textContent = `Goal: ${goal.name}, Amount: ${goal.amount}, Duration: ${goal.duration}`;
    }

  // Function to extract day, month, and year from timestamp
function extractDateDetails(timestamp) {
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so we add 1
    const year = date.getFullYear();

    return { day, month, year };
}

// Function to handle goal creation

function createGoal(duration) {
  
    // Parse the input value as a floating-point number
    const goalAmount = goalAmountInput.value;
    const savingsName = savingsNameInput.value;
    const goalStatus = "In Progress";


    // Ensure the elements are found before attempting to access their values
    if (!goalAmountInput || !savingsNameInput) {
        console.log("Error: Could not find input elements.");
        return;
    }

    console.log("goalAmount:", goalAmount);
    console.log("savingsName:", savingsName);

    // Check if the entered values are empty or if goalAmount is not a valid number
    if (isNaN(goalAmount) || !savingsName.trim() || goalAmount < 0) {
        console.log("Please enter a valid positive goal amount.");
        return;
    }

    // Calculate the deadline based on the duration
    const today = new Date();
    let goal_end_value;

    switch (duration) {
        case "1 Month":
            goal_end_value = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            break;
        case "6 Months":
            goal_end_value = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
            break;
        case "1 Year":
            goal_end_value = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
            break;
        default:
            console.log("Invalid duration.");
            return;
    }

    // Format the deadline as 'day:month:year'
    const formattedDeadline = `${goal_end_value.getDate()}:${goal_end_value.getMonth() + 1}:${goal_end_value.getFullYear()}`;

    // Calculate the remaining days until the deadline
    const remainingDays = Math.ceil((goal_end_value - today) / (1000 * 60 * 60 * 24));

    // Create a goal object with amount, name, duration, and formatted deadline
    const goal = {
        goal_end_value: goalAmount,
        goal_title: savingsName,
        goal_start_value: 0, 
        goal_finishing_value: formattedDeadline, 
        goal_remaining_days_value: remainingDays,
        goal_status: goalStatus,
        goal_notes: "",
    };

    // Retrieve existing goal data from localStorage or initialize an empty array
    const savedGoals = JSON.parse(localStorage.getItem("budget_busters_DB")) || [];

    // Add the new goal to the array
    savedGoals.push(goal);

    // Save the updated goal array back to localStorage
    localStorage.setItem("budget_busters_DB", JSON.stringify(savedGoals));

    // Log the saved goal
    console.log("Goal saved locally:", goal);

    // Clear the input fields
    goalAmountInput.value = "";
    savingsNameInput.value = "";

    // Display the goal details
    displayGoalDetails(goal);
 }

// Function to handle savings button click events
function handleSavings() {
    // Get the savings input value
    const savingsInput = document.getElementById("goal-deposit");
    const savingsValue = parseFloat(savingsInput.value);

    // Ensure the savings input element is found
    if (!savingsInput || isNaN(savingsValue) || savingsValue < 0) {
        console.log("Error: Invalid savings amount.");
        return;
    }

    // Retrieve existing goal data from localStorage or initialize an empty array
    const savedGoals = JSON.parse(localStorage.getItem("budget_busters_DB")) || [];

    // Get the index of the last saved goal (assuming you are saving to the latest goal)
    const lastGoalIndex = savedGoals.length - 1;

    // Check if there are any saved goals
    if (lastGoalIndex >= 0) {
        // Update the saved goal with the savings
        savedGoals[lastGoalIndex].amount += savingsValue;

        // Save the updated goal array back to localStorage
        localStorage.setItem("budget_busters_DB", JSON.stringify(savedGoals));

        // Log the updated goal
        console.log("Savings saved:", savedGoals[lastGoalIndex]);
    } else {
        console.log("No goals available to save.");
    }

    // Clear the savings input field
    savingsInput.value = "";
}


// Add an event listener to the "Deposit" button
const depositButton = document.getElementById("save-goal-deposit-button");
depositButton.addEventListener("click", function () {
    // Retrieve existing goal data from localStorage
    const savedGoals = JSON.parse(localStorage.getItem("budget_busters_DB")) || [];

    const depositInput = document.getElementById("goal-deposit");
    const depositAmount = parseFloat(depositInput.value);

    // Check if the entered deposit amount is valid
    if (!isNaN(depositAmount) && depositAmount >= 0) {

        // Update the savings for the latest goal (assuming the latest goal was just added)
        if (savedGoals.length > 0) {
            const latestGoal = savedGoals[savedGoals.length - 1];
            latestGoal.savings += depositAmount;

            // Check if savings exceed the goal amount
            if (latestGoal.savings >= latestGoal.amount) {
                // Equalize savings and amount
                latestGoal.savings = latestGoal.amount;
                console.log(`Goal "${latestGoal.name}" is achieved! Create another goal.`);

                // You can display a message to the user or perform any additional action
            }
        }

        // Save the updated goal array back to localStorage
        localStorage.setItem("budget_busters_DB", JSON.stringify(savedGoals));

        // Log the updated goal with savings
        console.log("Savings updated:", savedGoals[savedGoals.length - 1]);
    } else {
        console.log("Please enter a valid positive deposit amount.");
    }

    // Clear the deposit input
    depositInput.value = "";
    initializeGoalDisplay();
});

    // Event listeners for goal creation buttons
    document.getElementById("one-month-goal").addEventListener("click", function () {
        createGoal("1 Month");
        initializeGoalDisplay();
    });

    document.getElementById("six-months-goal").addEventListener("click", function () {
        createGoal("6 Months");
        initializeGoalDisplay();
    });

    document.getElementById("one-year-goal").addEventListener("click", function () {
        createGoal("1 Year");
        initializeGoalDisplay();
    });

    // Function to initialize goal display on page load
    function getRandomColor() {
        // Generate a random color in hex format
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
    
    function initializeGoalDisplay() {
        const savedGoals = JSON.parse(localStorage.getItem("budget_busters_DB")) || [];
    
        // Get reference to the goal details container
        const goalDetailsContainer = document.getElementById("goal-details");
    
        // Clear the existing content in the container
        goalDetailsContainer.innerHTML = "";
    
        if (savedGoals.length > 0) {
            // Iterate over all saved goals
            savedGoals.forEach(goal => {
                // Create a new div for the goal details
                const goalDetailsDiv = document.createElement("div");
                goalDetailsDiv.classList.add("goal-details");
    
                // Create a container div for each goal
                const goalContainerDiv = document.createElement("div");
                goalContainerDiv.classList.add("goal-container");
                                
                // Set the content of the goal details div
                goalDetailsDiv.innerHTML = `<p>Name: ${goal.goalName}</p>
                                            <p>Goal: ${goal.goalAmount}</p>
                                            <p>Duration: ${goal.goalDuration}</p>
                                            <p>Deadline: ${goal.goalDeadline}</p>
                                            <p>Remaining Days: ${goal.goalRemainingDays}</p>
                                            <p>Saved: ${goal.goalSavings}</p>
                                            <p>To save: ${goal.goalAmount - goal.goalSavings}</p>`;
    
                // Assign a random background color
                goalContainerDiv.style.backgroundColor = getRandomColor();
                goalContainerDiv.style.border = "2px solid #000";
                goalContainerDiv.style.marginBottom = "2px";
    
                // Append the goal details div to the container
                goalContainerDiv.appendChild(goalDetailsDiv);
    
                // Add click event listener to show/hide details
                goalContainerDiv.addEventListener("click", function () {
                    alert(`Details for ${goal.name}: ${goal.amount} for ${goal.duration}`);
                });
    
                // Append the goal container div to the main container
                goalDetailsContainer.appendChild(goalContainerDiv);
            });
        }
    }
    

    // Call the initialize function on DOMContentLoaded
    initializeGoalDisplay();
});
