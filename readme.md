# Todo App

This repository contains  frontend (React) and backend (Express.js) for todo app.

[App screenshots](https://github.com/Umang1499/es_assignment/blob/master/screenshots/shots.md)


## Frontend Structure

```
frontend/
├── src/                # main src code
│   ├── components/     # React components
│   │   ├── common/     # Shared components
│   │   └── todo/       # todo feature specifc components
│   ├── configs/        # Configuration files
│   ├── contexts/       # contexts providers
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Layout components
│   ├── services/       # API services
│   ├── theme/          # Theme configuration
│   ├── utils/          # Utility functions
│   └── views/          # Page components
├── .env                # Environment variables
├── .env.sample         # Environment variables template
└── package.json        # Project dependencies and scripts
```

## Backend Structure

```

backend/
├── node_modules/       # Dependencies
├── src/               # Source code
│   ├── configs/       # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middlewares/   # middlewares
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── validations/   # Input validation schemas
├── .env               # Environment variables
├── .env.sample        # Environment variables template
└── package.json       # Project dependencies and scripts

```

## Setup Instructions

1. Setup repo and install dependencies for both frontend and backend

    ```
    npm install
    ```

2. Copy the environment variables template and fill in the required environment variables in `.env`

3. Start the development server

    ```
    npm start
    ```

## Testing

Both frontend and backend applications use the `__tests__` directories for test files. Run tests using:

```
 npm run test
```

## Additional Information

- The frontend uses a MUI theme configuration located in `src/theme/`
- Backend follows the MVC (Model-View-Controller) pattern
- Environment variables are required for both applications to run properly with proper mongodb connection and default user.
