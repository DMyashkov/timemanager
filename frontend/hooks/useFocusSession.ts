import { useState } from 'react';
import { useSessionContext } from '@/context/SessionContext';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { schema } from '@/db/schema';
import { Session } from '@/utils/dateTimeSession';
import { Interval, IntervalType, DateTime, Time, DateStruct } from '@/utils/dateTimeSession';

interface UseFocusSessionReturn {
  startFocusSession: (tagIds: string) => Promise<void>;
  endFocusSession: () => Promise<void>;
  isActive: boolean;
}

export function useFocusSession(): UseFocusSessionReturn {
  const [isActive, setIsActive] = useState(false);
  const { createSession } = useSessionContext();
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });

  const startFocusSession = async (tagIds: string): Promise<void> => {
    try {
      // Parse the tag IDs from the comma-separated string
      const tagIdArray = tagIds.split(',').map(id => parseInt(id.trim()));
      
      // Create a new session with the first tag ID
      const firstTagId = tagIdArray[0];
      if (!firstTagId) {
        throw new Error('No valid tag ID provided');
      }

      // Create a new session with an initial interval
      const now = new Date();
      const dateStruct = new DateStruct(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const startTime = new DateTime(
        dateStruct,
        new Time(now.getHours(), now.getMinutes(), now.getSeconds())
      );

      const initialInterval = new Interval(
        startTime,
        startTime, // Same as start time initially
        IntervalType.WORK
      );

      const session = new Session(
        firstTagId,
        [initialInterval],
        []
      );

      // Create the session in the database
      await createSession(db, session.toSessionData());
      
      setIsActive(true);
    } catch (error) {
      console.error('Error starting focus session:', error);
      throw error;
    }
  };

  const endFocusSession = async (): Promise<void> => {
    try {
      // TODO: Implement focus session end logic
      console.log('Ending focus session');
      setIsActive(false);
    } catch (error) {
      console.error('Error ending focus session:', error);
      throw error;
    }
  };

  return {
    startFocusSession,
    endFocusSession,
    isActive,
  };
} 