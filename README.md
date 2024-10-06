# CCHAT Frontend

This project is the frontend part of the Cong Nghe Moi application, built using React and bootstrapped with [Create React App](https://github.com/facebook/create-react-app). The application is designed to provide a seamless user experience for chatting and video calling functionalities.

## Features

-   User authentication (login, registration, password recovery)
-   Real-time chat functionality
-   Video calling capabilities
-   Group chat and messaging
-   User profile management
-   Responsive design for various devices

## Installation

Follow these steps to set up and run the project locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/mhxx307/cong-nghe-moi-frontend.git
    ```

2. Navigate to the project directory:

    ```bash
    cd cong-nghe-moi-frontend
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

4. Start the application:

    ```bash
    npm start
    ```

The application will run in development mode and can be accessed at [http://localhost:3000](http://localhost:3000). The page will automatically reload when you make changes to the code.

## Configuration

Before running the application, ensure that you have the necessary environment variables set up. You can create a `.env` file in the root of the project with the following variables:

```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
```

Replace the placeholders with your actual Firebase configuration values.

## Usage

After successfully installing and configuring the application, you
