# Application Overview

This application utilizes `node` and `npm` for running and installing all dependencies. All names and other information are fictitious and intended for example purposes.

## FrontEnd

### Description
The frontend allows users to:
- View clinic details and doctor information
- Make appointments
- Contact the clinic
- Create an account and log in for additional features

Logged-in users can access:
- Appointment management
- Patient and employee management
- Contact messages
- App statistics

### Portal Login
To access the portal module:
- Create a patient account to view the patient perspective, or
- Use the following admin credentials for additional modules:
  - **Email:** `admin@admin.com`
  - **Password:** `admin1`

### How to Run the App
1. Navigate to the web app directory:
   ```sh
   cd front-end
   ```
2. Install all dependencies:
   ```sh
   npm install
   ```
3. Start the app:
   ```sh
   npm start
   ```
4. Open your browser and go to `http://localhost:4200/` to view the app.

## BackEnd

### How to Run the Server
1. Navigate to the server directory:
   ```sh
   cd back-end
   ```
2. Install the necessary node packages:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```

### Database
The application uses `database.db` to store details related to:
- Appointments
- Employees
- Patients
- Contact messages