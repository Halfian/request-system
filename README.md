# Employee Request Management App

    It's a full-stack React + Firebase app that allows employees to submit requests and employers/admins to manage them.

## Features

    - Signup/Login page with Firebase Authentication (./public.loginForm-ss.png)
    - Firestore user profile to identify "employeeId, employeeEmail, employeeName, nad role"
    - Employees/Users can: (./public/requestForm-ss.png)
        - Submit new requests
        - View their requests list
    - Employers/Admins can: (./public/adminDashboard-ss.png)
        - View all requests in EmployerDashboard
        - Approve/Reject requests
        - Archive processed requests
    - Firestore security rules for role-based access
    - Responsive UI with TailwindCSS

## Tech Stack

    - Frontend: React + Vite, and TailwindCSS
    - Backend: Firebase Authentication, and Firestore
