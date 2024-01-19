// nav bar

$(document).ready(function () {
    // Add an event listener for the navbar-toggler button
    $('.navbar-toggler').click(function () {
        // Toggle the navigation menu when the toggler is clicked
        $('.navbar-collapse').toggleClass('show');
    });
});