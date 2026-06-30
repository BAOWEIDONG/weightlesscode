import React, { createContext, useContext, useState } from 'react';
import type { User, WeightRecord, ExerciseRecord, DietRecord, CoachRecord, VideoRecord } from './types';

export type View = 'login' | 'register' | 'questionnaire' | 'dashboard' | 'upload' | 'health-profile' | 'exercise' | 'diet' | 'weight-checkin' | 'calendar' | 'coach-dashboard' | 'coach-record-upload' | 'video-upload' | 'dietitian-dashboard' | 'dietitian-student-detail' | 'dietitian-unannotated-list' | 'videos-list' | 'video-player' | 'camp-stats';

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

const MOCK_DIET_RECORDS: DietRecord[] = [
  {
    id: 'd1',
    studentId: 's1', // 王大锤
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
    meal: 'breakfast',
    description: '燕麦粥一碗，白煮蛋两个，一杯牛奶',
    photos: ['https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80'],
    dietitianComment: '早餐搭配很不错，碳水和蛋白质都有了，继续保持！',
  },
  {
    id: 'd2',
    studentId: 's1', // 李小花
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
    meal: 'lunch',
    description: '香煎鸡胸肉沙拉，油醋汁',
    photos: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80'],
    dietitianComment: '非常标准的减脂餐，蔬菜比例很好。',
  },
  {
    id: 'd3',
    studentId: 's1', // 张伟
    date: new Date().toISOString().split('T')[0], // today
    meal: 'dinner',
    description: '清炒时蔬，糙米饭半碗',
    photos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'],
    dietitianComment: '晚餐清淡适量，非常棒！',
  },
  {
    id: 'd4',
    studentId: 's1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
    meal: 'breakfast',
    description: '紫薯一块，豆浆一杯，水煮蛋一个',
    photos: ['https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80'],
    dietitianComment: '很好，建议再搭配一点小番茄或者黄瓜。',
  },
  {
    id: 'd5',
    studentId: 's1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
    meal: 'lunch',
    description: '番茄牛腩，少油少盐，半碗杂粮饭',
    photos: ['https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&q=80'],
    dietitianComment: '肉类选择不错，注意控制汤汁的摄入哦。',
  }
];

const MOCK_WEIGHT_RECORDS: WeightRecord[] = [
  {
    id: 'w1',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], // 3 days ago
    weight: 66.0,
  },
  {
    id: 'w1_2',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
    weight: 65.5,
  },
  {
    id: 'w2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
    weight: 65.2,
  },
  {
    id: 'w3',
    date: new Date().toISOString().split('T')[0], // today
    weight: 65.0,
  }
];

const MOCK_EXERCISE_RECORDS: ExerciseRecord[] = [
  {
    id: 'e1_0',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    type: '游泳',
    duration: 60,
    intensity: 4,
    coachComment: '游泳是有氧好选择，注意拉伸！',
  },
  {
    id: 'e1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    type: '跑步',
    duration: 30,
    intensity: 3,
    coachComment: '配速不错，下周可以尝试延长10分钟。',
  },
  {
    id: 'e2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    type: '力量训练',
    duration: 45,
    intensity: 5,
    coachComment: '动作标准度有提升，硬拉重量可以再突破一下！',
  },
  {
    id: 'e3',
    date: new Date().toISOString().split('T')[0],
    type: '瑜伽',
    duration: 40,
    intensity: 2,
    coachComment: '核心收紧得很好，拉伸很到位，继续保持！',
  }
];

const MOCK_VIDEO_RECORDS: VideoRecord[] = [
  {
    id: 'v1',
    title: '全身燃脂 HIIT',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    duration: 900,
    coachName: '李教练',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'v2',
    title: '晨间瑜伽唤醒',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    duration: 1200,
    coachName: '王教练',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'v3',
    title: '核心力量强化',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
    duration: 600,
    coachName: '张教练',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');
  const [questionnaireAnswered, setQuestionnaireAnswered] = useState(false);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(MOCK_WEIGHT_RECORDS);
  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecord[]>(MOCK_EXERCISE_RECORDS);
  const [dietRecords, setDietRecords] = useState<DietRecord[]>(MOCK_DIET_RECORDS);
  const [coachRecords, setCoachRecords] = useState<CoachRecord[]>([]);
  const [videoRecords, setVideoRecords] = useState<VideoRecord[]>(MOCK_VIDEO_RECORDS);
  
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
