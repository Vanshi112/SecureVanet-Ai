from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

class SequenceGenerator:

    def __init__(self, input_file, output_dir, sequence_length=32):
        self.input_file = Path(input_file)
        self.output_dir = Path(output_dir)
        self.sequence_length = sequence_length

    def load_dataset(self):
        print('=' * 60)
        print('Loading Engineered Dataset')
        print('=' * 60)
        self.df = pd.read_csv(self.input_file)
        print(f'Dataset Shape : {self.df.shape}')

    def prepare_features(self):
        print('\nPreparing Features...')
        drop_columns = ['label', 'attack_type', 'timestamp']
        self.X = self.df.drop(columns=drop_columns)
        self.y = self.df['label'].astype(np.int64)
        print(f'\nNumber of Features : {len(self.X.columns)}')
        print('\nFeature Names:')
        print(self.X.columns.tolist())
        print('\nClass Distribution:')
        print(self.y.value_counts().sort_index())

    def create_sequences(self, X, y):
        X = X.values
        y = y.values
        X_seq = []
        y_seq = []
        for i in range(len(X) - self.sequence_length + 1):
            X_seq.append(X[i:i + self.sequence_length])
            y_seq.append(y[i + self.sequence_length - 1])
        return (np.asarray(X_seq, dtype=np.float32), np.asarray(y_seq, dtype=np.int64))

    def run(self):
        self.load_dataset()
        self.prepare_features()
        print('\nSplitting Dataset (Per Class)...')
        train_parts = []
        val_parts = []
        test_parts = []
        train_labels = []
        val_labels = []
        test_labels = []
        for cls in sorted(self.y.unique()):
            idx = self.y[self.y == cls].index
            X_cls = self.X.loc[idx]
            y_cls = self.y.loc[idx]
            n = len(X_cls)
            train_end = int(0.7 * n)
            val_end = int(0.85 * n)
            train_parts.append(X_cls.iloc[:train_end])
            val_parts.append(X_cls.iloc[train_end:val_end])
            test_parts.append(X_cls.iloc[val_end:])
            train_labels.append(y_cls.iloc[:train_end])
            val_labels.append(y_cls.iloc[train_end:val_end])
            test_labels.append(y_cls.iloc[val_end:])
        X_train = pd.concat(train_parts, ignore_index=True)
        X_val = pd.concat(val_parts, ignore_index=True)
        X_test = pd.concat(test_parts, ignore_index=True)
        y_train = pd.concat(train_labels, ignore_index=True)
        y_val = pd.concat(val_labels, ignore_index=True)
        y_test = pd.concat(test_labels, ignore_index=True)
        print('\nNormalizing Features...')
        scaler = StandardScaler()
        X_train = pd.DataFrame(scaler.fit_transform(X_train), columns=self.X.columns)
        X_val = pd.DataFrame(scaler.transform(X_val), columns=self.X.columns)
        X_test = pd.DataFrame(scaler.transform(X_test), columns=self.X.columns)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        joblib.dump(scaler, self.output_dir / 'feature_scaler.pkl')
        print('Feature normalization complete.')
        print('\nGenerating Train Sequences...')
        train_X, train_y = self.create_sequences(X_train, y_train)
        np.save('debug_train_seq.npy', train_X[:1])
        np.save('debug_train_label.npy', train_y[:1])
        print('\nSaved debug training sequence.')
        print('Shuffling Training Sequences...')
        perm = np.random.permutation(len(train_X))
        train_X = train_X[perm]
        train_y = train_y[perm]
        print('Generating Validation Sequences...')
        val_X, val_y = self.create_sequences(X_val, y_val)
        print('Generating Test Sequences...')
        test_X, test_y = self.create_sequences(X_test, y_test)
        print('\nSaving NumPy Files...')
        np.save(self.output_dir / 'train_X.npy', train_X)
        np.save(self.output_dir / 'train_y.npy', train_y)
        np.save(self.output_dir / 'val_X.npy', val_X)
        np.save(self.output_dir / 'val_y.npy', val_y)
        np.save(self.output_dir / 'test_X.npy', test_X)
        np.save(self.output_dir / 'test_y.npy', test_y)
        print('\n' + '=' * 60)
        print('Sequence Generation Complete')
        print('=' * 60)
        print(f'Train      : {train_X.shape}')
        print(f'Validation : {val_X.shape}')
        print(f'Test       : {test_X.shape}')
        print('\nSaved to:')
        print(self.output_dir)
if __name__ == '__main__':
    ROOT = Path(__file__).resolve().parents[3]
    INPUT = ROOT / 'datasets' / 'processed' / 'engineered_multiclass.csv'
    OUTPUT = ROOT / 'datasets' / 'sequences'
    generator = SequenceGenerator(input_file=INPUT, output_dir=OUTPUT, sequence_length=32)
    generator.run()
