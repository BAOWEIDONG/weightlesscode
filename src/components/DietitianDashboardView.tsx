import React, { useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { Users, UserCircle, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_STUDENTS } from '../AppContext';
import { rankStudents } from '../lib/scoring';

export const DietitianDashboardView = () => {
  const { user, setCurrentView, setSelectedStudentId, dietRecords, exerciseRecords } = useApp();
  
  const [activeTab, setActiveTab] = useState<'incomplete' | 'completed'>('incomplete');

  const unannotatedCount = dietRecords.filter(r => !r.dietitianComment).length;

  const todayStr = new Date().toISOString().split('T')[0];

  const rankedStudents = useMemo(() => {
    return rankStudents(MOCK_STUDENTS, dietRecords, exerciseRecords);
  }, [dietRecords, exerciseRecords]);

  const studentsStatus = useMemo(() => {
    return MOCK_STUDENTS.map(student => {
      const studentDiets = dietRecords.filter(r => (r.studentId === student.id || r.studentId === undefined) && r.date.startsWith(todayStr));
      const studentExercises = exerciseRecords.filter(r => r.date.startsWith(todayStr)); 
      
      const hasBreakfast = studentDiets.some(d => d.meal === 'breakfast');
      const hasLunch = studentDiets.some(d => d.meal === 'lunch');
      const hasDinner = studentDiets.some(d => d.meal === 'dinner');
      const hasExercise = studentExercises.some(e => e.studentId === student.id);
      
      const missing = [];
      if (!hasBreakfast) missing.push('早餐');
      if (!hasLunch) missing.push('中餐');
      if (!hasDinner) missing.push('晚餐');
      if (!hasExercise) missing.push('运动');

      const rankInfo = rankedStudents.find(r => r.studentId === student.id);

      return {
        ...student,
        isCompleted: missing.length === 0,
        missingTags: missing,
        totalScore: rankInfo?.totalScore || 0,
        rank: rankInfo?.rank || 0,
      };
    });
  }, [dietRecords, exerciseRecords, todayStr, rankedStudents]);

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
          <div className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
            {student.name}
            <span className="text-[10px] font-medium bg-[#FF976A]/10 text-[#FF976A] px-1.5 py-0.5 rounded">
              总排名第{student.rank}位 / {student.totalScore}分
            </span>
          </div>
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
    <div className="flex h-full flex-col bg-[#F7F8FA] overflow-y-auto pb-20 font-sans">
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
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="flex flex-col justify-center p-4 bg-white border border-[#FF976A]/20 cursor-pointer hover:shadow-md transition-shadow shadow-sm"
            onClick={() => setCurrentView('dietitian-unannotated-list')}
          >
            <div className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FF976A]"></div>
              待批注饮食
            </div>
            <div className="text-[10px] text-gray-500 mb-2">{unannotatedCount > 0 ? `有 ${unannotatedCount} 条记录` : '已全部批注'}</div>
            <div className="text-[#FF976A] font-bold flex items-center gap-1 text-[11px] bg-orange-50 px-2 py-1 rounded-lg w-fit">
              {unannotatedCount > 0 ? '去处理' : '查看'} <span className="text-sm leading-none ml-0.5">›</span>
            </div>
          </Card>

          <Card 
            className="flex flex-col justify-center p-4 bg-white border border-[#FF976A]/20 cursor-pointer hover:shadow-md transition-shadow shadow-sm"
            onClick={() => setCurrentView('ranking')}
          >
            <div className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              总排名榜单
            </div>
            <div className="text-[10px] text-gray-500 mb-2">查看并导出积分数据</div>
            <div className="text-yellow-600 font-bold flex items-center gap-1 text-[11px] bg-yellow-50 px-2 py-1 rounded-lg w-fit">
              去查看 <span className="text-sm leading-none ml-0.5">›</span>
            </div>
          </Card>
        </div>

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
