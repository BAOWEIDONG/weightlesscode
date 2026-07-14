import React, { useMemo, useState } from 'react';
import { useApp, MOCK_STUDENTS } from '../AppContext';
import { NavBar, Card } from './ui';
import { rankStudents } from '../lib/scoring';
import { formatDateTime } from '../lib/utils';
import { Activity, Utensils } from 'lucide-react';

const MEAL_TYPES = [
  { id: 'breakfast', label: '早餐' },
  { id: 'lunch', label: '午餐' },
  { id: 'dinner', label: '晚餐' },
  { id: 'snack', label: '加餐' },
];

export const PointsDetailView = () => {
  const { setCurrentView, goBack, dietRecords, exerciseRecords, selectedStudentId, user } = useApp();
  const [activeTab, setActiveTab] = useState<'diet' | 'exercise'>('diet');

  const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
  const rankedStudents = useMemo(() => rankStudents(MOCK_STUDENTS, dietRecords, exerciseRecords), [dietRecords, exerciseRecords]);
  const scoreData = rankedStudents.find(s => s.studentId === selectedStudentId);

  if (user?.role === 'student' && user.id !== selectedStudentId) {
    return (
      <div className="flex h-full flex-col bg-[#F7F8FA]">
        <NavBar title="积分明细" onBack={goBack} />
        <div className="flex-1 flex justify-center items-center text-gray-500">
          无权查看他人明细
        </div>
      </div>
    );
  }

  if (!student || !scoreData) {
    return (
      <div className="flex h-full flex-col bg-[#F7F8FA]">
        <NavBar title="积分明细" onBack={goBack} />
        <div className="flex-1 flex justify-center items-center text-gray-500">
          未找到学员信息
        </div>
      </div>
    );
  }

  const studentDiet = dietRecords.filter(r => r.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date));
  const studentExercise = exerciseRecords.filter(r => r.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex h-full flex-col bg-[#F7F8FA] overflow-y-auto pb-safe">
      <NavBar title={`${student.name} 的积分明细`} onBack={goBack} />
      
      <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <div className="text-3xl font-bold text-[#FF976A]">{scoreData.totalScore}</div>
          <div className="text-xs text-gray-500 mt-1">总积分</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">第 {scoreData.rank} 位</div>
          <div className="text-xs text-gray-500 mt-1">总排名</div>
        </div>
      </div>

      <div className="flex gap-4 px-4 bg-white border-b border-gray-200 sticky top-14 z-10">
        <button 
          className={`py-3 text-sm font-bold border-b-2 transition-colors flex-1 ${activeTab === 'diet' ? 'border-[#FF976A] text-[#FF976A]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          onClick={() => setActiveTab('diet')}
        >
          饮食积分 ({scoreData.dietScore})
        </button>
        <button 
          className={`py-3 text-sm font-bold border-b-2 transition-colors flex-1 ${activeTab === 'exercise' ? 'border-[#07C160] text-[#07C160]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          onClick={() => setActiveTab('exercise')}
        >
          运动积分 ({scoreData.exerciseScore})
        </button>
      </div>

      <div className="p-4 space-y-3">
        {activeTab === 'diet' && (
          studentDiet.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">暂无饮食记录</div>
          ) : (
            studentDiet.map(record => {
              const isSnack = record.meal === 'snack';
              const point = isSnack ? 0 : (record.dietitianScore ?? 1);
              return (
                <Card key={record.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#FF976A]" />
                      <span className="text-sm font-bold text-gray-900">{formatDateTime(record.date)}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                        {MEAL_TYPES.find(m => m.id === record.meal)?.label}
                      </span>
                    </div>
                    <div className={`font-bold ${point > 0 ? 'text-[#FF976A]' : point < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {point > 0 ? `+${point}` : point}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{record.isFasted ? '未进食' : record.description}</div>
                  
                  {record.dietitianComment && (
                    <div className="mt-3 bg-gray-50 p-2 rounded text-xs text-gray-600">
                      <span className="font-bold text-[#FF976A] mr-1">营养师批注:</span>
                      {record.dietitianComment}
                    </div>
                  )}
                </Card>
              );
            })
          )
        )}

        {activeTab === 'exercise' && (
          studentExercise.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">暂无运动记录</div>
          ) : (
            studentExercise.map(record => {
              const isValid = record.duration >= 40;
              return (
                <Card key={record.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#07C160]" />
                      <span className="text-sm font-bold text-gray-900">{formatDateTime(record.date)}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                        {record.type}
                      </span>
                    </div>
                    <div className={`font-bold ${isValid ? 'text-[#07C160]' : 'text-gray-400'}`}>
                      {isValid ? '+1' : '0'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">时长: {record.duration} 分钟</div>
                  {!isValid && (
                    <div className="text-[10px] text-gray-500 mt-1 bg-gray-50 p-1 rounded inline-block">未达40分钟，不计分</div>
                  )}
                </Card>
              );
            })
          )
        )}
      </div>
    </div>
  );
};
