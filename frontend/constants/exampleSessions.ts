import {
  Session,
  Interval,
  IntervalType,
  DateStruct,
  DateTime,
  Time,
} from "@/utils/dateTimeSession";
import { dataIndex } from "@constants/exampleData";

// Create a base date
const date = new DateStruct(2024, 12, 1);

// Create time instances for intervals
const time1 = new Time(9, 0, 0);
const time2 = new Time(10, 0, 0);
const time3 = new Time(10, 30, 0);
const time4 = new Time(11, 30, 0);
const time5 = new Time(12, 0, 0);
const time6 = new Time(13, 0, 0);
const time7 = new Time(14, 0, 0);
const time8 = new Time(15, 0, 0);

// Example intervals for "activity-1" (Orange)
const interval1 = new Interval(
  new DateTime(date, time1),
  new DateTime(date, time2),
  IntervalType.WORK,
);
const interval2 = new Interval(
  new DateTime(date, time2),
  new DateTime(date, time3),
  IntervalType.BREAK,
);

// Example intervals for "project-1" (Orange)
const interval3 = new Interval(
  new DateTime(date, time3),
  new DateTime(date, time4),
  IntervalType.WORK,
);

// Example intervals for "activity-2" (Green)
const interval4 = new Interval(
  new DateTime(date, time5),
  new DateTime(date, time6),
  IntervalType.WORK,
);

// New Session: "activity-1-1" (Green, deeply nested)
const interval5 = new Interval(
  new DateTime(date, time6),
  new DateTime(date, time7),
  IntervalType.WORK,
);

// New Session: "activity-1-1-1" (Green, deeply nested)
const interval6 = new Interval(
  new DateTime(date, time7),
  new DateTime(date, time8),
  IntervalType.BREAK,
);

// Create sessions
const session1 = new Session("activity-1", [interval1, interval2]); // Activity 1 (Orange)
const session2 = new Session("activity-2", [interval4]); // Activity 2 (Green)
const session3 = new Session("project-1", [interval3]); // Project 1 (Orange)
const session4 = new Session("activity-1-1", [interval5]); // Activity 1.1 (Green)
const session5 = new Session("activity-1-1-1", [interval6]); // Activity 1.1.1 (Green)

// Export sessions
export const exampleSessions = [
  session1,
  session2,
  session3,
  session4,
  session5,
];
