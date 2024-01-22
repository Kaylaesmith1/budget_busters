document.addEventListener("DOMContentLoaded", function () {
    const costBudgetInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");
    const dataDisplayList = document.getElementById("data-display-list");
    const getDataByDateButton = document.getElementById('get-data-by-date');
    const getDataByTypeButton = document.getElementById('get-data-by-type');
    const getDataByCategoryButton = document.getElementById('get-data-by-category');
    const openInsinghstScreen = document.getElementById('get-insights-nav-button');
    const insinghstScreen = document.getElementById('insights-container');
    
   
    const getDataGeneralButton = document.getElementById('get-data-general');
    const dataTitle = document.getElementById("data-analytics-title");
    const calendar = document.getElementById("calendar");

    
    const createGoalForm = document.getElementById('create-goal-form')
const filterDataButton = document.getElementById('tracker-data-button');
const insightsButtonsContainer = document.getElementById('insights-buttons-container');
const insightsNavContainer = document.getElementById('insight-navigation-buttons');
const goalsButton = document.getElementById('goals-data-button');
const displayGoals = document.getElementById('display-goals');
const createGoalButton = document.getElementById('create-goal-button')
const submitGoal = document.getElementById('submit-goal-button');
const closeGoalScreenButton = document.getElementById('close-goals-button');
const closePopup = document.getElementById('close-popup');
const closeDataList = document.getElementById('close-data-for-date-button');


/** CODE FOR GOALS; SCREEN HANDELING
 * 
 */

// Add an event listener to the button
createGoalButton.addEventListener('click', function () {
    if (createGoalForm.style.display === 'none') {
        createGoalForm.style.display ='block'
    } else {
        createGoalForm.style.display = 'none';
    }
    console.log('Create Goal button clicked!');
});

submitGoal.addEventListener('click', function () {
    saveGoal();
    if (createGoalForm.style.display === 'none') {
        createGoalForm.style.display ='block'
    } else {
        createGoalForm.style.display = 'none';
    }
    console.log('Create Goal button clicked!');
});

closeGoalScreenButton.addEventListener('click', function () {
   
        displayGoals.style.display = 'none';
    
    console.log('Create Goal button clicked!');
});


closePopup.addEventListener('click', function () {
   
    document.getElementById("goals-popup").style.display = "none";


console.log('Create Goal button clicked!');
});
closeDataList.addEventListener('click', function () {
   dataDisplayList.style.display = 'none'
   insightsNavContainer.style.display = 'block';
   closeDataList.style.display = 'none';
   

  

});
goalsButton.addEventListener('click', function () {
    // Toggle the visibility of the display-goals element
    if (displayGoals.style.display === 'none') {
        displayGoals.style.display = 'block';
    } else {
        displayGoals.style.display = 'none';
    }
});
const calendarGrid = document.getElementById("calendar-grid");

function displayGoalsList() {
    let goalListDiv = document.getElementById("goals-display-list");
    let goalsPopupDiv = document.getElementById("goals-popup");
    let dataGoalsDetailsList = document.getElementById("data-goals-details-list");

    goalListDiv.innerHTML = ""; // Clear existing content

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith("goal_")) {
            let goalData = JSON.parse(localStorage.getItem(key));

            let goalDiv = document.createElement("div");
            goalDiv.innerHTML =
                "<strong>Goal:</strong> " + goalData.goalName + "<br>" +  "<strong>click here:</strong> " +
                "<strong>Status:</strong> " + goalData.goalStatus + "<br>" +  "<strong> //CLICK MORE DATA// </strong> "+"<br><br>";

            // Apply styles based on goal status
            if (goalData.goalStatus === "active") {
                goalDiv.style.color = "green"; 
                goalDiv.style.border = "1px solid #3D946E"; 
            } else if (goalData.goalStatus === "reached") {
                goalDiv.style.color = "red"; 
                goalDiv.style.border = "1px solid red";
            }

            goalDiv.addEventListener("click", function() {
                console.log("Goal clicked:", goalData);
                displayChildrenOfGoalsDatabase(goalData);

                // Make the goals-popup visible
                goalsPopupDiv.style.display = "block";

                // Populate data-goals-details-list with data from the database
                populateGoalsDetailsList(dataGoalsDetailsList, goalData);
            });

            goalListDiv.appendChild(goalDiv);
        }
    }
}

function displayChildrenOfGoalsDatabase(goalData) {
    console.log("Children of goals database for goal:", goalData);
    console.log("Child 1:", goalData.child1);
    console.log("Child 2:", goalData.child2);
    // ...
}
function populateGoalsDetailsList(listElement, goalData) {
    // Clear existing content in the list
    listElement.innerHTML = "";

    // Add some styles to the list
    listElement.style.listStyleType = "none";
    listElement.style.padding = "0";
    listElement.style.margin = "0";

    // Iterate over properties of the goalData object and add list items
    for (let key in goalData) {
        if (goalData.hasOwnProperty(key)) {
            addListItem(listElement, key, goalData[key]);
        }
    }

    // You can customize the content and structure based on your needs
}

// Helper function to add a styled list item
function addListItem(listElement, label, value) {
    let listItem = document.createElement("li");
    listItem.style.marginBottom = "8px"; // Adjust the margin as needed
    listItem.innerHTML = `<strong>${label}:</strong> ${value}`;
    listElement.appendChild(listItem);
}
// Additional logs
console.log("Page loaded. Initiating displayGoalsList()");
displayGoalsList();

function saveGoal() {
    // Retrieve input values
    let goalName = document.getElementById("goal-name").value;
    let goalValue = document.getElementById("goal-amount").value;
    let goalDuration = document.getElementById("duration").value;

    // Create a unique key for each goal based on the timestamp
    let goalKey = "goal_" + Date.now();

    // Retrieve the budget from localStorage
    let expenseTrackerData = JSON.parse(localStorage.getItem("expense_tracker_DB"));
    let budget = expenseTrackerData ? expenseTrackerData.budget : 0;

    // Get the current date formatted as day/month/year
    let currentDate = new Date();
    let formattedCurrentDate = currentDate.toLocaleDateString("en-GB"); // Adjust the locale as needed

   

    // Create an object to represent the goal
    let goalData = {
        goalName: goalName,
        goalValue: goalValue,
        goalDuration: goalDuration,
        goalStatus: "active",
        budget: budget,
        currentDate: formattedCurrentDate,
      
    };

    // Store the goal data in local storage
    localStorage.setItem(goalKey, JSON.stringify(goalData));

    // Refresh the goal list
    displayGoalsList();
}
function clearGoalDatabase() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith("goal_")) {
            localStorage.removeItem(key);
        }
    }

    // Optionally refresh the goal list after clearing the goals
    displayGoalsList();
}
  // Refresh the goal list
  displayGoalsList();
function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Clear previous calendar
    calendarGrid.innerHTML = "";

    // Add current month header
    const currentMonthHeader = document.createElement("div");
    currentMonthHeader.classList.add("current-month");
    currentMonthHeader.textContent = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(firstDay);
    calendarGrid.appendChild(currentMonthHeader);

    // Add day cells
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day");
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.textContent = day;
        dayCell.addEventListener("click", () => handleDayClick(year, month, day));
        calendarGrid.appendChild(dayCell);
    }
}

function handleDayClick(year, month, day) {
    const selectedDate = new Date(year, month, day).toLocaleDateString();
    displayExpensesForSelectedDay(year, month, day);
    insightsNavContainer.style.display = 'none';

    calendar.style.display = 'none'

}
function displayExpensesForSelectedDay(selectedYear, selectedMonth, selectedDay) {
    let savedData;
    const storageKey = "expense_tracker_DB";

    try {
        savedData = JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
        console.error("Error parsing existing data:", error);
        savedData = [];
    }

    // Filter entries for the selected date
    const entriesForSelectedDate = savedData.filter(entry => {
        const entryDate = new Date(entry.expense_date);
        return (
            entryDate.getFullYear() === selectedYear &&
            entryDate.getMonth() === selectedMonth &&
            entryDate.getDate() === selectedDay
        );
    });

    // Check if there are entries for the selected date
    if (entriesForSelectedDate.length === 0) {
        alert(`No entries found for ${selectedYear}-${selectedMonth + 1}-${selectedDay}`);
        calendarGrid.style.display = 'block'; // Show the calendar grid
        return;
    }

    // Display the filtered entries
    displayCostsList(entriesForSelectedDate);

        // Update the title text
    dataTitle.textContent = `Expenses on ${selectedDay}/${selectedMonth + 1}/${selectedYear}`;

}

// Function to display the filtered entries
function displayCostsList(entries) {
    const dataDisplayList = document.getElementById("data-display-list");

    dataDisplayList.innerHTML = "";

    // Display each entry in the list
    entries.forEach(entry => {
        const listItem = document.createElement("div");
        listItem.classList.add("analytics-list-item"); 
        listItem.innerHTML = `
        <strong>Expense:</strong> 
        <span style="color: ${entry.expense_value >= 0 ? 'green' : 'red'};">€${entry.expense_value.toFixed(2)}</span>, 
        <strong>Category:</strong> ${entry.expense_category}, <strong>Type:</strong> ${entry.expense_type}, 
     
    `;

       
        dataDisplayList.appendChild(listItem);
    });
}
// Initial rendering for the current month
const currentDate = new Date();
generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  
    let initialBudget = 0;
    getDataByDateButton.addEventListener('click', function() {
        toggleCalendar();
        insightsButtonsContainer.style.display = 'none';
       clearDataDisplayList();
       dataTitle.innerHTML = "EXPENSES BY DATE";
       dataDisplayList.style.display = 'block'
       closeDataList.style.display = 'block';

        console.log('Button Clicked:', getDataByDateButton.id);
    });
    getDataGeneralButton.addEventListener('click', function() { 
        dataDisplayList.style.display ='block'       
        displayAnalyticsData();
        dataTitle.innerHTML = "GENERAL EXPENSES";
        insightsButtonsContainer.style.display = 'none';
        insightsNavContainer.style.display = 'none';
        closeDataList.style.display = 'block';

        console.log('Button Clicked:', getDataByDateButton.id);
    });
    function addButtonClickListeners(category, type) {
        document.getElementById(`${type.toLowerCase()}-button`).addEventListener("click", function () {
            manipulateExpenses(category, type);
        });
    }
    getDataByCategoryButton.addEventListener('click', function () {
        // Retrieve your expense data from local storage
        const savedData = JSON.parse(localStorage.getItem("expense_tracker_DB")) || [];
        dataTitle.innerHTML = "EXPENSES BY CATEGORY";
        insightsButtonsContainer.style.display = 'none';
        insightsNavContainer.style.display = 'none';
        closeDataList.style.display = 'block';

        // Calculate analytics data for expense categories
        const categoryAnalyticsData = calculateCategoryAnalyticsData(savedData);
        dataDisplayList.style.display = 'block'

        // Clear previous data in the list
        dataDisplayList.innerHTML = "";
    
        // Display the analytics data for expense categories
        displayCategoryAnalyticsList(categoryAnalyticsData);
    });
    
    openInsinghstScreen.addEventListener('click', function () {
        insinghstScreen.style.display = 'block';

    });
    getDataByTypeButton.addEventListener('click', function () {
        // Retrieve your expense data from local storage
        const savedTypeData = JSON.parse(localStorage.getItem("expense_tracker_DB")) || [];
        insightsButtonsContainer.style.display = 'none';
        dataDisplayList.style.display = 'block'
        insightsNavContainer.style.display = 'none';
        clearDataDisplayList();
        dataTitle.innerHTML = "EXPENSES BY TYPE";
        closeDataList.style.display = 'block';

        // Call the function to display analytics data for expense types
        const typeAnalyticsData = calculateTypeAnalyticsData(savedTypeData);

        // Clear previous data in the list
        dataDisplayList.innerHTML = "";
    
        // Display the analytics data for expense types
        displayTypeAnalyticsList(typeAnalyticsData);
    });
    function manipulateExpenses(category, type) {
        const costValue = parseFloat(costBudgetInput.value);

        if (isNaN(costValue) || costValue <= 0) {
            console.log("Please enter a valid amount.");
            return;
        }

        const currentDate = new Date().toLocaleDateString();
        const data = {
            expense_date: currentDate,
            expense_type: type,
            expense_category: category,
            expense_value: costValue,
        };

        let savedData;
        const storageKey = "expense_tracker_DB";
        try {
            savedData = JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch (error) {
            console.error("Error parsing existing data:", error);
            savedData = [];
        }

        savedData.push(data);
        localStorage.setItem(storageKey, JSON.stringify(savedData));

        initialBudget -= costValue;
        localStorage.setItem("budget", initialBudget);
        displayBudget(initialBudget);
        displayAnimationValue(costValue, "red", "-");

        console.log(`Current content of "${storageKey}" database after manipulation:`);
        console.log(localStorage.getItem(storageKey));

        costBudgetInput.value = "";
    }

    function displayBudget(remainingBudget) {
        const formattedBudget = remainingBudget.toFixed(2);
        budgetDisplay.textContent = `Remaining Budget: € ${formattedBudget}`;

        budgetDisplay.classList.remove("positive-budget", "negative-budget");

        if (remainingBudget >= 0) {
            budgetDisplay.classList.add("positive-budget");
        } else {
            budgetDisplay.classList.add("negative-budget");
        }
    }

    function readInitialBudget() {
        const storedBudget = localStorage.getItem("budget");

        if (storedBudget !== null) {
            initialBudget = parseFloat(storedBudget);
        }

        displayBudget(initialBudget);
    }

    function setPlannedBudget() {
        const plannedBudget = parseFloat(costBudgetInput.value);

        if (isNaN(plannedBudget) || plannedBudget < 0) {
            console.log("Please enter a valid planned budget.");
            return;
        }

        initialBudget += plannedBudget;
        localStorage.setItem("budget", initialBudget);
        displayBudget(initialBudget);
        displayAnimationValue(plannedBudget, "green","+");

        costBudgetInput.value = "";
    }
    function displayAnimationValue(value, color, preSign) {
        const animationDisplay = document.getElementById("input-animation-value-display");
    
        animationDisplay.textContent = `${preSign}${Math.abs(value)}`;
        animationDisplay.style.color = color;
    
        animationDisplay.classList.remove("fadeout-animation");
        void animationDisplay.offsetWidth;
        animationDisplay.classList.add("fadeout-animation");
    }

    addButtonClickListeners("Basic Needs", "Food");
    addButtonClickListeners("Basic Needs", "Transport");
    addButtonClickListeners("Basic Needs", "Education");
    addButtonClickListeners("Basic Needs", "Healthcare");
    addButtonClickListeners("Basic Needs", "Housing");
    addButtonClickListeners("Basic Needs", "Utilities");

    addButtonClickListeners("Luxury", "Entertainment");
    addButtonClickListeners("Luxury", "Travel");
    addButtonClickListeners("Luxury", "Dining");
    addButtonClickListeners("Luxury", "Gadgets");
    addButtonClickListeners("Luxury", "Clothing");
    addButtonClickListeners("Luxury", "Beauty");

    readInitialBudget();
    displayBudget(initialBudget);

    document.getElementById("update-budget-button").addEventListener("click", setPlannedBudget);


    /*display general data*/
    function displayAnalyticsData() {
        let savedData;
        const storageKey = "expense_tracker_DB";
        try {
            savedData = JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch (error) {
            console.error("Error parsing existing data:", error);
            savedData = [];
        }
    
        dataDisplayList.innerHTML = "";
        const totalSpend = savedData.reduce((total, entry) => total + parseFloat(entry.expense_value), 0);
        const analyticsData = calculateAnalyticsData(savedData, totalSpend);
        displayAnalyticsList(analyticsData);
    }
    
    /*clear data list*/
    function clearDataDisplayList() {
        const dataDisplayList = document.getElementById("data-display-list");
        dataDisplayList.innerHTML = "";
    }

    function calculateAnalyticsData(data, totalSpend) {
        const categories = {};
        const types = {};
        const remainingBudget = initialBudget - totalSpend;

        data.forEach((entry) => {
            // Calculate percentage spent
            const percentage = (entry.expense_value / totalSpend) * 100;
    
            // Calculate remaining budget
    
            // Update category data
            if (!categories[entry.expense_category]) {
                categories[entry.expense_category] = {
                    total: 0,
                    percentage: 0,
                };
            }
            categories[entry.expense_category].total += entry.expense_value;
            categories[entry.expense_category].percentage = percentage;
    
            // Update type data
            if (!types[entry.expense_type]) {
                types[entry.expense_type] = {
                    total: 0,
                    percentage: 0,
                };
            }
            types[entry.expense_type].total += entry.expense_value;
            types[entry.expense_type].percentage = percentage;
        });
    
        return {
            categories,
            types,
            totalSpend,
            remainingBudget,
        };
    }
    
    function displayAnalyticsList(analyticsData) {
        const categories = analyticsData.categories;
        const types = analyticsData.types;
        const totalSpend = analyticsData.totalSpend;
        const remainingBudget = analyticsData.remainingBudget;
    
        // Display category data
        for (const category in categories) {
            const categoryData = categories[category];
            const categoryItem = document.createElement("li");
            categoryItem.classList.add("analytics-list-item"); // Add a class to the list item
            categoryItem.innerHTML = `<strong>${category}</strong>, 
                Total: <span style="color: ${categoryData.total >= 0 ? 'green' : 'red'};">${categoryData.total.toFixed(2)}</span>, 
                Percentage: <span style="color: ${categoryData.percentage >= 0 ? 'green' : 'red'};">${categoryData.percentage.toFixed(2)}%</span>`;
            dataDisplayList.appendChild(categoryItem);
        }
    
        // Display type data
        for (const type in types) {
            const typeData = types[type];
            const typeItem = document.createElement("li");
            typeItem.classList.add("analytics-list-item"); // Add a class to the list item
            typeItem.innerHTML = `<strong>${type}</strong>: 
                Total: <span style="color: ${typeData.total >= 0 ? 'green' : 'red'};">€${typeData.total.toFixed(2)}</span>, 
                Percentage: <span style="color: ${typeData.percentage >= 0 ? 'green' : 'red'};">${typeData.percentage.toFixed(2)}%</span>`;
            dataDisplayList.appendChild(typeItem);
        }
    
        // Display total spend and remaining budget
        const totalSpendItem = document.createElement("li");
        totalSpendItem.classList.add("analytics-list-item"); // Add a class to the list item
        totalSpendItem.innerHTML = `<strong>Total Spent:</strong> 
            <span style="color: ${totalSpend >= 0 ? 'green' : 'red'};">€${totalSpend.toFixed(2)}</span>`;
        dataDisplayList.appendChild(totalSpendItem);
    
        const remainingBudgetItem = document.createElement("li");
        remainingBudgetItem.classList.add("analytics-list-item"); 
        remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> 
            <span style="color: ${remainingBudget >= 0 ? 'green' : 'red'};">€${remainingBudget.toFixed(2)}</span>`;
        dataDisplayList.appendChild(remainingBudgetItem);
    }
      /**
     * code to get and display data for CATEGORIES of expense to get
     */
// Function to display analytics data for expense categories
// Modify the event listener for the button

// Function to calculate analytics data for expense categories
function calculateCategoryAnalyticsData(data) {
    const categories = {};
    const totalSpend = data.reduce((total, entry) => total + parseFloat(entry.expense_value), 0);
    const remainingBudget = initialBudget - totalSpend;

    data.forEach((entry) => {
        // Calculate percentage spent
        const percentage = (entry.expense_value / totalSpend) * 100;

        // Update category data
        if (!categories[entry.expense_category]) {
            categories[entry.expense_category] = {
                total: 0,
                percentage: 0,
            };
        }
        categories[entry.expense_category].total += entry.expense_value;
        categories[entry.expense_category].percentage = percentage;
    });

    return {
        categories,
        totalSpend,
        remainingBudget,
    };
}

// Function to display analytics data for expense categories
function displayCategoryAnalyticsList(categoryAnalyticsData) {
    const categories = categoryAnalyticsData.categories;
    const totalSpend = categoryAnalyticsData.totalSpend;
    const remainingBudget = categoryAnalyticsData.remainingBudget;

    // Display category data
    for (const category in categories) {
        const categoryData = categories[category];
        const categoryItem = document.createElement("li");
        categoryItem.classList.add("analytics-list-item");
        categoryItem.innerHTML = `<strong>${category}</strong>, 
            Total: <span style="color: ${categoryData.total >= 0 ? 'green' : 'red'};">€${categoryData.total.toFixed(2)}</span>, 
            Percentage: <span style="color: ${categoryData.percentage >= 0 ? 'green' : 'red'};">${categoryData.percentage.toFixed(2)}%</span>`;
        dataDisplayList.appendChild(categoryItem);
    }

    // Display total spend and remaining budget for categories
    const totalSpendItem = document.createElement("li");
    totalSpendItem.classList.add("analytics-list-item");
    totalSpendItem.innerHTML = `<strong>Total Spent:</strong> 
        <span style="color: ${totalSpend >= 0 ? 'green' : 'red'};">€${totalSpend.toFixed(2)}</span>`;
    dataDisplayList.appendChild(totalSpendItem);

    const remainingBudgetItem = document.createElement("li");
    remainingBudgetItem.classList.add("analytics-list-item");
    remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> 
        <span style="color: ${remainingBudget >= 0 ? 'green' : 'red'};">€${remainingBudget.toFixed(2)}</span>`;
    dataDisplayList.appendChild(remainingBudgetItem);
}


    /**
     * code to get and display data for TYPES of expense to get
     */
// Function to display analytics data for all expense types
function displayTypeAnalyticsList(typeAnalyticsData) {
    const types = typeAnalyticsData.types;
    const totalSpend = typeAnalyticsData.totalSpend;
    const remainingBudget = typeAnalyticsData.remainingBudget;

    // Assuming you have a dataDisplayList element
    const dataDisplayList = document.getElementById("data-display-list");
    dataDisplayList.innerHTML = ""; // Clear previous data

    // Display type data for all expense types
    for (const expenseType in types) {
        const typeData = types[expenseType];
        const typeItem = document.createElement("li");
        typeItem.classList.add("analytics-list-item");
        typeItem.innerHTML = `<strong>${expenseType}</strong>: 
            Total: <span style="color: ${typeData.total >= 0 ? 'green' : 'red'};">€${typeData.total.toFixed(2)}</span>, 
            Percentage: <span style="color: ${typeData.percentage >= 0 ? 'green' : 'red'};">${typeData.percentage.toFixed(2)}%</span>`;
        dataDisplayList.appendChild(typeItem);
    }

    // Display total spend and remaining budget for types
    const totalSpendItem = document.createElement("li");
    totalSpendItem.classList.add("analytics-list-item");
    totalSpendItem.innerHTML = `<strong>Total Spent:</strong> 
        <span style="color: ${totalSpend >= 0 ? 'green' : 'red'};">€${totalSpend.toFixed(2)}</span>`;
    dataDisplayList.appendChild(totalSpendItem);

    const remainingBudgetItem = document.createElement("li");
    remainingBudgetItem.classList.add("analytics-list-item");
    remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> 
        <span style="color: ${remainingBudget >= 0 ? 'green' : 'red'};">€${remainingBudget.toFixed(2)}</span>`;
    dataDisplayList.appendChild(remainingBudgetItem);
}

function toggleCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.style.display = (calendar.style.display === 'none') ? 'block' : 'none';
}


function calculateTypeAnalyticsData(data) {
    const types = {};
    const totalSpend = data.reduce((total, entry) => total + parseFloat(entry.expense_value), 0);
    const remainingBudget = initialBudget - totalSpend;

    data.forEach((entry) => {
        // Calculate percentage spent
        const percentage = (entry.expense_value / totalSpend) * 100;

        // Update type data
        if (!types[entry.expense_type]) {
            types[entry.expense_type] = {
                total: 0,
                percentage: 0,
            };
        }
        types[entry.expense_type].total += entry.expense_value;
        types[entry.expense_type].percentage = percentage;
    });

    return {
        types,
        totalSpend,
        remainingBudget,
    };
}

// Function to display analytics data for expense types
function displayTypeAnalyticsList(typeAnalyticsData) {
    const types = typeAnalyticsData.types;
    const totalSpend = typeAnalyticsData.totalSpend;
    const remainingBudget = typeAnalyticsData.remainingBudget;

    // Display type data
    for (const type in types) {
        const typeData = types[type];
        const typeItem = document.createElement("li");
        typeItem.classList.add("analytics-list-item");
        typeItem.innerHTML = `<strong>${type}</strong>: 
            Total: <span style="color: ${typeData.total >= 0 ? 'green' : 'red'};">€${typeData.total.toFixed(2)}</span>, 
            Percentage: <span style="color: ${typeData.percentage >= 0 ? 'green' : 'red'};">${typeData.percentage.toFixed(2)}%</span>`;
        dataDisplayList.appendChild(typeItem);
    }

    // Display total spend and remaining budget for types
    const totalSpendItem = document.createElement("li");
    totalSpendItem.classList.add("analytics-list-item");
    totalSpendItem.innerHTML = `<strong>Total Spent:</strong> 
        <span style="color: ${totalSpend >= 0 ? 'green' : 'red'};">€${totalSpend.toFixed(2)}</span>`;
    dataDisplayList.appendChild(totalSpendItem);

    const remainingBudgetItem = document.createElement("li");
    remainingBudgetItem.classList.add("analytics-list-item");
    remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> 
        <span style="color: ${remainingBudget >= 0 ? 'green' : 'red'};">€${remainingBudget.toFixed(2)}</span>`;
    dataDisplayList.appendChild(remainingBudgetItem);
}
filterDataButton.addEventListener('click', function () {
    // Toggle the visibility of insights-buttons-container
    insightsButtonsContainer.style.display = (insightsButtonsContainer.style.display === 'none') ? 'flex' : 'none';
    // Close the calendar if it is open
    const calendar = document.getElementById('calendar');
    if (calendar.style.display !== 'none') {
        calendar.style.display = 'none';
    }
});



});


    // SCROLL TO TOP FUNCTION
    const scrollToTopButton = document.getElementById('scroll-top');
    const scrollButton = document.getElementById('scroll-button');
    
    // Show / hide button at 500px
    function toggleScrollToTopButton() {
      if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollToTopButton.style.display = 'block';
      } else {
        scrollToTopButton.style.display = 'none';
      }
    }
    
    // Return to top of page
    function scrollToTop() {
      document.body.scrollTop = 0; //Safari
      document.documentElement.scrollTop = 0; //Other browsers
    }
    
    // EventListener: toggles button visibility when scrolling
    window.addEventListener('scroll', toggleScrollToTopButton);
    
    // EventListener: scroll to top when clicked
    scrollButton.addEventListener('click', scrollToTop);



    // DIRECT TO CATEGORY ON HOMEPAGE
    // Get the element by its class name
    var elementToHide = document.querySelector('.about-text');

    // Check if the element is found
    if (elementToHide) {
        // Set the style property to hide the element
        elementToHide.style.display = 'none';
    }

    function scrollToSection(sectionId) {
        var section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }


// CONTACT FORM
function sendMail(contactForm) {
    emailjs.send("service_6a8xgnp","template_1nbot8m", {
    "from_name": contactForm.name.value,
    "from_lname": contactForm.lname.value,
    "from_email": contactForm.emailaddress.value,
    "file": contactForm.file.value,
    "message": contactForm.message.value,
    })
    .then(
        function(response) {
            console.log("Email successfully sent", response);
        },
        function(error) {
            console.log("Email failed to send", error);
        }
    );
        return false;
    }

    

   
