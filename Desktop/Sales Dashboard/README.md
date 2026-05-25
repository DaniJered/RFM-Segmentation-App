# RFM Customer Segmentation Portal

A state-of-the-art CRM Customer Segmentation application designed in a futuristic dark-theme blockchain-wallet style. Powered by a **React (Vite) frontend**, **Python Flask REST API**, and a **SQLite database**, this application aggregates transaction data to classify customer loyalty profiles using statistical RFM (Recency, Frequency, Monetary) clustering.

---

## Key Features

- 🛸 **Sci-Fi Dark Mode UI**: A responsive blockchain-wallet inspired aesthetic loaded with translucent glassmorphic components, glowing neon visualizers, and tech status indicators.
- 📡 **Telemetry Upload Portal**: Cybernetic drag-and-drop CSV parser that converts raw transaction lines into segmented statistical models in real-time.
- 📊 **Dynamic Analytical Charts**:
  - *Cohort HEADCOUNT distributions* (using a glowing styled Recharts Bar Chart).
  - *Frequency vs Monetary clustering* (using a Recharts Scatter Plot mapped dynamically by customer segment).
  - *Animated vector wave visualizers* decorating the landing cockpit.
- 📂 **Structured Cohort profiles**: View Champion, Loyal, Potential Loyal, At Risk, and Lost segments detailing exact customer volumes and score averages.
- 🗃️ **Searchable Customer Database**: Complete spreadsheet showing transaction details, quintile scores (R, F, M), and segment tags, backed by client-side pagination and real-time query matching.
- 🔌 **API Diagnostics**: Real-time navbar heartbeat indicating active server connection and SQLite status.

---

## Folder Structure

```
Sales Dashboard/
├── backend/
│   ├── app.py             # Flask App (API endpoints, CORS, SQLite wrapper)
│   ├── rfm.py             # RFM logic using pandas (scoring, quintiles, segment case-logic)
│   ├── database.py        # Database schema initialization and helper functions
│   ├── requirements.txt   # Python packages: flask, flask-cors, pandas, numpy
│   └── rfm_data.db        # SQLite Database (generated on start/upload)
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js   # Axios client pointing to API URL
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── SegmentCard.jsx
│   │   │   └── Charts.jsx # Custom Recharts bar, scatter and line widgets
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Segments.jsx
│   │   │   └── Table.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css      # Custom dark-theme tokens and glassmorphism styling
│   ├── index.html
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js  # PostCSS configuration for Tailwind
│   └── vite.config.js     # Vite configuration
└── README.md
```

---

## Core Algorithms & Math Logic

### 1. RFM Scoring via Quintiles
Each customer is evaluated across three parameters:
- **Recency ($R$)**: Days elapsed since the last order. Low recency represents highly active customers.
- **Frequency ($F$)**: Total purchase orders executed.
- **Monetary ($M$)**: Sum of order transaction amounts.

To establish equal distribution and resolve issues with overlapping integer values (e.g. many clients with frequency = 1), values are pre-ranked using `rank(method='first')` before mapping into 5 equal-sized quintiles using `pd.qcut`:
- **R Score**: 5 (most recent, smallest Recency days) down to 1 (oldest, highest Recency days).
- **F Score**: 1 (least orders) up to 5 (most orders).
- **M Score**: 1 (least spending) up to 5 (most spending).

### 2. Segment Assignment Case-Logic
Once individual scores $[1-5]$ are calculated, segments are bound using the exact specified CRM rules:
- **Champion**: $R=5, F=5, M=5$
- **Loyal**: $R \ge 4, F \ge 3$
- **Potential Loyal**: $R \ge 3, F \le 2$
- **At Risk**: $R \le 2, F \ge 3$
- **Lost**: $R \le 2, F \le 2$
- **Others**: Any hybrid score exceptions (e.g., $R=3, F \ge 3$).

---

## Operating Instructions

### Prerequisites
1. **Python**: Version `3.10` or higher (tested on `3.12.10`).
2. **Node.js**: Version `18.0` or higher (tested on `22.21.0`).

### 1. Launching the Backend Server

1. Open a terminal, go into the `backend/` directory:
   ```bash
   cd backend
   ```
2. Activate the pre-configured virtual environment:
   - **Windows PowerShell**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Bash (Mac/Linux)**:
     ```bash
     source venv/bin/activate
     ```
3. Boot up the API microservice:
   ```bash
   python app.py
   ```
   *The server launches locally at `http://localhost:5000`.*

### 2. Launching the Frontend Portal

1. Open a separate terminal, go into the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The web application opens at `http://localhost:5173`.*

---

## Sample Data Requirements

To test the portal, you can feed a standard `.csv` file into the Uplink screen containing these headers:
```csv
customer_id,order_date,order_amount
USR-1002,2024-05-12,245.50
USR-1045,2024-05-14,95.00
USR-1002,2024-05-20,120.00
...
```
*Note: Any dates significantly in the past (before 2025) will be automatically evaluated from the dataset's maximum date + 1 day to ensure active scoring without cluster dilution.*
