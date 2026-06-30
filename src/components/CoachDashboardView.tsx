import React from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, Button } from './ui';
import { Users, Camera, UserCircle, Video, LogOut } from 'lucide-react';

export const MOCK_STUDENTS = [
  { id: 's1', name: '李明', age: 32, gender: 'male', phone: '13800000001' },
  { id: 's2', name: '王丽', age: 28, gender: 'female', phone: '13800000002' },
  { id: 's3', name: '张伟', age: 45, gender: 'male', phone: '13800000003' },
];

export const CoachDashboardView = () => {
  const { user, setCurrentView, setSelectedStudentId } = useApp();

  return (
    <div className="flex h-screen flex-col bg-white overflow-y-auto pb-20">
      <div className="pt-12 px-6 pb-4 bg-gradient-to-b from-[#07C160]/10 to-white border-b border-gray-100">
        <div className="flex justify-end mb-2">
          <button onClick={() => setCurrentView('login')} className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-xs">
            <LogOut className="h-4 w-4" /> 退出
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-[#07C160] flex items-center justify-center shadow-sm">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">教练您好，{user?.name || '专家'}</h2>
              <p className="text-xs font-bold text-[#07C160] uppercase tracking-wider mt-1">您当前负责管理 {MOCK_STUDENTS.length} 名学员</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">教学资料</h3>
        </div>
        
        <Card className="flex items-center justify-between p-4 cursor-pointer hover:border-[#1677FF] transition-colors bg-blue-50/50" onClick={() => setCurrentView('video-upload')}>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-[#1677FF]/10 flex items-center justify-center text-[#1677FF]">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">上传锻炼视频</div>
              <div className="text-[10px] text-gray-500">
                支持MP4格式，最大500MB
              </div>
            </div>
          </div>
          <div className="text-[#1677FF] font-bold">›</div>
        </Card>

        <Card className="flex items-center justify-between p-4 cursor-pointer hover:border-[#07C160] transition-colors bg-green-50/50" onClick={() => setCurrentView('camp-stats')}>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-[#07C160]/10 flex items-center justify-center text-[#07C160]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">结营数据统计</div>
              <div className="text-[10px] text-gray-500">
                查看全员及个人改善效果
              </div>
            </div>
          </div>
          <div className="text-[#07C160] font-bold">›</div>
        </Card>

        <div className="flex items-center justify-between mt-6 mb-2">
          <h3 className="text-sm font-bold text-gray-900">我的学员列表</h3>
        </div>

        {MOCK_STUDENTS.map(student => (
          <Card key={student.id} className="flex items-center justify-between p-4 cursor-pointer hover:border-[#07C160] transition-colors">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-[#07C160]/10 flex items-center justify-center text-[#07C160]">
                <UserCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 mb-1">{student.name}</div>
                <div className="text-[10px] text-gray-500">
                  {student.gender === 'male' ? '男' : '女'} · {student.age}岁 · {student.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                </div>
              </div>
            </div>
            
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedStudentId(student.id);
                setCurrentView('coach-record-upload'); 
              }}
              className="px-3 py-1.5 bg-[#07C160] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm"
            >
              <Camera className="w-3 h-3" />
              上传活动照
            </button>
          </Card>
        ))}
      </div>
      
      {/* Bottom Nav Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-100 flex items-center justify-around pb-safe z-50">
        <button className="flex flex-col items-center gap-1 w-full h-full text-[#07C160] pt-3">
          <Users className="h-6 w-6" />
          <span className="text-[9px] font-bold">学员</span>
        </button>
      </div>
    </div>
  );
};
