# Server Monitoring Dashboard

This is a full-stack web application designed to monitor server health, resource utilization, alerts, and network traffic in real time. The backend is built using Flask, the frontend is developed in React, and Supabase is used as the backend database service.

---

## Live Deployment

- **Deployed using Render**: [https://server-dashboard-frontend1.onrender.com/](https://server-dashboard-frontend1.onrender.com/)  


---

## Features

- Display of total and categorized server alerts (Critical, Medium, Low)
- Monitoring of server resource usage including CPU, RAM, and disk space
- Real-time network traffic data visualization
- Server list with metadata and status (online/offline)
- Graphical representation of metrics using charts
- Integration with Supabase for data storage
- Mock data used for simulation and demonstration
- Deployed using Render (free-tier friendly)

---

## Technology Stack

**Backend**
- Python (Flask)
- SQLAlchemy
- Supabase (PostgreSQL)
- CORS, dotenv

**Frontend**
- React.js
- Axios (for HTTP requests)
- Recharts & Chart.js (for graphing)
- Supabase JS Client

---

## Setup Instructions

### Backend

1. Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Create a `.env` file:
    ```env
    DATABASE_URL=<your_supabase_postgres_url>
    PORT=10000
    ```
4. Start the backend:
    ```bash
    python app.py
    ```

### Frontend

1. Navigate to the `frontend/` directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file:
    ```env
    REACT_APP_SUPABASE_URL=https://<your-supabase-project>.supabase.co
    REACT_APP_SUPABASE_KEY=<your-supabase-anon-key>
    ```
4. Start the development server:
    ```bash
    npm start
    ```
5. To build for production:
    ```bash
    npm run build
    ```


