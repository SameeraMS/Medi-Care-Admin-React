# **Medicare Doctor Channeling Website**

## 🏠 **Project Overview**
This is a **Medicare Doctor Channeling Website** that allows patients to book doctor appointments online and provides an admin dashboard for managing appointments, doctors, and users. The project is built using modern web technologies with a **Node.js & Express** backend and a **React** frontend.

## 🚀 **Tech Stack**
### **Frontend:**
- React
- Axios
- Tailwind CSS
- Typescript

### **Backend:**
- Node.js
- Express.js
- MongoDB

### **Other Dependencies:**
- JWT for authentication
- Bcrypt for password hashing
- Dotenv for environment variables

---

## 🔧 **Features**
### **Patient Features:**
- User registration & authentication (JWT-based login/logout)
- Browse available doctors and specialties
- Book doctor appointments
- View appointment history

### **Admin Dashboard Features:**
- Manage doctors (Add, Edit, Delete)
- Manage appointments
- Manage hospitals
- Manage users (patients)

---

## ⚙️ **Installation & Setup**

### **1️⃣ Clone the Repository**
*FrontEnd Client*
```sh
git clone https://github.com/SameeraMS/Medi-Care-React.git
```
*FrontEnd Admin*
```sh
git clone https://github.com/SameeraMS/Medi-Care-Admin-React.git
```
*Backend*
```sh
git clone https://github.com/SameeraMS/Medi-Care-Backend.git
```

### **2️⃣ Backend Setup**
```sh
npm install
```
#### **Environment Variables:**
Create a `.env` file in the backend directory and add the following:
```env
PORT=3000
DATABASE_URL=mongodb+srv://your-db-url
JWT_SECRET=your-secret-key
REFRESH_TOKEN=your-refresh-token
```
#### **Run Backend Server:**
```sh
npm start
```

#### **Run Frontends:**
```sh
npm run dev
```

## 👥 Contributors
- **sameera madushan** - [GitHub](https://github.com/SameeraMS)

---

## 📜 License
This project is licensed under the MIT License.

---