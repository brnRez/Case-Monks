import pandas as pd
from typing import Optional
df_metrics = pd.read_csv("data/metrics.csv")
df_metrics['date'] = pd.to_datetime(df_metrics['date'])
df_users = pd.read_csv("data/users.csv")

def get_user_by_email(email: str):
    user_query = df_users[df_users['email'] == email]
    if len(user_query) == 0:
        return None
    return user_query.iloc[0]

def get_metrics(role: str, page: int, size: int, sort_by: Optional[str] = None, sort_order: Optional[str] = None, start_date: Optional[str] = None, end_date: Optional[str] = None):
    df_filtered = df_metrics.copy()
    
    if role != 'admin':
        if 'cost_micros' in df_filtered.columns:
            df_filtered = df_filtered.drop(columns=['cost_micros'])
    
    if start_date:
        df_filtered = df_filtered[df_filtered['date'] >= pd.to_datetime(start_date)]
    if end_date:
        df_filtered = df_filtered[df_filtered['date'] <= pd.to_datetime(end_date)]
    
    if sort_by and sort_by in df_filtered.columns:
        df_filtered = df_filtered.sort_values(by=sort_by, ascending=(sort_order == "asc"))
        
    total_rows = len(df_filtered)
    start = (page - 1) * size
    end = start + size
    df_paginated = df_filtered.iloc[start:end]
    
    return {
        "page": page,
        "total_records": total_rows,
        "data": df_paginated.to_dict(orient="records")
    }