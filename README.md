
# 🛡️Authentication System

🔴This Authentication System is made with NODEJS.🔴It Authenticates User and Direct them to Homescreen/Index page.🔴You can use `isAuthenticated` function to give access to only signed in users. 🔴 I used Pass Google OAuth2.0 to login/signup using Google. 🔴 I also used passport local to Authentication Users using classic singnup and sign in way. 
🔴I have used MongoDB as Database to store User Schema.
## 🪧Demo

https://dhananjayk-authentication-system.onrender.com/



## 📐Installation
1)Download Zip and Extract it and then run following commands in directory

2)Install my-project by running below command in console
```bash
  npm install
```
3)execute below command to run the server on localhost
```bash
  npm start
```
## 🪛Built With
🟠NODEJS 🟠ExpressJS 🟠MongoDB 🟠Mongoose 🟠EJS 🟠Google OAuth2.0 🟠Passport Local
## 🖼️Screenshots

🔴Landing Page
![Screenshot_1](https://user-images.githubusercontent.com/125384723/227831829-cef47e61-83f9-4ef4-955b-916c933b8cf6.png)

🔴Login Page
![Screenshot_2](https://user-images.githubusercontent.com/125384723/227832019-1cd74ffc-1f4b-4a7f-9188-a8fbc192ed4a.png)

🔴Sign Up Page
![Screenshot_3](https://user-images.githubusercontent.com/125384723/227832052-d719ef4f-6106-4a55-af6d-dd90cacf38dc.png)

🔴Home Page (after authentication)
![Screenshot_4](https://user-images.githubusercontent.com/125384723/227832062-5ba11558-9554-4c89-b442-cc36bda28074.png)

🔴Change Password Page
![Screenshot_5](https://user-images.githubusercontent.com/125384723/227832080-50eaeda9-4536-4e76-af89-a0d8f4dcb840.png)

## ✨Features

● Implemented the following for a user with respective html pages:
 
  * Sign up with email.
  * Sign in (you can redirect to a blank home page with a sign out and reset password button after sign in).
  * Log out. 
  * Change Password after sign in.
  * The password stored in the db is encrypted.
  * Google Login (Social authentication).
    
● Added Server Side Validations for:
  * Sign Up Page
    * Shows alert to user when user tries to signup with email that is already used by other user.
    * Shows alert to user regarding password when:
        * User enter password which has length lesser than 5 character.
        * When password do not match in password and confirm password field.
  * Sign In Page
    * Shows alert to user when user tries to login with email which is not signed up.
    * Shows alert to user when user enters wrong password.
    
● NOTE - I INTENTIONALLY REMOVED FRONT END VALIDATION AND DID NOT ADDED `REQUIRED` IN MY HTML CODE TO SHOWCASE MY SERVER SIDE VALIDATION.
## 🚦Version
1.0 - Running Succesfully with above feature.
## 👦Contact
🔗 Author - @Dhananjay Khodaskar 

ya695678@gmail.com / dhananjaykhodaskar27@gmai.com 

+91-7057218243

✅ Linkedin ✅ https://www.linkedin.com/in/dhananjay-khodaskar-5333b2239 ✅

✅ Github   ✅ https://github.com/DhananjayKhodaskar✅

