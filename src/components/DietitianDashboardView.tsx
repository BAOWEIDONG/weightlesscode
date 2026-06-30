import React from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { Users, UserCircle, LogOut } from 'lucide-react';
import { MOCK_STUDENTS } from './CoachDashboardView';

export const DietitianDashboardView = () => {
  const { user, setCurrentView, setSelectedStudentId, dietRecords } = useApp();

  const unannotatedCount = dietRecords.filter(r => !r.dietitianComment).length;

  return (
    <div className="flex h-screen flex-col bg-white overflow-y-auto pb-20">
      <div className="pt-12 px-6 pb-4 bg-gradient-to-b from-[#FF976A]/10 to-white border-b border-gray-100">
        <div className="flex justify-end mb-2">
          <button onClick={() => setCurrentView('login')} className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-xs">
            <LogOut className="h-4 w-4" /> 退出
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-[#FF976A] flex items-center justify-center shadow-sm">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">营养师您好，{user?.name || '专家'}</h2>
            <p className="text-xs font-bold text-[#FF976A] uppercase tracking-wider mt-1">您当前负责管理 {MOCK_STUDENTS.length} 名学员</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">待办事项</h3>
        </div>
        
        <Card 
          className="flex items-center justify-between p-4 bg-orange-50/50 border-[#FF976A]/20 cursor-pointer hover:border-[#FF976A] transition-colors"
          onClick={() => setCurrentView('dietitian-unannotated-list')}
        >
          <div>
            <div className="text-sm font-bold text-gray-900 mb-1">今日未批注饮食</div>
            <div className="text-[10px] text-gray-500">{unannotatedCount > 0 ? `有 ${unannotatedCount} 条记录待批注` : '所有记录已批注完毕'}</div>
          </div>
          <div className="text-[#FF976A] font-bold flex items-center gap-1">
            {unannotatedCount > 0 ? '去处理' : '查看'} <span className="text-xl ml-1">›</span>
          </div>
        </Card>

        <div className="flex items-center justify-between mt-6 mb-2">
          <h3 className="text-sm font-bold text-gray-900">我的学员列表</h3>
        </div>

        {MOCK_STUDENTS.map(student => (
          <Card 
            key={student.id} 
            className="flex items-center justify-between p-4 cursor-pointer hover:border-[#FF976A] transition-colors"
            onClick={() => {
              setSelectedStudentId(student.id);
              setCurrentView('dietitian-student-detail');
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-[#FF976A]/10 flex items-center justify-center text-[#FF976A]">
                <UserCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 mb-1">{student.name}</div>
                <div className="text-[10px] text-gray-500">
                  {student.gender === 'male' ? '男' : '女'} · {student.age}岁 · {student.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                </div>
              </div>
            </div>
            
            <div className="text-[#FF976A] font-bold">›</div>
          </Card>
        ))}
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
