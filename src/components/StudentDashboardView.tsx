import React from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { Activity, Coffee, Calendar, FileText, UserCircle, Scale, PlayCircle, LogOut } from 'lucide-react';

export const StudentDashboardView = () => {
  const { user, setCurrentView, weightRecords } = useApp();
  const latestWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : '--';

  return (
    <div className="flex h-screen flex-col bg-white pb-20 overflow-y-auto">
      <div className="pt-12 px-6 pb-4 bg-gradient-to-b from-[#07C160]/10 to-white border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-sm font-bold text-[#07C160] flex items-center gap-1">
            <Activity className="h-4 w-4" />
            28天轻体减重
          </h1>
          <button onClick={() => setCurrentView('login')} className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-xs">
            <LogOut className="h-4 w-4" /> 退出
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-[#07C160] flex items-center justify-center shadow-sm">
            <UserCircle className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">你好，{user?.name || '学员'}</h2>
            <p className="text-xs font-bold text-[#07C160] uppercase tracking-wider mt-1">今天是你加入的第 1 天</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-2 space-y-4">
        <Card className="flex items-center justify-between p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('health-profile')}>
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">最新体重</div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-light text-gray-900">{latestWeight}</span>
              <span className="text-sm mb-2 text-[#07C160] font-medium">KG</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-[#07C160]/10 flex items-center justify-center text-[#07C160]">
            <FileText className="h-6 w-6" />
          </div>
        </Card>

        <div className="flex justify-between items-center mt-6 mb-1">
          <h3 className="text-sm font-bold text-gray-900">日常打卡</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <Card className="flex flex-col items-center justify-center py-4 cursor-pointer hover:border-[#07C160] transition-colors" onClick={() => setCurrentView('exercise')}>
            <div className="w-10 h-10 rounded-full bg-[#07C160]/10 flex items-center justify-center text-[#07C160] mb-2">
              <Activity className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-gray-900 mb-1">运动打卡</div>
          </Card>

          <Card className="flex flex-col items-center justify-center py-4 cursor-pointer hover:border-[#FF976A] transition-colors" onClick={() => setCurrentView('diet')}>
            <div className="w-10 h-10 rounded-full bg-[#FF976A]/10 flex items-center justify-center text-[#FF976A] mb-2">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-gray-900 mb-1">饮食打卡</div>
          </Card>

          <Card className="flex flex-col items-center justify-center py-4 cursor-pointer hover:border-[#1677FF] transition-colors" onClick={() => setCurrentView('weight-checkin')}>
            <div className="w-10 h-10 rounded-full bg-[#1677FF]/10 flex items-center justify-center text-[#1677FF] mb-2">
              <Scale className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-gray-900 mb-1">体重打卡</div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Card className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setCurrentView('calendar')}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#1677FF]/10 flex items-center justify-center text-[#1677FF]">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">打卡日历</div>
                <div className="text-[10px] text-gray-500">查看历史记录</div>
              </div>
            </div>
          </Card>

          <Card className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setCurrentView('videos-list')}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">锻炼活动</div>
                <div className="text-[10px] text-gray-500">健康指导与教学</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Nav Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-100 flex items-center justify-around pb-safe">
        <button className="flex flex-col items-center gap-1 w-full h-full text-[#07C160] pt-3">
          <Activity className="h-6 w-6" />
          <span className="text-[9px] font-bold">首页</span>
        </button>
        <button className="flex flex-col items-center gap-1 w-full h-full text-gray-500 hover:text-gray-700 pt-3" onClick={() => setCurrentView('health-profile')}>
          <FileText className="h-6 w-6" />
          <span className="text-[9px] font-medium">档案</span>
        </button>
      </div>
    </div>
  );
};
