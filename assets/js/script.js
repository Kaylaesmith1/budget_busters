

document.addEventListener("DOMContentLoaded", function () {
    const costBudgetInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");
    const dataDisplayList = document.getElementById("data-display-list");
    const dataDisplayForDateList = document.getElementById("data-display-for-date-list");
    const dataTitle = document.getElementById("data-analytics-title");
    const displayDataButton = document.getElementById("display-data-button"); 
    const closeDataListButton = document.getElementById('close-data-for-date-button')


    const calendarIcon = document.getElementById("calendar-icon");
    const calendar = document.getElementById("calendar");
    const yearSelect = document.getElementById("year-select");
    const monthSelect = document.getElementById("month-select");
    const calendarGrid = document.getElementById("calendar-grid");
  
    let initialBudget = 0;

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
        displayAnimationValue(costValue, "red");

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
        displayAnimationValue(plannedBudget, "green");

        costBudgetInput.value = "";
    }

    function displayAnimationValue(value, color) {
        const animationDisplay = document.getElementById("input-animation-value-display");

        animationDisplay.textContent = `${value < 0 ? "-" : "+"}${Math.abs(value)}`;
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
            categoryItem.innerHTML = `<strong>${category}</strong>, €${categoryData.total.toFixed(2)}, Percentage: ${categoryData.percentage.toFixed(2)}%`;
            dataDisplayList.appendChild(categoryItem);
        }
    
        // Display type data
        for (const type in types) {
            const typeData = types[type];
            const typeItem = document.createElement("li");
            typeItem.innerHTML = `<strong>${type}</strong>: Total: €${typeData.total.toFixed(2)}, Percentage: ${typeData.percentage.toFixed(2)}%`;
            dataDisplayList.appendChild(typeItem);
        }
    
        // Display total spend and remaining budget
        const totalSpendItem = document.createElement("li");
        totalSpendItem.innerHTML = `<strong>Total Spent:</strong> €${totalSpend.toFixed(2)}`;        dataDisplayList.appendChild(totalSpendItem);
    
        const remainingBudgetItem = document.createElement("li");
        remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> €${remainingBudget.toFixed(2)}`;
        dataDisplayList.appendChild(remainingBudgetItem);
    }
  // Event listener for the "Analyze Data" button
  let isDataListDisplayed = false;

  // Event listener for the "ANALYSE" button
  displayDataButton.addEventListener("click", function () {
      if (isDataListDisplayed) {
          // Hide data and update button text
          dataDisplayList.style.display = "none";
          displayDataButton.textContent = "ANALYSE";
          isDataListDisplayed = false;
      } else {
          // Display data and update button text
          displayAnalyticsData(); // Display analytics for the selected day
          dataDisplayList.style.display = "block";
          displayDataButton.textContent = "Close";
          isDataListDisplayed = true;
      }
  });
    // Event listener for the "ANALYSE" button
    closeDataListButton.addEventListener("click", function () {
       dataDisplayForDateList.style.display = 'none'
        closeDataListButton.style.display = 'none'
        dataTitle.style.display = 'none'

    });


function toggleCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.style.display = calendar.style.display === "none" ? "block" : "none";
    if (calendar.style.display === "block") {
        renderCalendar();
    }
}


function renderCalendar() {
    const calendar = document.getElementById("calendar");
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    // Clear previous content
    calendar.innerHTML = "";

    // Render header
    const header = document.createElement("div");
    header.className = "calendar-header";
    header.textContent = `${monthNames[month]} ${year}`;
    calendar.appendChild(header);

    // Render days
    const daysContainer = document.createElement("div");
    daysContainer.className = "calendar-days";

    // Create an array to hold the days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Render day names
    for (let dayName of daysOfWeek) {
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";
        dayElement.textContent = dayName;
        daysContainer.appendChild(dayElement);
    }

    // Render blank spaces for the first days
    for (let i = 0; i < firstDay; i++) {
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";
        daysContainer.appendChild(dayElement);
    }

    // Render days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";
        dayElement.textContent = day;
        dayElement.addEventListener("click", () => onDayClick(year, month, day));
        daysContainer.appendChild(dayElement);
    }

    calendar.appendChild(daysContainer);
}

function onDayClick(year, month, day) {
    // You can implement logic to display costs for the selected date here
    alert(`Selected date: ${month + 1}/${day}/${year}`);
}



  let selectedYear = new Date().getFullYear();
  let selectedMonth = new Date().getMonth();

  function updateCalendar() {
    // Clear previous calendar
    calendarGrid.innerHTML = "";

    // Set the year and month in the selects
    yearSelect.value = selectedYear;
    monthSelect.value = selectedMonth;

    // Get the first day of the month
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

    // Get the last day of the month
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    // Create header row
    const headerRow = document.createElement("div");
    headerRow.classList.add("calendar-row");

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (const day of daysOfWeek) {
      const dayCell = document.createElement("div");
      dayCell.classList.add("calendar-cell");
      dayCell.textContent = day;
      headerRow.appendChild(dayCell);
    }

    calendarGrid.appendChild(headerRow);

    // Create calendar days
    let dayCounter = 1;
    for (let i = 0; i < 6; i++) {
      const calendarRow = document.createElement("div");
      calendarRow.classList.add("calendar-row");

      for (let j = 0; j < 7; j++) {
        const calendarCell = document.createElement("div");
        calendarCell.classList.add("calendar-cell");

        if (i === 0 && j < firstDay) {
          // Empty cells before the first day
          calendarCell.classList.add("empty-cell");
        } else if (dayCounter <= lastDay) {
          // Cells with days
          calendarCell.textContent = dayCounter;
          calendarCell.addEventListener("click", () => {
            // Handle day click (you can implement cost display logic here)
            console.log(`Clicked on ${selectedYear}-${selectedMonth + 1}-${dayCounter}`);
          });
          dayCounter++;
        }

        calendarRow.appendChild(calendarCell);
      }

      calendarGrid.appendChild(calendarRow);

      if (dayCounter > lastDay) {
        // Stop creating rows if we've displayed all days
        break;
      }
    }
  }

  function updateYearAndMonth() {
    selectedYear = parseInt(yearSelect.value);
    selectedMonth = parseInt(monthSelect.value);
    updateCalendar();
  }

  function initYearSelect() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  }

  function showCalendar() {
    calendar.style.display = "block";
    updateCalendar();
  }

  function hideCalendar() {
    calendar.style.display = "none";
  }

  // Initialize year select options
  initYearSelect();

  // Event listeners
  calendarIcon.addEventListener("click", showCalendar);
  yearSelect.addEventListener("change", updateYearAndMonth);
  monthSelect.addEventListener("change", updateYearAndMonth);
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
        categoryItem.innerHTML = `<strong>${category}</strong>, €${categoryData.total.toFixed(2)}, Percentage: ${categoryData.percentage.toFixed(2)}%`;
        dataDisplayForDateList.appendChild(categoryItem);
    }

    // Display type data
    for (const type in types) {
        const typeData = types[type];
        const typeItem = document.createElement("li");
        typeItem.innerHTML = `<strong>${type}</strong>: Total: €${typeData.total.toFixed(2)}, Percentage: ${typeData.percentage.toFixed(2)}%`;
        dataDisplayForDateList.appendChild(typeItem);
    }

    // Display total spend and remaining budget
    const totalSpendItem = document.createElement("li");
    totalSpendItem.innerHTML = `<strong>Total Spent:</strong> €${totalSpend.toFixed(2)}`;
    dataDisplayForDateList.appendChild(totalSpendItem);

    const remainingBudgetItem = document.createElement("li");
    remainingBudgetItem.innerHTML = `<strong>Remaining Budget:</strong> €${remainingBudget.toFixed(2)}`;
    dataDisplayForDateList.appendChild(remainingBudgetItem);
}
// Event listener for day clicks
calendarGrid.addEventListener("click", function (event) {
    const clickedCell = event.target;
    const day = parseInt(clickedCell.textContent);
  
    if (!isNaN(day)) {
      handleDayClick(day);
      hideCalendar();
      displayDataButton.style.display = 'none'
      closeDataListButton.style.display = 'block'
      dataDisplayForDateList.style.display = 'block'

    }
  });
  // Initially hide the calendar
  hideCalendar();
});