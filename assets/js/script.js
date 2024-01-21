document.addEventListener("DOMContentLoaded", function () {
    const costBudgetInput = document.getElementById("cost-value-input");
    const budgetDisplay = document.getElementById("budget-display");
    const dataDisplayList = document.getElementById("data-display-list");
    const getDataByDateButton = document.getElementById('get-data-by-date');
    const getDataGeneralButton = document.getElementById('get-data-general');
    const dataTitle = document.getElementById("data-analytics-title");
   
const filterDataButton = document.getElementById('filter-data-button');
const insightsButtonsContainer = document.getElementById('insights-buttons-container');

const calendarGrid = document.getElementById("calendar-grid");


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
        const listItem = document.createElement("li");
        listItem.textContent = `Expense: ${entry.expense_value}, Category: ${entry.expense_category}, Type: ${entry.expense_type}, Description: ${entry.description}`;
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
            Total: <span style="color: ${categoryData.total >= 0 ? 'green' : 'red'};">${categoryData.total.toFixed(2)}</span>, 
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


displayAnalyticsData();


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

    // POPUP SUCCESS / FAILURE MESSAGE
    // function popup() {
    //     var fname = document.getElementById('fullname');
    //     var lname = document.getElementById('lname');
    //     var email = document.getElementById('emailaddress');
    //     var attachment = document.getElementById('attachment');
    //     var message = document.getElementById('message');
    //     const success = document.getElementById('success');
    //     const danger = document.getElementById('danger');
    
    //     if (fname.value === '' || lname.value === '' || email.value === '' || message.value === '') {
    //         danger.style.display = 'block';
    //     } else {
    //         setTimeout(() => {
    //             fname.value = '';
    //             lname.value = '';
    //             email.value = '';
    //             attachment.value = '';
    //             message.value = '';
    //             success.style.display = 'none';
    //         }, 3000);
    
    //         success.style.display = 'block';
    //     }
    
    //     setTimeout(() => {
    //         danger.style.display = 'none';
    //     }, 3000);
    // }
    

    // CLEAR FORM FIELDS AFTER SUBMIT
