const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmpassword');
const submitBtn = document.getElementById('submit-btn');
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

//TO VALIDATE USER INPUT WHILE CHANGING PASSWORD WITH JAVASCRIPT
function checkPasswordMatch() {

  if(passwordInput.value.length < 5){
     passwordError.innerHTML = "The minimum password length is 5 character."
  }else{
     passwordError.innerHTML = "";   
  }
  if(passwordInput.value !== confirmPasswordInput.value){
    confirmPasswordError.innerHTML="The passwords have to match.";
  }else{
    confirmPasswordError.innerHTML="";
  }
  

  if (passwordInput.value === confirmPasswordInput.value && passwordInput.value.length >= 5) {
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1.0";
    submitBtn.style.cursor="pointer";
  } else {
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
    submitBtn.style.cursor="auto";
  }
}

passwordInput.addEventListener('input', checkPasswordMatch);
confirmPasswordInput.addEventListener('input', checkPasswordMatch);