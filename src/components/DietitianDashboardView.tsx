import React, { useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { Users, UserCircle, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_STUDENTS } from '../AppContext';

export const DietitianDashboardView = () => {
  const { user, setCurrentView, setSelectedStudentId, dietRecords, exerciseRecords } = useApp();
  
  const [activeTab, setActiveTab] = useState<'incomplete' | 'completed'>('incomplete');

  const unannotatedCount = dietRecords.filter(r => !r.dietitianComment).length;

  const todayStr = new Date().toISOString().split('T')[0];

  const studentsStatus = useMemo(() => {
    return MOCK_STUDENTS.map(student => {
      const studentDiets = dietRecords.filter(r => (r.studentId === student.id || r.studentId === undefined) && r.date.startsWith(todayStr));
      const studentExercises = exerciseRecords.filter(r => r.date.startsWith(todayStr)); // Mock exercise doesn't have studentId currently, assume if we implement it we'd check it. For now, since it's mock, we'll pretend there's an id or just check length if we add studentId to it. Actually, wait, exerciseRecords in types doesn't have studentId. Let me just check if ANY record exists for now, or just mock it. Wait, the user said "并且个人档案里需要增加运动打卡这个选项". I should add studentId to ExerciseRecord and WeightRecord!
      
      const hasBreakfast = studentDiets.some(d => d.meal === 'breakfast');
      const hasLunch = studentDiets.some(d => d.meal === 'lunch');
      const hasDinner = studentDiets.some(d => d.meal === 'dinner');
      const hasExercise = studentExercises.some(e => e.studentId === student.id);
      
      const missing = [];
      if (!hasBreakfast) missing.push('早餐');
      if (!hasLunch) missing.push('中餐');
      if (!hasDinner) missing.push('晚餐');
      if (!hasExercise) missing.push('运动');

      return {
        ...student,
        isCompleted: missing.length === 0,
        missingTags: missing
      };
    });
  }, [dietRecords, exerciseRecords, todayStr]);

  const completedStudents = studentsStatus.filter(s => s.isCompleted);
  const incompleteStudents = studentsStatus.filter(s => !s.isCompleted);

  const renderStudent = (student: typeof studentsStatus[0]) => (
    <Card 
      key={student.id} 
      className="flex items-center justify-between p-4 cursor-pointer hover:border-[#FF976A] transition-colors border-0 shadow-sm mb-3"
      onClick={() => {
        setSelectedStudentId(student.id);
        setCurrentView('dietitian-student-detail');
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="h-10 w-10 rounded-full bg-[#FF976A]/10 flex items-center justify-center text-[#FF976A] shrink-0">
          <UserCircle className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900 mb-1">{student.name}</div>
          <div className="text-[10px] text-gray-500 mb-1.5">
            {student.gender === 'male' ? '男' : '女'} · {student.age}岁 · {student.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
          </div>
          {!student.isCompleted && student.missingTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {student.missingTags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-50 text-red-500">
                  未打卡{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-[#FF976A] font-bold">›</div>
    </Card>
  );

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-20 font-sans">
      <div className="pt-12 px-6 pb-6 bg-gradient-to-b from-[#FF976A]/10 to-[#F7F8FA]">
        <div className="flex justify-end mb-2">
          <button onClick={() => setCurrentView('login')} className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-xs bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm">
            <LogOut className="h-3 w-3" /> 退出
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-full bg-[#FF976A] flex items-center justify-center shadow-md shrink-0">
            <Users className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">营养师您好，{user?.name || '专家'}</h2>
            <p className="text-xs font-bold text-[#FF976A] uppercase tracking-wider mt-1">您当前负责管理 {MOCK_STUDENTS.length} 名学员</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 space-y-6 relative -mt-2">
        <Card 
          className="flex items-center justify-between p-5 bg-white border border-[#FF976A]/20 cursor-pointer hover:shadow-md transition-shadow shadow-sm"
          onClick={() => setCurrentView('dietitian-unannotated-list')}
        >
          <div>
            <div className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FF976A]"></div>
              待批注饮食
            </div>
            <div className="text-[11px] text-gray-500 mt-1">{unannotatedCount > 0 ? `有 ${unannotatedCount} 条记录待批注` : '所有记录已批注完毕'}</div>
          </div>
          <div className="text-[#FF976A] font-bold flex items-center gap-1 text-sm bg-orange-50 px-3 py-1.5 rounded-full">
            {unannotatedCount > 0 ? '去处理' : '查看'} <span className="text-lg leading-none ml-0.5">›</span>
          </div>
        </Card>

        <div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm mb-4">
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'incomplete' ? 'bg-[#FF976A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('incomplete')}
            >
              <XCircle className="w-4 h-4" />
              未打卡 ({incompleteStudents.length})
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'completed' ? 'bg-[#07C160] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('completed')}
            >
              <CheckCircle className="w-4 h-4" />
              已打卡 ({completedStudents.length})
            </button>
          </div>

          <div className="space-y-3">
            {activeTab === 'incomplete' ? (
              incompleteStudents.length > 0 ? incompleteStudents.map(renderStudent) : (
                <div className="text-center text-xs text-gray-400 py-4 bg-white rounded-xl border border-gray-100">所有学员已完成今日打卡</div>
              )
            ) : (
              completedStudents.length > 0 ? completedStudents.map(renderStudent) : (
                <div className="text-center text-xs text-gray-400 py-4 bg-white rounded-xl border border-gray-100">暂无学员完成全部打卡</div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Nav Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-100 flex items-center justify-around pb-safe z-50">
        <button className="flex flex-col items-center gap-1 w-full h-full text-[#FF976A] pt-3">
          <Users className="h-6 w-6" />
          <span className="text-[9px] font-bold">工作台</span>
        </button>
      </div>
    </div>
  );
};
