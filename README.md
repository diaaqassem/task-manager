# task-manager
This project is a **Task Manager** built with Express and MongoDB using Mongoose. It allows users to register, log in, and manage their tasks. Each task has a title, description, status, and is linked to its owner (user).


# Task Manager API


## Features
- User authentication and authorization using JWT
- CRUD operations for tasks (Create, Read, Update, Delete)
- Tasks linked to their respective owners
- Password hashing using bcryptjs

## Technologies Used
- Express: Backend framework for building the API
- MongoDB & Mongoose: NoSQL database and ORM for modeling the task and user schema
- JWT (jsonwebtoken): For handling user authentication
- bcryptjs: For password hashing
- Validator: For validating user input

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud-based like MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/diaaqassem/task-manager.git
   cd task-manager
2.Install dependencies:
  npm install

3.Run the project:
  node app.js
