"""Synthetic data generator for Rotating Diagnosis validation.

Creates realistic vibration and current CSV files with meta headers,
valid session-based file names, and different distributions for normal vs fault.
"""
import os
from pathlib import Path
import numpy as np
import pandas as pd

# Define tasks and motors (from src/config.py)
TASKS = {
    "축정렬불량":  {"motor": "L-DSF-01",   "capacity": "2.2kW"},
    "회전체불평형": {"motor": "L-EF-04",    "capacity": "2.2kW"},
    "베어링불량":  {"motor": "L-SF-04",    "capacity": "2.2kW"},
    "벨트느슨함":  {"motor": "R-EF-05",    "capacity": "2.2kW"},
}

PROJECT_ROOT = Path(__file__).resolve().parent
DATA_ROOT = PROJECT_ROOT / "data" / "aihub"
VIB_ROOT = DATA_ROOT / "vibration"
CUR_ROOT = DATA_ROOT / "current"

# 9 lines of metadata header as required by config.META_LINES
META_HEADER = [
    "Generated Synthetic Metadata Line 1",
    "Generated Synthetic Metadata Line 2",
    "Generated Synthetic Metadata Line 3",
    "Generated Synthetic Metadata Line 4",
    "Generated Synthetic Metadata Line 5",
    "Generated Synthetic Metadata Line 6",
    "Generated Synthetic Metadata Line 7",
    "Generated Synthetic Metadata Line 8",
    "Generated Synthetic Metadata Line 9",
]

def generate_csv_file(file_path: Path, is_vibration: bool, is_fault: bool, num_rows: int = 200):
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Generate synthetic signal data
    np.random.seed(int(file_path.stem[-3:]) + (99 if is_fault else 0))
    time_col = np.linspace(0, 1.0, num_rows)
    
    if is_vibration:
        # Vibration: 2 columns (Time, Signal)
        # Fault has larger amplitude/std
        scale = 3.5 if is_fault else 1.0
        signal = np.random.normal(loc=0.0, scale=scale, size=num_rows)
        # Add some sine waves
        signal += np.sin(2 * np.pi * 10 * time_col) * (2.0 if is_fault else 0.5)
        df_data = pd.DataFrame({0: time_col, 1: signal})
    else:
        # Current: 4 columns (Time, U, V, W)
        # Fault has higher unbalance and noise
        scale = 1.5 if is_fault else 0.2
        mean_u = 6.5 if is_fault else 5.0
        mean_v = 7.0 if is_fault else 5.0
        mean_w = 5.8 if is_fault else 5.0
        u = np.random.normal(loc=mean_u, scale=scale, size=num_rows)
        v = np.random.normal(loc=mean_v, scale=scale, size=num_rows)
        w = np.random.normal(loc=mean_w, scale=scale, size=num_rows)
        df_data = pd.DataFrame({0: time_col, 1: u, 2: v, 3: w})
        
    # Write metadata header first, then the CSV data
    with open(file_path, "w", encoding="utf-8", newline="") as f:
        for line in META_HEADER:
            f.write(line + "\n")
        df_data.to_csv(f, header=False, index=False)

def main():
    print("Generating synthetic data for Rotating Diagnosis pipeline...")
    
    # Generate 5 sessions of normal and 5 sessions of fault for each task & sensor
    num_sessions = 5
    
    for task_name, info in TASKS.items():
        motor = info["motor"]
        capacity = info["capacity"]
        
        print(f"Task: {task_name} | Motor: {motor} | Capacity: {capacity}")
        
        # 1. Vibration
        for is_fault, label_folder in [(False, "정상"), (True, task_name)]:
            folder = VIB_ROOT / capacity / motor / label_folder
            for s in range(num_sessions):
                # Filename pattern matching: STFMK-20201105-LW15-{session_id:04d}_20201125_14{s:02d}00_001.csv
                fname = f"STFMK-20201105-LW15-2055_20201125_14{s:02d}00_{100 + s:03d}.csv"
                generate_csv_file(folder / fname, is_vibration=True, is_fault=is_fault)
                
        # 2. Current
        for is_fault, label_folder in [(False, "정상"), (True, task_name)]:
            folder = CUR_ROOT / capacity / motor / label_folder
            for s in range(num_sessions):
                # Filename pattern matching: STFMK-20201105-15-{session_id:04d}_20201125_14{s:02d}00_001.csv
                fname = f"STFMK-20201105-15-2055_20201125_14{s:02d}00_{100 + s:03d}.csv"
                generate_csv_file(folder / fname, is_vibration=False, is_fault=is_fault)
                
    print("Synthetic data generation completed successfully!")

if __name__ == "__main__":
    main()
