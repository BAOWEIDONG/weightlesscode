import React from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, Button, ImageCarousel } from './ui';
import { Camera, UserCircle, Video, LogOut, Clock, Activity, FileText } from 'lucide-react';

export const CoachDashboardView = () => {
  const { user, setCurrentView, coachActivities } = useApp();

  return (
    <div className="flex h-screen flex-col bg-white overflow-y-auto pb-20 font-sans">
      <div className="pt-12 px-6 pb-4 bg-gradient-to-b from-[#07C160]/10 to-white border-b border-gray-100">
        <div className="flex justify-end mb-2">
          <button onClick={() => setCurrentView('login')} className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-xs">
            <LogOut className="h-4 w-4" /> 退出
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-[#07C160] flex items-center justify-center shadow-sm">
              <UserCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">教练您好，{user?.name || '专家'}</h2>
              <p className="text-xs font-bold text-[#07C160] uppercase tracking-wider mt-1">28天轻体减重训练营</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">教学资料</h3>
        </div>
        
        <Card className="flex items-center justify-between p-4 cursor-pointer hover:border-[#1677FF] transition-colors bg-blue-50/50" onClick={() => setCurrentView('activity-upload')}>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-[#1677FF]/10 flex items-center justify-center text-[#1677FF]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">上传锻炼活动</div>
              <div className="text-[10px] text-gray-500">
                支持图文形式，添加活动介绍
              </div>
            </div>
          </div>
          <div className="text-[#1677FF] font-bold">›</div>
        </Card>

        <div className="flex items-center justify-between mt-8 mb-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            历史发布活动
          </h3>
        </div>

        {coachActivities.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            暂无发布的锻炼活动
          </div>
        ) : (
          <div className="space-y-4">
            {coachActivities.map(activity => (
              <Card key={activity.id} className="p-0 overflow-hidden border border-gray-100 shadow-sm">
                <ImageCarousel imageUrls={activity.imageUrls} heightClass="h-32" />
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-1">{activity.title}</h4>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{activity.description}</p>
                  <div className="text-[10px] text-gray-400">
                    发布时间：{activity.date}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Nav Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-100 flex items-center justify-around pb-safe z-50">
        <button className="flex flex-col items-center gap-1 w-full h-full text-[#07C160] pt-3">
          <Activity className="h-6 w-6" />
          <span className="text-[9px] font-bold">主页</span>
        </button>
      </div>
    </div>
  );
};;
