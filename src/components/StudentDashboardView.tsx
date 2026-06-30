import React from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { Activity, Coffee, Calendar, FileText, UserCircle, Scale, PlayCircle, LogOut, Medal, Target } from 'lucide-react';

export const StudentDashboardView = () => {
  const { user, setCurrentView, weightRecords } = useApp();
  const latestWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : (user?.weight || '--');

  return (
    <div className="flex h-screen flex-col bg-[#F4F6F8] pb-20 overflow-y-auto font-sans relative">
      {/* Dynamic Background Header */}
      <div className="relative pt-12 px-6 pb-20 bg-gradient-to-br from-[#07C160] to-[#04a551] rounded-b-[40px] shadow-lg overflow-hidden">
        {/* Abstract shapes for sporty background */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/20 rounded-full blur-2xl opacity-60 transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/20 rounded-full blur-2xl opacity-60 transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl mix-blend-overlay transform -translate-y-1/2"></div>
        
        <div className="relative z-10 flex justify-between items-center mb-6">
          <h1 className="text-sm font-bold text-white flex items-center gap-1 shadow-sm px-3 py-1.5 bg-black/10 rounded-full backdrop-blur-sm">
            <Medal className="h-4 w-4 text-yellow-300" />
            28天轻体减重训练营
          </h1>
          <button onClick={() => setCurrentView('login')} className="text-white hover:text-white transition-colors flex items-center gap-1 text-xs bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
            <LogOut className="h-3 w-3" /> 退出
          </button>
        </div>

        <div className="relative z-10 flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-white p-1 shadow-lg shrink-0">
            <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              <UserCircle className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">你好，{user?.name || '学员'}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-[#04a551] bg-white px-2.5 py-0.5 rounded-full tracking-wide shadow-sm">DAY 1</span>
              <span className="text-xs text-white/90 font-medium tracking-wide drop-shadow-sm">坚持就是胜利</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-0 space-y-5 -mt-12 relative z-20">
        <Card className="flex items-center justify-between p-6 cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md relative overflow-hidden" onClick={() => setCurrentView('weight-checkin')}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#07C160]/20 to-teal-100 rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          
          <div className="relative z-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[#07C160]" />
              <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">最新体重</div>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">{latestWeight}</span>
              <span className="text-lg mb-1 text-gray-500 font-medium">kg</span>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-end text-right">
            <div className="text-[13px] font-bold text-gray-800 bg-white/80 px-3 py-2 rounded-xl border border-gray-100 shadow-sm mb-1.5 backdrop-blur-md whitespace-nowrap">
              "汗水是脂肪的眼泪"
            </div>
            <div className="text-[10px] text-gray-400 font-medium">每天进步一点点！</div>
          </div>
        </Card>

        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 ml-1 flex items-center gap-1.5">
            <div className="w-1.5 h-4 bg-[#07C160] rounded-full"></div>
            每日打卡任务
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <Card className="flex flex-col items-center justify-center py-6 cursor-pointer hover:ring-2 ring-[#07C160] transition-all border-0 shadow-sm" onClick={() => setCurrentView('exercise')}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#07C160] to-green-500 flex items-center justify-center text-white mb-3 shadow-sm">
                <Activity className="h-6 w-6" />
              </div>
              <div className="text-sm font-bold text-gray-900 mb-0.5">运动打卡</div>
              <div className="text-[10px] text-gray-400">记录消耗</div>
            </Card>

            <Card className="flex flex-col items-center justify-center py-6 cursor-pointer hover:ring-2 ring-[#FF976A] transition-all border-0 shadow-sm" onClick={() => setCurrentView('diet')}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF976A] to-orange-400 flex items-center justify-center text-white mb-3 shadow-sm">
                <Coffee className="h-6 w-6" />
              </div>
              <div className="text-sm font-bold text-gray-900 mb-0.5">饮食打卡</div>
              <div className="text-[10px] text-gray-400">拍照上传</div>
            </Card>

            <Card className="flex flex-col items-center justify-center py-6 cursor-pointer hover:ring-2 ring-[#1677FF] transition-all border-0 shadow-sm" onClick={() => setCurrentView('weight-checkin')}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1677FF] to-blue-500 flex items-center justify-center text-white mb-3 shadow-sm">
                <Scale className="h-6 w-6" />
              </div>
              <div className="text-sm font-bold text-gray-900 mb-0.5">体重打卡</div>
              <div className="text-[10px] text-gray-400">见证蜕变</div>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 ml-1 flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-4 bg-[#04a551] rounded-full"></div>
            营期回顾与指导
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm flex flex-col justify-between h-32 bg-white" onClick={() => setCurrentView('calendar')}>
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-2">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">打卡日历</div>
                <div className="text-[11px] text-gray-500 mt-0.5">查看历史记录</div>
              </div>
            </Card>

            <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm flex flex-col justify-between h-32 bg-white" onClick={() => setCurrentView('activities-list')}>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-2">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">锻炼活动</div>
                <div className="text-[11px] text-gray-500 mt-0.5">健康指导与教学</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Nav Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-100 flex items-center justify-around pb-safe z-50">
        <button className="flex flex-col items-center gap-1 w-full h-full text-[#07C160] pt-3">
          <Activity className="h-6 w-6" />
          <span className="text-[9px] font-bold tracking-wider">首页</span>
        </button>
        <button className="flex flex-col items-center gap-1 w-full h-full text-gray-400 hover:text-gray-700 pt-3 transition-colors" onClick={() => setCurrentView('health-profile')}>
          <FileText className="h-6 w-6" />
          <span className="text-[9px] font-bold tracking-wider">档案</span>
        </button>
      </div>
    </div>
  );
};
