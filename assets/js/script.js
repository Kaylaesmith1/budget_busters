document.addEventListener("DOMContentLoaded", function () {
    const costBudgetInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");
    const dataDisplayList = document.getElementById("data-display-list");
    const getDataByDateButton = document.getElementById('get-data-by-date');
    const getDataGeneralButton = document.getElementById('get-data-by-date');
    const dataTitle = document.getElementById("data-analytics-title");
   


initializeCalendar();
  
    let initialBudget = 0;
    getDataByDateButton.addEventListener('click', function() {
        toggleCalendar();
        console.log('Button Clicked:', getDataByDateButton.id);
    });
    getDataGeneralButton.addEventListener('click', function() { 
        dataDisplayList.style.display ='block'       
        displayAnalyticsData();
        console.log('Button Clicked:', getDataByDateButton.id);
    });
    function addButtonClickListeners(category, type) {
        document.getElementById(`${type.toLowerCase()}-button`).addEventListener("click", function () {
            manipulateExpenses(category, type);
        });
    }

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
        budgetDisplay.textContent = `Remaining Budget: $${formattedBudget}`;

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
        categoryItem.innerHTML = `<strong>${category}</strong>, 
            Total: <span style="color: ${categoryData.total >= 0 ? 'green' : 'red'};">€${categoryData.total.toFixed(2)}</span>, 
            Percentage: <span style="color: ${categoryData.percentage >= 0 ? 'green' : 'red'};">${categoryData.percentage.toFixed(2)}%</span>`;
        dataDisplayList.appendChild(categoryItem);
    }

    // Display type data
    for (const type in types) {
        const typeData = types[type];
        const typeItem = document.createElement("li");
        typeItem.innerHTML = `<strong>${type}</strong>: 
            Total: <span style="color: ${typeData.total >= 0 ? 'green' : 'red'};">€${typeData.total.toFixed(2)}</span>, 
            Percentage: <span style="color: ${typeData.percentage >= 0 ? 'green' : 'red'};">${typeData.percentage.toFixed(2)}%</span>`;
        dataDisplayList.appendChild(typeItem);
    }

    // Display total spend and remaining budget
    const totalSpendItem = document.createElement("li");
    totalSpendItem.innerHTML = `<strong>Total Spent:</strong> 
        <span style="color: ${totalSpend >= 0 ? 'green' : 'red'};">€${totalSpend.toFixed(2)}</span>`;
    dataDisplayList.appendChild(totalSpendItem);

    const remainingBudgetItem = document.createElement("li");
    remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> 
        <span style="color: ${remainingBudget >= 0 ? 'green' : 'red'};">€${remainingBudget.toFixed(2)}</span>`;
    dataDisplayList.appendChild(remainingBudgetItem);
}

function toggleCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.style.display = (calendar.style.display === 'none') ? 'block' : 'none';
}

function initializeCalendar() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Populate the year-select with the current year and the next 10 years
    const yearSelect = document.getElementById('year-select');
    for (let i = currentYear; i <= currentYear + 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Set the default selected year to the current year
    yearSelect.value = currentYear;

    // Set the default selected month to the current month
    const monthSelect = document.getElementById('month-select');
    monthSelect.value = currentMonth;

    // Populate the calendar grid
    const calendarGrid = document.getElementById('calendar-grid');
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    }
}

  function getLocalStorageData(storageKey) {
    let savedData;
    try {
        const storedData = localStorage.getItem(storageKey);
        savedData = storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error("Error parsing existing data:", error);
        savedData = [];
    }
    console.log("Retrieved Data:", savedData);
    return savedData;
}
  
  function handleDayClick(day) {
    // Log the selected day, month, and year
    console.log(`Selected Date: ${selectedYear}-${selectedMonth + 1}-${day}`);

    // Check local storage for expenses on the selected date
    const selectedDate = new Date(selectedYear, selectedMonth, day).toLocaleDateString();
    const savedData = getLocalStorageData("expense_tracker_DB");

    const expensesForSelectedDate = savedData.filter(entry => entry.expense_date === selectedDate);

    if (expensesForSelectedDate.length > 0) {
        // If there are expenses for the selected date, display analytics data
        calculateDateSpecificAnalyticsData(expensesForSelectedDate, selectedDate);
    } else {
        // If there are no expenses for the selected date, you can handle it accordingly
        console.log("No expenses for the selected date.");
    }
}

function calculateDateSpecificAnalyticsData(expensesForSelectedDate, selectedDate) {
    dataDisplayForDateList.innerHTML = "";
    const totalSpend = expensesForSelectedDate.reduce((total, entry) => total + parseFloat(entry.expense_value), 0);
    const analyticsData = calculateAnalyticsData(expensesForSelectedDate, totalSpend);
    displayAnalyticsListForDate(analyticsData, selectedDate);
}

function displayAnalyticsListForDate(analyticsData, selectedDate) {
    const categories = analyticsData.categories;
    const types = analyticsData.types;
    const totalSpend = analyticsData.totalSpend;
    const remainingBudget = analyticsData.remainingBudget;

    // Display selected date and time
    const selectedDateItem = document.createElement("li");
    dataTitle.innerHTML = `<strong>Expenses for Date:</strong> ${selectedDate}`;
    dataDisplayForDateList.appendChild(selectedDateItem);

  // Display category data
  for (const category in categories) {
    const categoryData = categories[category];
    const categoryItem = document.createElement("li");
    categoryItem.innerHTML = `<strong>${category}</strong>, 
        Total: <span style="color: ${categoryData.total >= 0 ? 'green' : 'red'};">${categoryData.total.toFixed(2)} €</span>, 
        Percentage: <span style="color: ${categoryData.percentage >= 0 ? 'green' : 'red'};">${categoryData.percentage.toFixed(2)}%</span>`;
    dataDisplayForDateList.appendChild(categoryItem);
}

// Display type data
for (const type in types) {
    const typeData = types[type];
    const typeItem = document.createElement("li");
    typeItem.innerHTML = `<strong>${type}</strong>: 
        Total: <span style="color: ${typeData.total >= 0 ? 'green' : 'red'};">${typeData.total.toFixed(2)} €</span>, 
        Percentage: <span style="color: ${typeData.percentage >= 0 ? 'green' : 'red'};">${typeData.percentage.toFixed(2)}%</span>`;
    dataDisplayForDateList.appendChild(typeItem);
}

// Display total spend and remaining budget
const totalSpendItem = document.createElement("li");
totalSpendItem.innerHTML = `<strong>Total Spent:</strong> 
    <span style="color: ${totalSpend >= 0 ? 'green' : 'red'};">${totalSpend.toFixed(2)} €</span>`;
dataDisplayForDateList.appendChild(totalSpendItem);

const remainingBudgetItem = document.createElement("li");
remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> 
    <span style="color: ${remainingBudget >= 0 ? 'green' : 'red'};">${remainingBudget.toFixed(2)} €</span>`;
dataDisplayForDateList.appendChild(remainingBudgetItem);
}

displayAnalyticsData();


const filterDataButton = document.getElementById('filter-data-button');
const insightsButtonsContainer = document.getElementById('insights-buttons-container');

filterDataButton.addEventListener('click', function () {
    // Toggle the visibility of insights-buttons-container
    insightsButtonsContainer.style.display = (insightsButtonsContainer.style.display === 'none') ? 'flex' : 'none';
});

});


    // SCROLL TO TOP FUNCTION
    const scrollToTopButton = document.getElementById('scroll-top');
    const scrollButton = document.getElementById('scroll-button');
    
    // Show / hide button at 1000px
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


    // function ToggleDisplayById(displayItemId, displayOn) {
    //     let displayItemID = document.getElementById(displayItemId);
    //     if displayOn==True {
    //         displayItemId.classList.remove('noDisplay');
    //         displayItemId.classList.add('yesDisplay');
    //     }
    //     else  {
    //         displayItemId.classList.add('noDisplay');
    //         displayItemId.classList.remove('yesDisplay');
    //     }


    //     calendar.style.display = "none";
    //   }
