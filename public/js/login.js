const input = document.getElementById("email");
const form = document.getElementById("myForm");

// Add an event listener to the form's submit event
form.addEventListener("submit", function(event) {
// Convert the input value to lowercase
const inputValue = input.value.toLowerCase();

// Set the lowercase value back to the input element
input.value = inputValue;
});