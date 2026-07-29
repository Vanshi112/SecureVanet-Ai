from pathlib import Path
import pandas as pd
ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / 'datasets' / 'raw'
PROCESSED_DIR = ROOT / 'datasets' / 'processed'
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def process_normal():
    raw_file = RAW_DIR / 'normal_run_data.txt'
    rows = []
    with open(raw_file, 'r') as f:
        for line in f:
            line = line.strip()
            if not line.startswith('Timestamp:'):
                continue
            try:
                parts = line.split()
                timestamp = float(parts[1])
                can_id = int(parts[3], 16)
                rtr = int(parts[4])
                dlc = int(parts[6])
                payload = [int(x, 16) for x in parts[7:]]
                while len(payload) < 8:
                    payload.append(0)
                payload = payload[:8]
                rows.append({'timestamp': timestamp, 'can_id': can_id, 'rtr': rtr, 'dlc': dlc, 'd0': payload[0], 'd1': payload[1], 'd2': payload[2], 'd3': payload[3], 'd4': payload[4], 'd5': payload[5], 'd6': payload[6], 'd7': payload[7], 'label': 0, 'attack_type': 'normal'})
            except Exception:
                continue
    df = pd.DataFrame(rows)
    output = PROCESSED_DIR / 'normal.csv'
    df.to_csv(output, index=False)
    print(f'Saved {output}')
    print(df.head())
    print(df.shape)
    return df

def process_attack_dataset(filename, attack_name, attack_label):
    raw_file = RAW_DIR / filename
    rows = []
    with open(raw_file, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split(',')
            try:
                timestamp = float(parts[0])
                can_id = int(parts[1], 16)
                dlc = int(parts[2])
                payload = [int(x, 16) for x in parts[3:-1]]
                while len(payload) < 8:
                    payload.append(0)
                payload = payload[:8]
                raw_label = parts[-1].strip()
                if raw_label == 'R':
                    label = 0
                    attack_type = 'normal'
                elif raw_label == 'T':
                    label = attack_label
                    attack_type = attack_name
                else:
                    continue
                rows.append({'timestamp': timestamp, 'can_id': can_id, 'rtr': 0, 'dlc': dlc, 'd0': payload[0], 'd1': payload[1], 'd2': payload[2], 'd3': payload[3], 'd4': payload[4], 'd5': payload[5], 'd6': payload[6], 'd7': payload[7], 'label': label, 'attack_type': attack_type})
            except Exception:
                continue
    df = pd.DataFrame(rows)
    output = PROCESSED_DIR / f'{attack_name}.csv'
    df.to_csv(output, index=False)
    print(f'Saved {output}')
    print(df.head())
    print(df.shape)
    return df
if __name__ == '__main__':
    print('=' * 80)
    print('Processing Normal Dataset')
    print('=' * 80)
    normal = process_normal()
    print('=' * 80)
    print('Processing DoS')
    print('=' * 80)
    dos = process_attack_dataset('DoS_dataset.csv', 'dos', 1)
    print('=' * 80)
    print('Processing Fuzzy')
    print('=' * 80)
    fuzzy = process_attack_dataset('Fuzzy_dataset.csv', 'fuzzy', 2)
    print('=' * 80)
    print('Processing Gear')
    print('=' * 80)
    gear = process_attack_dataset('gear_dataset.csv', 'gear', 3)
    print('=' * 80)
    print('Processing RPM')
    print('=' * 80)
    rpm = process_attack_dataset('RPM_dataset.csv', 'rpm', 4)
    all_data = pd.concat([normal, dos, fuzzy, gear, rpm], ignore_index=True)
    print('\n')
    print('=' * 80)
    print('FINAL DATASET SUMMARY')
    print('=' * 80)
    print(all_data['attack_type'].value_counts())
    print('\n')
    print(all_data['label'].value_counts())
    print('\n')
    print(all_data.info())
    print('\n')
    print(all_data.describe())
    all_output = PROCESSED_DIR / 'combined_multiclass.csv'
    all_data.to_csv(all_output, index=False)
    print(f'\nSaved combined dataset -> {all_output}')
