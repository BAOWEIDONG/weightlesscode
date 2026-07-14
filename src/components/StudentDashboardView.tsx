import React, { useMemo } from 'react';
import { useApp, MOCK_STUDENTS } from '../AppContext';
import { NavBar, Card } from './ui';
import { Activity, Coffee, Calendar, FileText, UserCircle, Scale, PlayCircle, LogOut, Medal, Target, Trophy } from 'lucide-react';
import { rankStudents } from '../lib/scoring';
import { getTodayQuote } from '../lib/motivationalQuotes';

export const StudentDashboardView = () => {
  const { user, setCurrentView, weightRecords, dietRecords, exerciseRecords } = useApp();
  const latestWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : (user?.weight || '--');

  const scoreData = useMemo(() => {
    if (!user) return null;
    const ranked = rankStudents(MOCK_STUDENTS, dietRecords, exerciseRecords);
    return ranked.find(s => s.studentId === user.id);
  }, [user, dietRecords, exerciseRecords]);

  return (
    <div className="flex h-full flex-col bg-[#F4F6F8] pb-20 overflow-y-auto font-sans relative">
      {/* Dynamic Background Header */}
      <div className="relative pt-12 px-6 pb-20 bg-gradient-to-br from-[#07C160] to-[#04a551] rounded-b-[40px] shadow-lg overflow-hidden">
        {/* Abstract shapes for sporty background */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/20 rounded-full blur-2xl opacity-60 transform translate-x-1/4 -translate-y-1/4 z-0 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/20 rounded-full blur-2xl opacity-60 transform -translate-x-1/4 translate-y-1/4 z-0 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl mix-blend-overlay transform -translate-y-1/2 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-center mb-6">
          <h1 className="text-sm font-bold text-white flex items-center gap-1 shadow-sm px-3 py-1.5 bg-black/10 rounded-full backdrop-blur-sm shrink-0">
            <Medal className="h-4 w-4 text-yellow-300 shrink-0" />
            <span className="truncate">28天营养减重训练营</span>
          </h1>
          <button onClick={() => setCurrentView('login')} className="text-white hover:text-white transition-colors flex items-center gap-1 text-xs bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm shrink-0 ml-2">
            <LogOut className="h-3 w-3 shrink-0" /> 退出
          </button>
        </div>

        <div className="relative z-10 flex items-start space-x-4">
          <div className="h-16 w-16 rounded-full bg-white p-1 shadow-lg shrink-0">
            <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              <UserCircle className="h-12 w-12 text-gray-400 shrink-0" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md truncate">你好，{user?.name || '学员'}</h2>
            <div className="flex items-start gap-2 mt-2">
              <span className="text-[11px] font-bold text-[#04a551] bg-white px-2 py-0.5 rounded-full tracking-wide shadow-sm shrink-0 mt-0.5">DAY 1</span>
              <span className="text-xs text-white/90 font-medium tracking-wide drop-shadow-sm leading-snug min-h-[36px] break-words break-all">{getTodayQuote()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-0 space-y-5 -mt-10 relative z-20">
        <div className="grid grid-cols-2 gap-4 items-stretch">
          <Card className="flex flex-col justify-center p-5 cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md relative overflow-hidden h-full" onClick={() => setCurrentView('weight-checkin')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#07C160]/20 to-teal-100 rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4 z-0 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-1 mb-2">
                <Target className="w-4 h-4 text-[#07C160] shrink-0" />
                <div className="text-xs text-gray-500 font-bold truncate">最新体重</div>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black text-gray-900 tracking-tighter truncate">{latestWeight}</span>
                <span className="text-sm mb-1 text-gray-500 font-medium shrink-0">kg</span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col justify-center p-5 cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md relative overflow-hidden h-full" onClick={() => setCurrentView('ranking')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF976A]/20 to-orange-100 rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4 z-0 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Trophy className="w-4 h-4 text-[#FF976A] shrink-0" />
                  <div className="text-xs text-gray-500 font-bold truncate">我的排名</div>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-[28px] font-black text-gray-900 tracking-tighter truncate">第{scoreData?.rank || '--'}位</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1 truncate">总计 {scoreData?.totalScore || 0} 分</div>
            </div>
          </Card>
        </div>

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
