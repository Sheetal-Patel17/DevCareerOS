\# DevCareerOS



<p align="center">

&#x20; <strong>A full-stack career management platform for students and developers.</strong>

</p>



<p align="center">

&#x20; Track applications, skills, projects, DSA practice, interviews, goals, resumes, career analytics, and GitHub activity from one workspace.

</p>



<p align="center">

&#x20; <a href="https://devcareeros.netlify.app">Live Demo</a>

&#x20; ·

&#x20; <a href="https://github.com/Sheetal-Patel17/DevCareerOS">GitHub Repository</a>

&#x20; ·

&#x20; <a href="https://devcareeros-backend.onrender.com/api/health">Backend Health</a>

</p>



<p align="center">

&#x20; <img src="https://img.shields.io/github/actions/workflow/status/Sheetal-Patel17/DevCareerOS/ci.yml?branch=main\&label=CI" alt="CI Status" />

&#x20; <img src="https://img.shields.io/github/languages/top/Sheetal-Patel17/DevCareerOS" alt="Top Language" />

&#x20; <img src="https://img.shields.io/github/repo-size/Sheetal-Patel17/DevCareerOS" alt="Repository Size" />

&#x20; <img src="https://img.shields.io/github/license/Sheetal-Patel17/DevCareerOS" alt="License" />

</p>



\---



\## Overview



DevCareerOS is a full-stack web application designed to help students and developers manage their career preparation in one centralized platform.



Instead of using separate tools for job applications, coding practice, interviews, resumes, and career goals, DevCareerOS brings these workflows together with a single authenticated dashboard.



\---



\## Live Application



\*\*Frontend:\*\*

https://devcareeros.netlify.app



\*\*Backend Health:\*\*

https://devcareeros-backend.onrender.com/api/health



\*\*Repository:\*\*

https://github.com/Sheetal-Patel17/DevCareerOS



\---



\## Features



| Module             | What it does                                                                           |

| ------------------ | -------------------------------------------------------------------------------------- |

| Authentication     | Secure registration and login using JWT                                                |

| Job Applications   | Track companies, roles, application status, and progress                               |

| Skills Tracker     | Organize and monitor technical skill development                                       |

| Project Manager    | Maintain projects and monitor project progress                                         |

| DSA Tracker        | Create, edit, delete, search, filter, and track coding problems                        |

| Interview Tracker  | Manage interview schedules, rounds, preparation, and outcomes                          |

| Career Goals       | Track goals, priorities, deadlines, milestones, and progress                           |

| Resume Manager     | Manage multiple resume versions and their readiness status                             |

| Profile \& Settings | Manage professional information, career preferences, and profile links                 |

| Career Analytics   | View consolidated progress across career modules                                       |

| GitHub Activity    | View public GitHub profile, repositories, stars, forks, languages, and recent activity |



\---



\## Tech Stack



\### Frontend



\* React 19

\* Vite

\* React Router

\* CSS

\* Lucide React



\### Backend



\* Node.js

\* Express.js

\* REST API

\* JWT

\* bcryptjs

\* Mongoose



\### Database



\* MongoDB

\* MongoDB Atlas



\### Integrations



\* GitHub REST API



\### Development \& Deployment



\* Git

\* GitHub

\* GitHub Actions

\* Render

\* Netlify

\* Postman



\---



\## Architecture



```mermaid

flowchart LR

&#x20;   U\[User] --> FE\[React + Vite Frontend]

&#x20;   FE --> API\[Express REST API]

&#x20;   API --> AUTH\[JWT Authentication]

&#x20;   API --> DB\[(MongoDB Atlas)]

&#x20;   API --> GH\[GitHub REST API]

&#x20;   

&#x20;   FE --> MOD1\[Applications]

&#x20;   FE --> MOD2\[Skills]

&#x20;   FE --> MOD3\[Projects]

&#x20;   FE --> MOD4\[DSA]

&#x20;   FE --> MOD5\[Interviews]

&#x20;   FE --> MOD6\[Goals]

&#x20;   FE --> MOD7\[Resumes]

&#x20;   FE --> MOD8\[Analytics]

&#x20;   FE --> MOD9\[Profile \& Settings]

&#x20;   FE --> MOD10\[GitHub Activity]

&#x20;   

&#x20;   API --> MOD1

&#x20;   API --> MOD2

&#x20;   API --> MOD3

&#x20;   API --> MOD4

&#x20;   API --> MOD5

&#x20;   API --> MOD6

&#x20;   API --> MOD7

&#x20;   API --> MOD8

&#x20;   API --> MOD9

&#x20;   API --> MOD10



&#x20;   FE --> NET\[Netlify]

&#x20;   API --> RENDER\[Render]

```



\---



\## Project Structure



```text

DevCareerOS/

├── backend/

│   ├── src/

│   │   ├── config/

│   │   ├── controllers/

│   │   ├── middleware/

│   │   ├── models/

│   │   ├── routes/

│   │   └── server.js

│   └── package.json

│

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── services/

│   │   ├── styles/

│   │   ├── App.jsx

│   │   └── main.jsx

│   └── package.json

│

├── docs/

├── .github/

│   └── workflows/

│       └── ci.yml

│

├── .env.example

├── .gitignore

├── LICENSE

├── netlify.toml

└── README.md

```



\---



\## Authentication \& Security



DevCareerOS uses:



\* JWT-based authentication

\* Password hashing with bcryptjs

\* Protected backend routes

\* Authorization middleware

\* Environment variables for secrets

\* `.gitignore` protection for local environment files

\* Separate production frontend and backend environments



Sensitive credentials such as MongoDB connection strings and JWT secrets are not stored in the repository.



\---



\## API Modules



The backend is organized around REST endpoints for:



```text

/api/auth

/api/users

/api/dsa

/api/interviews

/api/goals

/api/resumes

/api/profile

/api/analytics

/api/github-activity

```



Protected endpoints require a valid JWT.



\---



\## Career Analytics



The Career Analytics module consolidates data from:



\* DSA practice

\* Career goals

\* Interviews

\* Resumes



It provides summary metrics, progress percentages, status breakdowns, difficulty distribution, interview outcomes, and resume readiness.



\---



\## GitHub Activity



The GitHub Activity module integrates public GitHub data to display:



\* Public repositories

\* Stars

\* Forks

\* Followers

\* Programming language distribution

\* Repository highlights

\* Recent public activity



The recent activity section is based on GitHub's public activity feed and should not be treated as an exact contribution graph.



\---



\## Local Development



\### Prerequisites



\* Node.js

\* npm

\* MongoDB Atlas account

\* Git



\### 1. Clone the repository



```bash

git clone https://github.com/Sheetal-Patel17/DevCareerOS.git

cd DevCareerOS

```



\### 2. Backend setup



```bash

cd backend

npm install

```



Create:



```text

backend/.env

```



Use the variables documented in:



```text

.env.example

```



Start the backend:



```bash

npm start

```



Development mode:



```bash

npm run dev

```



Backend:



```text

http://localhost:5000

```



Health check:



```text

http://localhost:5000/api/health

```



\### 3. Frontend setup



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



Frontend:



```text

http://localhost:5173

```



\---



\## Environment Variables



Example variables:



```env

MONGODB\_URI=your\_mongodb\_atlas\_connection\_string

JWT\_SECRET=your\_jwt\_secret

CLIENT\_URL=http://localhost:5173

```



For production, configure these values through the hosting provider's environment-variable settings.



Never commit real secrets.



\---



\## Production Deployment



\### Frontend



Deployed with Netlify.



```text

https://devcareeros.netlify.app

```



Build command:



```bash

npm run build

```



\### Backend



Deployed with Render.



```text

https://devcareeros-backend.onrender.com

```



Start command:



```bash

npm start

```



\### Database



MongoDB Atlas is used as the production database.



\---



\## Continuous Integration



GitHub Actions runs automatically on pushes to `main` and pull requests targeting `main`.



The CI workflow validates:



\* Backend JavaScript syntax

\* Frontend linting

\* Frontend production build



Workflow:



```text

.github/workflows/ci.yml

```



\---



\## Testing \& Validation



The application has been verified locally and in production for:



\* Registration and login

\* Protected routes

\* DSA CRUD operations

\* Interview management

\* Goal management

\* Resume management

\* Profile settings

\* Career Analytics

\* GitHub Activity

\* React Router direct routes

\* Production frontend build

\* Backend health endpoint

\* GitHub Actions CI



\---



\## Screenshots



Screenshots will be added to:



```text

docs/screenshots/

```



Recommended screenshots:



1\. Dashboard

2\. DSA Tracker

3\. Career Analytics

4\. GitHub Activity

5\. Profile Settings

6\. Interview Tracker



\---



\## Developer



\*\*Sheetal Patel\*\*



GitHub:

https://github.com/Sheetal-Patel17



LinkedIn:

https://www.linkedin.com/in/sheetal-patel17/



Portfolio:

https://sheetal-patel-portfolio.netlify.app/



\---



\## License



This project is licensed under the MIT License.



