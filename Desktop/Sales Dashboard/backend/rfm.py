import pandas as pd
import numpy as np
from datetime import datetime

def calculate_rfm(df):
    """
    Parses a transaction DataFrame and calculates RFM scores and segments.
    Expected columns: customer_id, order_date, order_amount
    """
    # 1. Clean and standardise inputs
    df = df.copy()
    df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')
    df['order_amount'] = pd.to_numeric(df['order_amount'], errors='coerce')
    
    # Drop rows with critical missing information
    df = df.dropna(subset=['customer_id', 'order_date', 'order_amount'])
    
    if len(df) == 0:
        return pd.DataFrame(columns=[
            'customer_id', 'recency_days', 'frequency', 'monetary',
            'r_score', 'f_score', 'm_score', 'rfm_score', 'segment'
        ])
    
    # Ensure customer_id is a clean string
    df['customer_id'] = df['customer_id'].astype(str).str.strip()
    
    # Determine the reference 'today' date
    # Fallback to dataset max date + 1 day if all records are older historical data (e.g. before 2025)
    # This prevents recency scores from clustering into a single giant value (e.g. 1800 days ago)
    today = pd.to_datetime(datetime.now().date())
    max_order_date = df['order_date'].max()
    if pd.notnull(max_order_date) and max_order_date < pd.to_datetime('2025-01-01'):
        today = max_order_date + pd.Timedelta(days=1)
        
    # 2. Aggregate per customer
    rfm = df.groupby('customer_id').agg(
        recency_days=('order_date', lambda x: (today - x.max()).days),
        frequency=('order_date', 'count'),
        monetary=('order_amount', 'sum')
    ).reset_index()
    
    # Prevent crashing on empty aggregated dataframe
    if len(rfm) == 0:
        return rfm
        
    # Ensure recency_days is positive
    rfm['recency_days'] = rfm['recency_days'].apply(lambda x: max(0, int(x)))
    rfm['frequency'] = rfm['frequency'].astype(int)
    rfm['monetary'] = rfm['monetary'].astype(float)

    # 3. Quintile Scoring (1-5) using rank(method='first') to handle duplicates safely
    # R score: lower recency_days = higher score (5 is best, 1 is worst)
    rfm['r_score'] = pd.qcut(
        rfm['recency_days'].rank(method='first', ascending=True), 
        5, 
        labels=[5, 4, 3, 2, 1]
    ).astype(int)
    
    # F score: higher frequency = higher score (5 is best, 1 is worst)
    rfm['f_score'] = pd.qcut(
        rfm['frequency'].rank(method='first', ascending=True), 
        5, 
        labels=[1, 2, 3, 4, 5]
    ).astype(int)
    
    # M score: higher monetary = higher score (5 is best, 1 is worst)
    rfm['m_score'] = pd.qcut(
        rfm['monetary'].rank(method='first', ascending=True), 
        5, 
        labels=[1, 2, 3, 4, 5]
    ).astype(int)
    
    # Combine scores into a string representation
    rfm['rfm_score'] = rfm['r_score'].astype(str) + rfm['f_score'].astype(str) + rfm['m_score'].astype(str)
    
    # 4. Segment Assignment based on exact prompt specifications
    def assign_segment(row):
        r, f, m = row['r_score'], row['f_score'], row['m_score']
        if r == 5 and f == 5 and m == 5:
            return 'Champion'
        elif r >= 4 and f >= 3:
            return 'Loyal'
        elif r >= 3 and f <= 2:
            return 'Potential Loyal'
        elif r <= 2 and f >= 3:
            return 'At Risk'
        elif r <= 2 and f <= 2:
            return 'Lost'
        else:
            return 'Others'
            
    rfm['segment'] = rfm.apply(assign_segment, axis=1)
    return rfm
