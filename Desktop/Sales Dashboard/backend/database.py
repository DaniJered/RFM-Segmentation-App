import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'rfm_data.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DROP TABLE IF EXISTS rfm_results')
    cursor.execute('''
        CREATE TABLE rfm_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id TEXT NOT NULL,
            recency_days INTEGER NOT NULL,
            frequency INTEGER NOT NULL,
            monetary REAL NOT NULL,
            r_score INTEGER NOT NULL,
            f_score INTEGER NOT NULL,
            m_score INTEGER NOT NULL,
            rfm_score TEXT NOT NULL,
            segment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
