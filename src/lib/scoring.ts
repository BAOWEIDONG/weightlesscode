import { DietRecord, ExerciseRecord } from '../types';

export function calculateDietScore(records: DietRecord[]): number {
  // 饮食总分：按日聚合，每日取 min(Σ餐分, 3)（扣分可低于 3），再按日求和
  const dailyScores: Record<string, number> = {};

  records.forEach(record => {
    if (record.meal !== 'snack') {
      const score = record.dietitianScore != null ? record.dietitianScore : 1;
      const day = record.date.substring(0, 10);
      dailyScores[day] = (dailyScores[day] || 0) + score;
    }
  });

  let totalScore = 0;
  for (const date in dailyScores) {
    totalScore += Math.min(dailyScores[date], 3);
  }

  return totalScore;
}

export function calculateExerciseScore(records: ExerciseRecord[]): number {
  // 运动记录积分：duration >= 40 ? 1 : 0
  let totalScore = 0;
  records.forEach(record => {
    if (record.duration >= 40) {
      totalScore += 1;
    }
  });
  return totalScore;
}

export function calculateTotalScore(dietRecords: DietRecord[], exerciseRecords: ExerciseRecord[]): number {
  return calculateDietScore(dietRecords) + calculateExerciseScore(exerciseRecords);
}

export interface StudentScoreData {
  studentId: string;
  name: string;
  dietScore: number;
  exerciseScore: number;
  totalScore: number;
}

export interface RankedStudent extends StudentScoreData {
  rank: number;
}

export function rankStudents(students: { id: string, name: string }[], dietRecords: DietRecord[], exerciseRecords: ExerciseRecord[]): RankedStudent[] {
  const scoreDataList: StudentScoreData[] = students.map(student => {
    const studentDiet = dietRecords.filter(r => r.studentId === student.id);
    const studentExercise = exerciseRecords.filter(r => r.studentId === student.id);
    const dietScore = calculateDietScore(studentDiet);
    const exerciseScore = calculateExerciseScore(studentExercise);
    return {
      studentId: student.id,
      name: student.name,
      dietScore,
      exerciseScore,
      totalScore: dietScore + exerciseScore
    };
  });

  scoreDataList.sort((a, b) => b.totalScore - a.totalScore);

  const rankedStudents: RankedStudent[] = [];
  let currentRank = 1;

  for (let i = 0; i < scoreDataList.length; i++) {
    if (i > 0 && scoreDataList[i].totalScore < scoreDataList[i - 1].totalScore) {
      currentRank++;
    }
    rankedStudents.push({
      ...scoreDataList[i],
      rank: currentRank
    });
  }

  return rankedStudents;
}
