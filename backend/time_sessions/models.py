from django.db import models
import json

class Session(models.Model):
    id = models.AutoField(primary_key=True)
    tag_id = models.IntegerField()  # Foreign key reference to ActivityData
    total_work_time = models.IntegerField(default=0)  # in seconds
    total_break_time = models.IntegerField(default=0)  # in seconds
    intervals = models.JSONField(default=list)  # Store intervals as JSON
    laps = models.JSONField(default=list)  # Store laps as JSON

    def __str__(self):
        return f'Session for Activity ID: {self.tag_id}'

    def get_work_time(self):
        return self.total_work_time

    def get_break_time(self):
        return self.total_break_time

    def get_total_time(self):
        return self.total_work_time + self.total_break_time

    def get_work_to_total_ratio(self):
        if self.get_total_time() == 0:
            return 0
        return self.total_work_time / self.get_total_time()

    def get_lap_amount(self):
        return len(json.loads(self.laps))

    def get_start_time(self):
        intervals = json.loads(self.intervals)
        if not intervals:
            return None
        return intervals[0]['start_time']['time']

    def get_end_time(self):
        intervals = json.loads(self.intervals)
        if not intervals:
            return None
        return intervals[-1]['end_time']['time']
