from collections import defaultdict, deque

class OnlineCANFeatureEngineer:

    def __init__(self, rolling_window=100):
        self.total_packets = 0
        self.can_counts = defaultdict(int)
        self.seen_can_ids = set()
        self.previous_can_id = None
        self.rolling_counts = deque(maxlen=rolling_window)

    def process(self, frame):
        can_id = frame['can_id']
        self.total_packets += 1
        self.can_counts[can_id] += 1
        canid_freq = self.can_counts[can_id]
        canid_normalise = canid_freq / self.total_packets
        is_new = int(can_id not in self.seen_can_ids)
        self.seen_can_ids.add(can_id)
        if self.previous_can_id is None:
            changed = 0
        else:
            changed = int(can_id != self.previous_can_id)
        self.previous_can_id = can_id
        self.rolling_counts.append(canid_freq)
        rolling_can_frequency = sum(self.rolling_counts) / len(self.rolling_counts)
        return {'canid_freq': canid_freq, 'canid_normalise': canid_normalise, 'isnew_can_id': is_new, 'can_id_changed': changed, 'rolling_can_frequency': rolling_can_frequency}
