import re
from pathlib import Path
import pandas as pd
LABEL_MAP = {'Attack_free_dataset.txt': 0, 'DoS_attack_dataset.txt': 1, 'Fuzzy_attack_dataset.txt': 2, 'Impersonation_attack_dataset.txt': 5}

class OTIDSConverter:

    def __init__(self, input_file, output_file, label):
        self.input_file = Path(input_file)
        self.output_file = Path(output_file)
        self.label = label
        self.pattern = re.compile('Timestamp:\\s*([\\d\\.]+)\\s+ID:\\s*([0-9A-Fa-f]+)\\s+\\d+\\s+DLC:\\s*(\\d+)\\s*(.*)')

    def parse_line(self, line):
        match = self.pattern.match(line.strip())
        if match is None:
            return None
        timestamp = float(match.group(1))
        can_id = int(match.group(2), 16)
        dlc = int(match.group(3))
        payload_tokens = match.group(4).split()
        payload_tokens = payload_tokens[:dlc]
        payload = [int(x, 16) for x in payload_tokens]
        while len(payload) < 8:
            payload.append(0)
        payload = payload[:8]
        return {'timestamp': timestamp, 'can_id': can_id, 'dlc': dlc, 'd0': payload[0], 'd1': payload[1], 'd2': payload[2], 'd3': payload[3], 'd4': payload[4], 'd5': payload[5], 'd6': payload[6], 'd7': payload[7], 'label': self.label}

    def convert(self):
        rows = []
        with open(self.input_file, 'r') as f:
            for line in f:
                sample = self.parse_line(line)
                if sample is not None:
                    rows.append(sample)
        df = pd.DataFrame(rows)
        self.output_file.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(self.output_file, index=False)
        print('=' * 70)
        print(self.input_file.name)
        print(df.shape)
        print(df.head())
        print('=' * 70)
if __name__ == '__main__':
    INPUT_DIR = Path('datasets/otids')
    OUTPUT_DIR = Path('datasets/processed')
    OUTPUT_NAMES = {'Attack_free_dataset.txt': 'normal_otids.csv', 'DoS_attack_dataset.txt': 'dos_otids.csv', 'Fuzzy_attack_dataset.txt': 'fuzzy_otids.csv', 'Impersonation_attack_dataset.txt': 'impersonation_otids.csv'}
    for filename, label in LABEL_MAP.items():
        converter = OTIDSConverter(input_file=INPUT_DIR / filename, output_file=OUTPUT_DIR / OUTPUT_NAMES[filename], label=label)
        converter.convert()
    print('\nOTIDS conversion completed successfully.')
