import os
import io
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection, init_db
from rfm import calculate_rfm

app = Flask(__name__)
# Enable CORS for frontend Vite development server (port 5173 by default)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Ensure database is initialised when server starts (optional, but good practice)
try:
    # We won't wipe the DB on startup, just ensure table exists or is created
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rfm_results (
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
    """)
    conn.commit()
    conn.close()
except Exception as e:
    print(f"Database pre-init warning: {e}")


def calculate_metrics_summary(rfm_df):
    """Utility to calculate metrics summary from an RFM dataframe."""
    total_customers = int(len(rfm_df))
    if total_customers == 0:
        return {
            "total_customers": 0,
            "segment_counts": {},
            "top20_revenue_pct": 0.0
        }
    
    # Segment counts
    segment_counts = rfm_df['segment'].value_counts().to_dict()
    
    # Top 20% revenue contribution
    total_revenue = rfm_df['monetary'].sum()
    top_20_count = max(1, int(total_customers * 0.2))
    top_20_revenue = rfm_df.nlargest(top_20_count, 'monetary')['monetary'].sum()
    top20_revenue_pct = round((top_20_revenue / total_revenue) * 100, 2) if total_revenue > 0 else 0.0
    
    return {
        "total_customers": total_customers,
        "segment_counts": segment_counts,
        "top20_revenue_pct": top20_revenue_pct
    }


def get_top20_revenue_pct_from_db(conn):
    """Calculates top 20% revenue pct on the fly from sqlite connection."""
    cursor = conn.cursor()
    cursor.execute("SELECT monetary FROM rfm_results ORDER BY monetary DESC")
    rows = cursor.fetchall()
    if not rows:
        return 0.0
    
    monetary_values = [row['monetary'] for row in rows]
    total_revenue = sum(monetary_values)
    if total_revenue == 0:
        return 0.0
        
    top_20_count = max(1, int(len(monetary_values) * 0.2))
    top_20_revenue = sum(monetary_values[:top_20_count])
    return round((top_20_revenue / total_revenue) * 100, 2)


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    Accepts CSV file upload, processes it using RFM segmentation,
    drops and recreates the SQLite table, stores results, and returns summary.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only CSV files are supported"}), 400
        
    try:
        # Read file stream
        stream = io.StringIO(file.stream.read().decode("utf-8"), newline=None)
        df = pd.read_csv(stream)
        
        # Verify required columns exist
        required_cols = ['customer_id', 'order_date', 'order_amount']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            return jsonify({
                "error": f"Missing required columns in CSV: {', '.join(missing_cols)}. Expected: {', '.join(required_cols)}"
            }), 400
            
        # Run RFM segment calculation
        rfm_df = calculate_rfm(df)
        
        if rfm_df.empty:
            return jsonify({"error": "CSV contains no valid customer data to process"}), 400
            
        # Initialize (wipe) database table
        init_db()
        
        # Save to SQLite db
        conn = get_db_connection()
        rfm_df.to_sql('rfm_results', conn, if_exists='append', index=False)
        conn.close()
        
        # Calculate summary JSON
        summary = calculate_metrics_summary(rfm_df)
        return jsonify(summary), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An error occurred while processing the file: {str(e)}"}), 500


@app.route('/api/results', methods=['GET'])
def get_results():
    """Returns all rows from rfm_results as JSON."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, customer_id, recency_days, frequency, monetary, 
                   r_score, f_score, m_score, rfm_score, segment, created_at 
            FROM rfm_results
            ORDER BY id ASC
        """)
        rows = cursor.fetchall()
        conn.close()
        
        results = []
        for r in rows:
            results.append({
                "id": r["id"],
                "customer_id": r["customer_id"],
                "recency_days": r["recency_days"],
                "frequency": r["frequency"],
                "monetary": round(r["monetary"], 2),
                "r_score": r["r_score"],
                "f_score": r["f_score"],
                "m_score": r["m_score"],
                "rfm_score": r["rfm_score"],
                "segment": r["segment"],
                "created_at": r["created_at"]
            })
            
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Database read failure: {str(e)}"}), 500


@app.route('/api/segments', methods=['GET'])
def get_segments():
    """Returns aggregated stats per segment: count, avg_recency, avg_frequency, avg_monetary."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT segment,
                   COUNT(*) as count,
                   AVG(recency_days) as avg_recency,
                   AVG(frequency) as avg_frequency,
                   AVG(monetary) as avg_monetary
            FROM rfm_results
            GROUP BY segment
            ORDER BY count DESC
        """)
        rows = cursor.fetchall()
        conn.close()
        
        segments_stats = []
        for r in rows:
            segments_stats.append({
                "segment": r["segment"],
                "count": r["count"],
                "avg_recency": round(r["avg_recency"], 2),
                "avg_frequency": round(r["avg_frequency"], 2),
                "avg_monetary": round(r["avg_monetary"], 2)
            })
            
        # Make sure segments that are in specifications but have 0 count are included for UI integrity
        defined_segments = ["Champion", "Loyal", "Potential Loyal", "At Risk", "Lost", "Others"]
        present_segments = [s["segment"] for s in segments_stats]
        for ds in defined_segments:
            if ds not in present_segments:
                segments_stats.append({
                    "segment": ds,
                    "count": 0,
                    "avg_recency": 0.0,
                    "avg_frequency": 0.0,
                    "avg_monetary": 0.0
                })
                
        return jsonify(segments_stats), 200
    except Exception as e:
        return jsonify({"error": f"Database query failure: {str(e)}"}), 500


@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """Returns dashboard KPIs: total_customers, champion_pct, at_risk_pct, top20_revenue_pct."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Total customers count
        cursor.execute("SELECT COUNT(*) FROM rfm_results")
        total_customers = cursor.fetchone()[0]
        
        if total_customers == 0:
            conn.close()
            return jsonify({
                "total_customers": 0,
                "champion_pct": 0.0,
                "at_risk_pct": 0.0,
                "top20_revenue_pct": 0.0
            }), 200
            
        # Champion count
        cursor.execute("SELECT COUNT(*) FROM rfm_results WHERE segment = 'Champion'")
        champion_count = cursor.fetchone()[0]
        
        # At Risk count
        cursor.execute("SELECT COUNT(*) FROM rfm_results WHERE segment = 'At Risk'")
        at_risk_count = cursor.fetchone()[0]
        
        # Calculate percentages
        champion_pct = round((champion_count / total_customers) * 100, 2)
        at_risk_pct = round((at_risk_count / total_customers) * 100, 2)
        
        # Top 20% revenue percentage
        top20_revenue_pct = get_top20_revenue_pct_from_db(conn)
        
        conn.close()
        
        return jsonify({
            "total_customers": total_customers,
            "champion_pct": champion_pct,
            "at_risk_pct": at_risk_pct,
            "top20_revenue_pct": top20_revenue_pct
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve dashboard metrics: {str(e)}"}), 500


if __name__ == '__main__':
    # Run server on port 5000 by default
    app.run(host='0.0.0.0', port=5000, debug=True)
