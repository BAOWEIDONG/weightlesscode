export type Role = 'student' | 'coach' | 'dietitian';

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  gender?: 'male' | 'female';
  age?: number;
  height?: number;
  weight?: number;
  medicalHistory?: string;
  allergies?: string;
  medicalReports?: string[];
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface ExerciseRecord {
  id: string;
  studentId?: string;
  date: string;
  type: string;
  duration: number;
  intensity: number;
  notes?: string;
  photos?: string[];
  coachComment?: string;
}

export interface DietRecord {
  id: string;
  studentId?: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  photos: string[];
  dietitianComment?: string;
  dietitianName?: string;
  dietitianCommentDate?: string;
}

export interface CoachRecord {
  id: string;
  date: string;
  studentIds: string[];
  notes: string;
  photos: string[];
}

export interface CoachActivityRecord {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  coachName: string;
  date: string;
}
