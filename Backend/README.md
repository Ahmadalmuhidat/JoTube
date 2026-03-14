# Basic Node.js API
This is a basic structure for a Node.js REST API where you can use it as a start point for your netxt project.

## Folder Structure
```bash
.
├── src/                        # Main application package.
│   ├── config/                 # Configuration files (e.g., database, constants)
│   ├── controllers/            # Controllers handle the logic between views and core.
│   ├── helper/                 # Contains reusable pieces of code.
│   ├── interfaces/             # Interfaces and abstract classes (useful for design patterns)
│   ├── routes/                 # API routes.
│   ├── middleware              # Custom middleware (e.g., JWT functions)
│   ├── services                # Business logic (e.g., mailer)
│   ├── server.js               # Main entry point.
├── package.json                # Project metadata and dependencies.
└── README.md                   # Project documentation.
```

## Prerequisites
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node package manager)
- [MySQL](https://www.mysql.com/) (Database)

## Setup
1. Clone the repository:
    ```bash
    git https://github.com/Ahmadalmuhidat/JoTube.git
    cd JoTube
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the root directory with your environment variables:
    ```
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=mydatabase
    ```
4. Set up your MySQL database:
    - Create a new MySQL database:

        ```sql
        CREATE DATABASE mydatabase;
        ```
    - Optionally, add some initial tables or data.

## Running the API
- Start the server:
    ```bash
    npm start
    ```
- Start in development mode with **nodemon**:
    ```bash
    npm run dev
    ```
The API will be running on `http://localhost:5000`.
