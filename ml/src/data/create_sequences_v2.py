from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

class SequenceGeneratorV2:

    def __init__(self, input_dir, output_dir, sequence_length=32, stride=16, train_ratio=0.7, val_ratio=0.15):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.sequence_length = sequence_length
        self.stride = stride
        self.train_ratio = train_ratio
        self.val_ratio = val_ratio
        self.scaler = StandardScaler()
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.recordings = []
        self.feature_columns = None

    def split_recording(self, df):
        n = len(df)
        train_end = int(n * self.train_ratio)
        val_end = train_end + int(n * self.val_ratio)
        train_df = df.iloc[:train_end].copy()
        val_df = df.iloc[train_end:val_end].copy()
        test_df = df.iloc[val_end:].copy()
        return (train_df, val_df, test_df)

    def load_recordings(self):
        print('=' * 70)
        print('Loading engineered recordings')
        print('=' * 70)
        csv_files = sorted(self.input_dir.glob('engineered_*.csv'))
        csv_files = [f for f in csv_files if f.stem != 'engineered_multiclass']
        if len(csv_files) == 0:
            raise FileNotFoundError(f'No csv files found inside {self.input_dir}')
        for file in csv_files:
            print(f'\nLoading {file.name}')
            df = pd.read_csv(file)
            required = {'label'}
            if not required.issubset(df.columns):
                raise ValueError(f'{file.name} missing required columns.')
            if self.feature_columns is None:
                self.feature_columns = [c for c in df.columns if c not in ['label', 'attack_type', 'timestamp']]
            train_df, val_df, test_df = self.split_recording(df)
            self.recordings.append({'name': file.stem, 'train': train_df, 'val': val_df, 'test': test_df})
            print(f'Train={len(train_df):,} Val={len(val_df):,} Test={len(test_df):,}')

    def fit_scaler(self):
        print('\nFitting StandardScaler...')
        train_features = []
        for recording in self.recordings:
            train_features.append(recording['train'][self.feature_columns])
        train_features = pd.concat(train_features, ignore_index=True)
        self.scaler.fit(train_features)
        joblib.dump(self.scaler, self.output_dir / 'feature_scaler.pkl')
        print('Scaler saved.')

    def transform_recordings(self):
        print('\nScaling recordings...')
        for recording in self.recordings:
            for split in ['train', 'val', 'test']:
                df = recording[split]
                X = self.scaler.transform(df[self.feature_columns])
                y = df['label'].to_numpy(dtype=np.int64)
                recording[split] = {'X': X, 'y': y}
        print('Scaling complete.')

    def create_sequences(self, X, y):
        sequences = []
        labels = []
        if len(X) < self.sequence_length:
            return (np.empty((0, self.sequence_length, X.shape[1]), dtype=np.float32), np.empty((0,), dtype=np.int64))
        for i in range(0, len(X) - self.sequence_length + 1, self.stride):
            sequences.append(X[i:i + self.sequence_length])
            labels.append(y[i + self.sequence_length - 1])
        return (np.asarray(sequences, dtype=np.float32), np.asarray(labels, dtype=np.int64))

    def build_dataset(self):
        print('\nGenerating sequences...')
        train_X = []
        train_y = []
        val_X = []
        val_y = []
        test_X = []
        test_y = []
        for recording in self.recordings:
            print(f"\nProcessing {recording['name']}")
            X_seq, y_seq = self.create_sequences(recording['train']['X'], recording['train']['y'])
            train_X.append(X_seq)
            train_y.append(y_seq)
            print(f'Train sequences : {len(X_seq):,}')
            X_seq, y_seq = self.create_sequences(recording['val']['X'], recording['val']['y'])
            val_X.append(X_seq)
            val_y.append(y_seq)
            print(f'Val sequences   : {len(X_seq):,}')
            X_seq, y_seq = self.create_sequences(recording['test']['X'], recording['test']['y'])
            test_X.append(X_seq)
            test_y.append(y_seq)
            print(f'Test sequences  : {len(X_seq):,}')
        train_X = np.concatenate(train_X, axis=0)
        train_y = np.concatenate(train_y, axis=0)
        val_X = np.concatenate(val_X, axis=0)
        val_y = np.concatenate(val_y, axis=0)
        test_X = np.concatenate(test_X, axis=0)
        test_y = np.concatenate(test_y, axis=0)
        permutation = np.random.permutation(len(train_X))
        train_X = train_X[permutation]
        train_y = train_y[permutation]
        self.train_X = train_X
        self.train_y = train_y
        self.val_X = val_X
        self.val_y = val_y
        self.test_X = test_X
        self.test_y = test_y
        print('\nSequence generation complete.')
        print(f'Train : {self.train_X.shape}')
        print(f'Val   : {self.val_X.shape}')
        print(f'Test  : {self.test_X.shape}')

    def balanced_sampling(self, X, y):
        import numpy as np
        np.random.seed(42)
        classes = np.unique(y)
        sampled_indices = []
        counts = []
        for cls in classes:
            idx = np.where(y == cls)[0]
            counts.append(len(idx))
        target = min(counts)
        print('\n' + '=' * 60)
        print('Balanced Sampling')
        print('=' * 60)
        for cls in classes:
            idx = np.where(y == cls)[0]
            sampled = np.random.choice(idx, target, replace=False)
            sampled_indices.extend(sampled)
            print(f'Class {cls}: {len(idx)} -> {target}')
        sampled_indices = np.array(sampled_indices)
        np.random.shuffle(sampled_indices)
        return (X[sampled_indices], y[sampled_indices])

    def save_dataset(self):
        print('\nSaving datasets...')
        np.save(self.output_dir / 'train_X.npy', self.train_X)
        np.save(self.output_dir / 'train_y.npy', self.train_y)
        np.save(self.output_dir / 'val_X.npy', self.val_X)
        np.save(self.output_dir / 'val_y.npy', self.val_y)
        np.save(self.output_dir / 'test_X.npy', self.test_X)
        np.save(self.output_dir / 'test_y.npy', self.test_y)
        print('Datasets saved successfully.')

    def run(self):
        self.load_recordings()
        self.fit_scaler()
        self.transform_recordings()
        self.build_dataset()
        self.save_dataset()
if __name__ == '__main__':
    INPUT_DIR = 'datasets/processed'
    OUTPUT_DIR = 'datasets/sequences'
    generator = SequenceGeneratorV2(input_dir=INPUT_DIR, output_dir=OUTPUT_DIR, sequence_length=32, stride=16)
    generator.run()
    print('\n' + '=' * 70)
    print('Sequence generation completed successfully.')
    print('=' * 70)
