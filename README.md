# School Vaccination Portal – Full Stack Application Documentation

## 1. System Overview

The School Vaccination Portal is a full-stack web application that facilitates the management of student vaccination records. Coordinators can log in, manage student data, organize vaccination drives, and generate reports and statistics.

**Tech Stack:**

* **Frontend:** React.js
* **Backend:** Node.js + Express (all microservices combined into one service)
* **Database:** MongoDB
* **Authentication:** JWT (Simulated login)
* **DevOps:** Docker, Kubernetes, Shell Scripts
* **API Documentation:** Swagger UI

---

## 2. Application Architecture

The application is structured into modular layers inside a single backend service:

### Backend Modules:

* `auth`: Simulated login and token issuance
* `students`: CRUD operations, CSV import, vaccination record
* `drives`: CRUD for vaccination drives
* `dashboard`: Aggregate stats and insights
* `reports`: Filtered data and export options




---

## 3. Frontend-Backend Interaction

| UI Page           | Backend API Endpoint                          |
| ----------------- | --------------------------------------------- |
| Login             | POST `/api/auth/login`                        |
| Students          | GET/POST `/api/students`, PUT `/students/:id` |
| Vaccinate Student | POST `/students/:id/vaccinate`                |
| Drives            | POST `/api/drives`, PUT `/api/drives/:id`     |
| Dashboard Stats   | GET `/api/dashboard/overview`                 |
| Reports           | GET `/api/reports`                            |
| Export Reports    | GET `/api/reports/export?format=csv/pdf/xls`  |

---

## 4. API Documentation

* Swagger UI available at: `http://localhost:4000/api-docs`
* Includes full documentation of all routes, responses, parameters, and status codes.


---

## 5. Database Schema

### Student Model:

```json
{
  studentID: String,
  name: String,
  class: String,
  gender: 'Male' | 'Female' | 'Other',
  dob: Date,
  vaccinationRecords: [
    {
      driveId: String,
      vaccineName: String,
      date: Date
    }
  ]
}
```

### Vaccination Drive Model:

```json
{
  id: String,
  vaccineName: String,
  date: Date,
  availableDoses: Number,
  grades: String,
  isExpired: Boolean
}
```


---

## 6. Assumptions

* Only one user role (coordinator)
* Vaccination records are embedded within the student document
* One vaccination per student per drive
* Backend is a combined monolithic service for simplicity

---



## 8. Run Instructions

### Backend Setup:

```bash
git clone https://github.com/Akshay-Bodhankar/bits-fsad-project.git
cd backend
npm install
npm run dev
```

### Frontend Setup:

```bash
cd frontend
npm install
npm start
```

---


## 9. GitHub Repository

**https://github.com/Akshay-Bodhankar/bits-fsad-project.git**

README includes:

* Project summary
* Technologies
* Setup instructions
* Run commands
* Demo video link
* Screenshots

---

## 10. Key Learnings

* 📦 **Modular Service Design:** Learned how to structure a full-stack backend by modularizing microservice logic into isolated domains (auth, students, drives, dashboard, reports) within a single Express service.

* 🔐 **Authentication with JWT:** Gained practical experience implementing stateless authentication using JWT, securing APIs, and validating tokens in protected routes.

* 🧠 **Schema Design with MongoDB:** Designed and normalized MongoDB schemas using Mongoose, including the use of embedded arrays for storing vaccination records within student documents.

* 🧊 **React Frontend Development:** Built a responsive, user-friendly frontend using React, including form handling, state management, and API integration for all key functionalities.

* 📊 **Aggregated Data Reporting:** Built real-time dashboard and reporting APIs using MongoDB aggregation pipelines to support insights like vaccination percentages, per-class breakdowns, and vaccine-specific statistics.

* 📤 **Export Functionality:** Implemented multi-format report exports (CSV, PDF, XLS) using libraries like `json2csv`, `pdfkit`, and `exceljs`, enhancing real-world file generation skills.

* 🧪 **API Documentation & Testing:** Used Swagger UI and Postman to test, debug, and document REST APIs clearly, helping communicate request/response structure to developers and testers.

* 🧩 **Data Validation & Edge Case Handling:** Implemented robust validation and error-handling logic, including duplicate vaccination checks, dose availability constraints, and expired drive handling.
