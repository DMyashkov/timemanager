import type { SessionData } from "@/constants/interfaces";

export class DateStruct {
  year: number;
  month: number;
  day: number;

  // Constructor with overloads for creating a new DateStruct or copying an existing one
  constructor(year: number, month: number, day: number);
  constructor(date: DateStruct);
  constructor(yearOrDate: number | DateStruct, month?: number, day?: number) {
    if (yearOrDate instanceof DateStruct) {
      // Copy constructor logic
      this.year = yearOrDate.year;
      this.month = yearOrDate.month;
      this.day = yearOrDate.day;
    } else {
      // Regular constructor logic
      if (month === undefined || day === undefined) {
        throw new Error("Month and day must be provided.");
      }
      this.year = yearOrDate;
      this.month = month;
      this.day = day;
    }
  }

  static fromDate(date: Date): DateStruct {
    return new DateStruct(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );
  }

  equals(other: DateStruct): boolean {
    return (
      this.year === other.year &&
      this.month === other.month &&
      this.day === other.day
    );
  }

  getDayOfTheWeek(): number {
    const jsDate = new Date(this.year, this.month - 1, this.day);
    const day = jsDate.getDay();
    return (day + 6) % 7; // Adjust to make Monday = 0, Sunday = 6
  }

  static addDays(date: DateStruct, days: number): DateStruct {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    jsDate.setDate(jsDate.getDate() + days);
    return DateStruct.fromDate(jsDate);
  }

  isBefore(other: DateStruct): boolean {
    if (this.year !== other.year) return this.year < other.year;
    if (this.month !== other.month) return this.month < other.month;
    return this.day < other.day;
  }

  isAfter(other: DateStruct): boolean {
    if (this.year !== other.year) return this.year > other.year;
    if (this.month !== other.month) return this.month > other.month;
    return this.day > other.day;
  }

  isSameOrBefore(other: DateStruct): boolean {
    return this.equals(other) || this.isBefore(other);
  }

  isSameOrAfter(other: DateStruct): boolean {
    return this.equals(other) || this.isAfter(other);
  }

  toString(): string {
    return `${this.year}-${this.month}-${this.day}`;
  }

  getMonday(): DateStruct {
    const dayOfWeek = this.getDayOfTheWeek(); // 0 = Monday, 6 = Sunday
    return DateStruct.addDays(this, -dayOfWeek);
  }
}

export enum IntervalType {
  WORK = "Work",
  BREAK = "Break",
}

export class Time {
  hours: number;
  minutes: number;
  seconds: number;

  constructor(hours = 0, minutes = 0, seconds = 0) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  toStringLong(): string {
    return `${String(this.hours).padStart(2, "0")}:${String(this.minutes).padStart(2, "0")}:${String(this.seconds).padStart(2, "0")}`;
  }

  toString(): string {
    const hours = this.hours === 0 ? "" : `${this.hours}:`;
    return `${hours}${String(this.minutes).padStart(2, "0")}:${String(this.seconds).padStart(2, "0")}`;
  }

  toSeconds(): number {
    return this.hours * 3600 + this.minutes * 60 + this.seconds;
  }

  static fromSeconds(totalSeconds: number): Time {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return new Time(hours, minutes, seconds);
  }
}

export class DateTime {
  date: DateStruct;
  time: Time;

  constructor(date: DateStruct, time: Time) {
    this.date = date;
    this.time = time;
  }

  toString(): string {
    return `${this.date.toString()} ${this.time.toString()}`;
  }
}

export class Interval {
  startTime: DateTime;
  endTime: DateTime;
  type: IntervalType;

  constructor(startTime: DateTime, endTime: DateTime, type: IntervalType) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.type = type;
  }

  getDurationInSeconds(): number {
    const startSeconds = this.startTime.time.toSeconds();
    const endSeconds = this.endTime.time.toSeconds();
    return endSeconds - startSeconds;
  }

  toString(): string {
    return `${this.type}: ${this.startTime.toString()} - ${this.endTime.toString()}`;
  }
}

export class Session {
  private intervals: Interval[] = [];
  private totalWorkTime = 0;
  private totalBreakTime = 0;
  private tagId: number | null;
  private laps: DateTime[] = [];
  private startTime: number; // Unix timestamp in milliseconds
  private endTime: number; // Unix timestamp in milliseconds

  constructor(tagId: number | null, intervals?: Interval[]);
  constructor(sessionData: SessionData);
  constructor(
    activityIdOrData: number | SessionData | null,
    intervals: Interval[] = [],
  ) {
    if (typeof activityIdOrData === "number" || activityIdOrData === null) {
      // Regular constructor
      this.tagId = activityIdOrData;
      this.intervals = intervals;
      this.recalculateTotals();
      // Set timestamps from first and last intervals
      if (intervals.length > 0) {
        const firstInterval = intervals[0];
        const lastInterval = intervals[intervals.length - 1];
        this.startTime = new Date(
          firstInterval.startTime.date.year,
          firstInterval.startTime.date.month - 1, // JavaScript months are 0-based
          firstInterval.startTime.date.day,
          firstInterval.startTime.time.hours,
          firstInterval.startTime.time.minutes,
          firstInterval.startTime.time.seconds,
        ).getTime();
        this.endTime = new Date(
          lastInterval.endTime.date.year,
          lastInterval.endTime.date.month - 1, // JavaScript months are 0-based
          lastInterval.endTime.date.day,
          lastInterval.endTime.time.hours,
          lastInterval.endTime.time.minutes,
          lastInterval.endTime.time.seconds,
        ).getTime();
      } else {
        this.startTime = 0;
        this.endTime = 0;
      }
    } else {
      // Constructor from SessionData
      const sessionData = activityIdOrData;
      this.tagId = sessionData.tagId;
      this.totalWorkTime = sessionData.totalWorkTime;
      this.totalBreakTime = sessionData.totalBreakTime;
      this.intervals = sessionData.intervals;
      this.laps = sessionData.laps;
      this.startTime = sessionData.startTime;
      this.endTime = sessionData.endTime;
    }
  }

  sameSessionWithDifferentTagId(tagId: number): Session {
    return new Session(tagId, this.intervals);
  }

  // Convert to SessionData
  toSessionData(): SessionData {
    return {
      id: 0, // Let the database handle ID assignment
      tagId: this.tagId,
      startTime: this.startTime,
      endTime: this.endTime,
      totalWorkTime: this.totalWorkTime,
      totalBreakTime: this.totalBreakTime,
      intervals: this.intervals,
      laps: this.laps,
      deleted: 0,
      synced: 0,
    };
  }

  private recalculateTotals(): void {
    this.totalWorkTime = 0;
    this.totalBreakTime = 0;

    if (!this.intervals || this.intervals.length === 0) {
      return;
    }

    for (const interval of this.intervals) {
      const duration = interval.getDurationInSeconds();
      if (interval.type === IntervalType.WORK) {
        this.totalWorkTime += duration;
      } else if (interval.type === IntervalType.BREAK) {
        this.totalBreakTime += duration;
      }
    }
  }

  // Getters
  getWorkTime(): Time {
    return Time.fromSeconds(this.totalWorkTime);
  }

  getBreakTime(): Time {
    return Time.fromSeconds(this.totalBreakTime);
  }

  getTotalTime(): Time {
    return Time.fromSeconds(this.totalWorkTime + this.totalBreakTime);
  }

  getIntervals(): Interval[] {
    return this.intervals;
  }

  getTagId(): number {
    return this.tagId;
  }

  // Example toString() method
  toString(): string {
    return (
      `Session for Activity ID: ${this.tagId}\n` +
      `Work Time: ${this.getWorkTime().toString()}\n` +
      `Break Time: ${this.getBreakTime().toString()}\n` +
      `Total Time: ${this.getTotalTime().toString()}`
    );
  }

  getWorkToTotalRatio(): number {
    if (this.totalWorkTime === 0 && this.totalBreakTime === 0) {
      return 1; // Default to 100% work if no times are recorded
    }
    return this.totalWorkTime / (this.totalWorkTime + this.totalBreakTime);
  }

  getLapAmount(): number {
    if (!this.laps) {
      return 0;
    }
    return this.laps.length;
  }

  getStartTime(): Time {
    if (!this.intervals || this.intervals.length === 0) {
      return new Time(0, 0, 0);
    }
    return this.intervals[0].startTime.time;
  }

  getEndTime(): Time {
    if (!this.intervals || this.intervals.length === 0) {
      return new Time(0, 0, 0);
    }
    return this.intervals[this.intervals.length - 1].endTime.time;
  }

  getStartTimestamp(): number {
    return this.startTime;
  }

  getEndTimestamp(): number {
    return this.endTime;
  }
}
