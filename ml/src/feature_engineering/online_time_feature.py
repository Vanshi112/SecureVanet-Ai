from collections import deque

class OnlineTimeFeatureEngineer:

    def __init__(self, rolling_window=1000):
        self.previous_timestamp = None
        self.start_timestamp = None
        self.packet_rates = deque(maxlen=rolling_window)

    def process(self, frame):
        timestamp = frame['timestamp']
        if self.start_timestamp is None:
            self.start_timestamp = timestamp
        if self.previous_timestamp is None:
            inter_arrival = 0.0
        else:
            inter_arrival = timestamp - self.previous_timestamp
        self.previous_timestamp = timestamp
        epsilon = 1e-06
        packet_rate = 1.0 / (inter_arrival + epsilon)
        self.packet_rates.append(packet_rate)
        rolling_rate = sum(self.packet_rates) / len(self.packet_rates)
        elapsed_time = timestamp - self.start_timestamp
        time_bucket = int(elapsed_time // 1.0)
        return {'inter_arrival_time': inter_arrival, 'packet_rate': packet_rate, 'rolling_rate': rolling_rate, 'elapsed_time': elapsed_time, 'time_bucket': time_bucket}
