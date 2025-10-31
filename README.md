# **📝 Write-Board: Real-Time, Full-Stack Note Taking Application**

## **🌟 Overview**

**Write-Board** is a lightweight, self-contained, full-stack application designed for quick, persistent note-taking and management. It combines the simplicity of vanilla JavaScript for the user interface with the robustness of Node.js and MongoDB on the backend.

It is deployed as a unified service where the Express server is responsible for serving both the static HTML/CSS/JS files and the dynamic REST API.

### **Key Features**

✅ Vanilla Frontend: Fast, responsive, and minimalist interface built with plain HTML, CSS, and JavaScript.  
✅ Full CRUD Operations: Seamlessly create, read, update, and delete notes/entries.  
✅ Express API: Clean, structured RESTful endpoints for efficient data exchange.  
✅ MongoDB Persistence: Stores all notes reliably, ensuring data is saved across sessions.  
✅ Unified Deployment: Single server handles both frontend serving and API routing, perfect for platforms like Render.

## **🛠 Tech Stack**

The Write-Board application uses a robust combination of core web technologies and a modern backend.

| Category | Technology | Description |
| :---- | :---- | :---- |
| **Frontend** | **HTML5, CSS3, Vanilla JS** | Pure, lightweight code for maximum performance. |
| **Backend** | **Node.js** & **Express.js** | Creating a fast, scalable, and non-blocking API server. |
| **Database** | **MongoDB** & **Mongoose** | Flexible NoSQL database with object data modeling (ODM). |
| **Utilities** | **Dotenv, Cors, Path** | Essential packages for environment configuration and middleware. |

## **🚀 Local Setup & Installation**

Since the frontend is served by the backend, you only need to run one service to get the entire application working locally.

### **Prerequisites**

* Node.js (v14+)  
* MongoDB Instance (Local or Cloud like MongoDB Atlas)  
* Git

### **Step 1: Clone the Repository**

git clone \[https://github.com/Harish90090/Write-Board.git\](https://github.com/Harish90090/Write-Board.git)  
cd Write-Board

### **Step 2: Configure Environment Variables**

Create a file named .env in the root directory and add the following variables:

\# MongoDB Connection String (Replace with your Atlas or local URL)  
MONGO\_URI=mongodb+srv://\<username\>:\<password\>@clustername.mongodb.net/WriteBoardDB?retryWrites=true\&w=majority

\# Port for the Express server  
PORT=5001 

### **Step 3: Install Dependencies**

Navigate to the project root and install all server-side dependencies.

npm install

### **Step 4: Run the Server**

Start the application server:

node server.js

*The server will start on http://localhost:5001 (or the port defined in your .env file).*

### **Accessing the App**

Open your browser and navigate to:

🔗 **http://localhost:5001**

## **🌐 Deployment Notes (Render)**

This configuration is optimized for unified deployment environments like Render.

1. Build Command:  
   Since the frontend is static and ready-to-serve, the build command only needs to install dependencies:  
   npm install

2. **Start Command:**  
   node server.js

3. Mobile/Data Fetching Fix:  
   As noted during development, the frontend's JavaScript MUST use relative paths for API calls to function correctly on mobile devices and production deployments. Ensure all API calls use /api/notes instead of hardcoded full URLs.

## **🤝 Contributing**

Contributions, issues, and feature requests are welcome\!

1. Fork the Project.  
2. Create your Feature Branch (git checkout \-b feature/new-design).  
3. Commit your Changes (git commit \-m 'Feat: Added new search filter').  
4. Push to the Branch (git push origin feature/new-design).  
5. Open a Pull Request.

**Made with ❤️ by Harish**