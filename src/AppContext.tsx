import React, { createContext, useContext, useState } from 'react';
import type { User, WeightRecord, ExerciseRecord, DietRecord, CoachRecord, VideoRecord } from './types';

export type View = 'login' | 'register' | 'questionnaire' | 'dashboard' | 'upload' | 'health-profile' | 'exercise' | 'diet' | 'weight-checkin' | 'calendar' | 'coach-dashboard' | 'coach-record-upload' | 'video-upload' | 'dietitian-dashboard' | 'dietitian-student-detail' | 'videos-list' | 'video-player' | 'camp-stats';

interface AppState {
  user: User | null;
  currentView: View;
  weightRecords: WeightRecord[];
  exerciseRecords: ExerciseRecord[];
  dietRecords: DietRecord[];
  coachRecords: CoachRecord[];
  videoRecords: VideoRecord[];
  questionnaireAnswered: boolean;
  selectedStudentId: string | null;
  selectedVideoId: string | null;
  selectedDateStr: string | null;
  
  setUser: (user: User | null) => void;
  setCurrentView: (view: View) => void;
  setQuestionnaireAnswered: (v: boolean) => void;
  addWeightRecord: (record: WeightRecord) => void;
  addExerciseRecord: (record: ExerciseRecord) => void;
  addDietRecord: (record: DietRecord) => void;
  updateDietRecord: (id: string, updates: Partial<DietRecord>) => void;
  addCoachRecord: (record: CoachRecord) => void;
  addVideoRecord: (record: VideoRecord) => void;
  setSelectedStudentId: (id: string | null) => void;
  setSelectedVideoId: (id: string | null) => void;
  setSelectedDateStr: (date: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');
  const [questionnaireAnswered, setQuestionnaireAnswered] = useState(false);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecord[]>([]);
  const [dietRecords, setDietRecords] = useState<DietRecord[]>([]);
  const [coachRecords, setCoachRecords] = useState<CoachRecord[]>([]);
  const [videoRecords, setVideoRecords] = useState<VideoRecord[]>([]);
  
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{
      user, setUser,
      currentView, setCurrentView,
      questionnaireAnswered, setQuestionnaireAnswered,
      weightRecords, addWeightRecord: (r) => setWeightRecords(prev => [...prev, r]),
      exerciseRecords, addExerciseRecord: (r) => setExerciseRecords(prev => [...prev, r]),
      dietRecords, 
      addDietRecord: (r) => setDietRecords(prev => [...prev, r]),
      updateDietRecord: (id, updates) => setDietRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)),
      coachRecords, addCoachRecord: (r) => setCoachRecords(prev => [...prev, r]),
      videoRecords, addVideoRecord: (r) => setVideoRecords(prev => [...prev, r]),
      selectedStudentId, setSelectedStudentId,
      selectedVideoId, setSelectedVideoId,
      selectedDateStr, setSelectedDateStr
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
