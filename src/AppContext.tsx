import React, { createContext, useContext, useState } from 'react';
import type { User, WeightRecord, ExerciseRecord, DietRecord, CoachRecord, CoachActivityRecord } from './types';

export type View = 'login' | 'register' | 'questionnaire' | 'dashboard' | 'upload' | 'health-profile' | 'exercise' | 'diet' | 'weight-checkin' | 'calendar' | 'coach-dashboard' | 'coach-record-upload' | 'activity-upload' | 'dietitian-dashboard' | 'dietitian-student-detail' | 'dietitian-unannotated-list' | 'activities-list' | 'video-player' | 'camp-stats';

interface AppState {
  user: User | null;
  currentView: View;
  weightRecords: WeightRecord[];
  exerciseRecords: ExerciseRecord[];
  dietRecords: DietRecord[];
  coachRecords: CoachRecord[];
  coachActivities: CoachActivityRecord[];
  questionnaireAnswered: boolean;
  selectedStudentId: string | null;
  selectedActivityId: string | null;
  selectedDateStr: string | null;
  
  setUser: (user: User | null) => void;
  setCurrentView: (view: View) => void;
  setQuestionnaireAnswered: (v: boolean) => void;
  addWeightRecord: (record: WeightRecord) => void;
  addExerciseRecord: (record: ExerciseRecord) => void;
  addDietRecord: (record: DietRecord) => void;
  updateDietRecord: (id: string, updates: Partial<DietRecord>) => void;
  addCoachRecord: (record: CoachRecord) => void;
  addCoachActivity: (record: CoachActivityRecord) => void;
  setSelectedStudentId: (id: string | null) => void;
  setSelectedActivityId: (id: string | null) => void;
  setSelectedDateStr: (date: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const MOCK_STUDENTS = [
  { id: 's1', name: '李明', age: 32, gender: 'male', phone: '13800000001' },
  { id: 's2', name: '王丽', age: 28, gender: 'female', phone: '13800000002' },
  { id: 's3', name: '张伟', age: 45, gender: 'male', phone: '13800000003' },
];

const MOCK_DIET_RECORDS: DietRecord[] = [
  {
    id: 'd1',
    studentId: 's1', // 王大锤
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0] + ' 08:30:00', // yesterday
    meal: 'breakfast',
    description: '燕麦粥一碗，白煮蛋两个，一杯牛奶',
    photos: [
      'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80',
      'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=400&q=80',
    ],
    dietitianComment: '早餐搭配很不错，碳水和蛋白质都有了，继续保持！',
  },
  {
    id: 'd2',
    studentId: 's1', // 李小花
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0] + ' 12:15:00', // yesterday
    meal: 'lunch',
    description: '香煎鸡胸肉沙拉，油醋汁',
    photos: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    ],
    dietitianComment: '非常标准的减脂餐，蔬菜比例很好。',
  },
  {
    id: 'd3',
    studentId: 's1', // 张伟
    date: new Date().toISOString().split('T')[0] + ' 18:45:00', // today
    meal: 'dinner',
    description: '清炒时蔬，糙米饭半碗',
    photos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'],
    dietitianComment: '晚餐清淡适量，非常棒！',
  },
  {
    id: 'd4',
    studentId: 's1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] + ' 09:00:00', // 2 days ago
    meal: 'breakfast',
    description: '紫薯一块，豆浆一杯，水煮蛋一个',
    photos: ['https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80'],
    dietitianComment: '很好，建议再搭配一点小番茄或者黄瓜。',
  },
  {
    id: 'd5',
    studentId: 's1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] + ' 13:20:00', // 2 days ago
    meal: 'lunch',
    description: '番茄牛腩，少油少盐，半碗杂粮饭',
    photos: ['https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&q=80'],
    dietitianComment: '肉类选择不错，注意控制汤汁的摄入哦。',
  },
  // --- New Mock Unannotated Data for Dietitian ---
  {
    id: 'd6',
    studentId: 's2', // 王丽
    date: new Date().toISOString().split('T')[0] + ' 07:30:00', // today
    meal: 'breakfast',
    description: '全麦面包两片，无糖豆浆一杯，蓝莓一小把',
    photos: ['https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?w=400&q=80'],
  },
  {
    id: 'd7',
    studentId: 's2', // 王丽
    date: new Date().toISOString().split('T')[0] + ' 12:40:00', // today
    meal: 'lunch',
    description: '水煮虾10只，西兰花，藜麦饭半碗',
    photos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'],
  },
  {
    id: 'd8',
    studentId: 's3', // 张伟
    date: new Date().toISOString().split('T')[0] + ' 08:15:00', // today
    meal: 'breakfast',
    description: '包子两个，豆浆',
    photos: ['https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80'],
  },
  {
    id: 'd9',
    studentId: 's1',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] + ' 18:00:00', // 5 days ago
    meal: 'dinner',
    description: '鸡胸肉沙拉',
    photos: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80'],
    dietitianComment: '鸡胸肉沙拉很棒，注意沙拉酱的热量。',
  },
  {
    id: 'd10',
    studentId: 's1',
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0] + ' 12:00:00', // 4 days ago
    meal: 'lunch',
    description: '紫薯、牛肉',
    photos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'],
    dietitianComment: '牛肉补充蛋白质很好。',
  }
];

const MOCK_WEIGHT_RECORDS: WeightRecord[] = [
  {
    id: 'w0_5',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] + ' 07:00:00',
    weight: 66.8,
  },
  {
    id: 'w0_4',
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0] + ' 07:10:00',
    weight: 66.3,
  },
  {
    id: 'w1',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] + ' 07:00:00', // 3 days ago
    weight: 66.0,
  },
  {
    id: 'w1_2',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] + ' 07:15:00', // 2 days ago
    weight: 65.5,
  },
  {
    id: 'w2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0] + ' 07:10:00', // yesterday
    weight: 65.2,
  },
  {
    id: 'w3',
    date: new Date().toISOString().split('T')[0] + ' 07:05:00', // today
    weight: 65.0,
  }
];

const MOCK_EXERCISE_RECORDS: ExerciseRecord[] = [
  {
    id: 'e1_0',
    studentId: 's1',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] + ' 18:00:00',
    type: '游泳',
    duration: 60,
    intensity: 4,
    coachComment: '游泳是有氧好选择，注意拉伸！',
  },
  {
    id: 'e1',
    studentId: 's1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] + ' 18:30:00',
    type: '跑步',
    duration: 30,
    intensity: 3,
    photos: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80',
    ],
    coachComment: '配速不错，下周可以尝试延长10分钟。',
  },
  {
    id: 'e2',
    studentId: 's1',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0] + ' 19:00:00',
    type: '力量训练',
    duration: 45,
    intensity: 5,
    photos: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
    ],
    coachComment: '动作标准度有提升，硬拉重量可以再突破一下！',
  },
  {
    id: 'e3',
    studentId: 's1',
    date: new Date().toISOString().split('T')[0] + ' 20:00:00',
    type: '瑜伽',
    duration: 40,
    intensity: 2,
    coachComment: '核心收紧得很好，拉伸很到位，继续保持！',
  },
  {
    id: 'e4',
    studentId: 's2',
    date: new Date().toISOString().split('T')[0] + ' 17:30:00',
    type: '跑步',
    duration: 20,
    intensity: 3,
  }
];

const MOCK_COACH_ACTIVITIES: CoachActivityRecord[] = [
  {
    id: 'a1',
    title: '全身燃脂 HIIT',
    description: '每天坚持15分钟，帮你快速燃烧卡路里！第一步：高抬腿；第二步：开合跳；第三步：波比跳。',
    imageUrls: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
    ],
    coachName: '李教练',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'a2',
    title: '晨间瑜伽唤醒',
    description: '通过几个简单的体式，唤醒僵硬的身体，开始元气满满的一天。',
    imageUrls: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      'https://images.unsplash.com/photo-1599901860904-17e08c2d159a?w=800&q=80'
    ],
    coachName: '王教练',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'a3',
    title: '核心力量强化',
    description: '不要只关注马甲线，核心肌群的强化对任何运动都至关重要。',
    imageUrls: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'
    ],
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
  const [coachActivities, setCoachActivities] = useState<CoachActivityRecord[]>(MOCK_COACH_ACTIVITIES);
  
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
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
      coachActivities, addCoachActivity: (r) => setCoachActivities(prev => [...prev, r]),
      selectedStudentId, setSelectedStudentId,
      selectedActivityId, setSelectedActivityId,
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
