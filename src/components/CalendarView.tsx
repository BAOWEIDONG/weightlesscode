import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Activity, Coffee, Scale } from 'lucide-react';
import { formatDateTime } from '../lib/utils';

export const CalendarView = () => {
  const { setCurrentView, exerciseRecords, dietRecords, weightRecords, user } = useApp();
  const today = new Date();
  
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(today));
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  
  const getStatus = (date: Date) => {
    const dStr = format(date, 'yyyy-MM-dd');
    const hasEx = exerciseRecords.some(r => r.date.startsWith(dStr) && (r.studentId === user?.id || !r.studentId));
    const hasDiet = dietRecords.some(r => r.date.startsWith(dStr) && (r.studentId === user?.id || !r.studentId));
    const hasWeight = weightRecords.some(r => r.date.startsWith(dStr));
    return { hasEx, hasDiet, hasWeight };
  };

  const pad = Array.from({ length: monthStart.getDay() }).fill(null);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayExercises = exerciseRecords.filter(r => r.date.startsWith(selectedDateStr) && (r.studentId === user?.id || !r.studentId));
  const dayDiets = dietRecords.filter(r => r.date.startsWith(selectedDateStr) && (r.studentId === user?.id || !r.studentId));
  const dayWeights = weightRecords.filter(r => r.date.startsWith(selectedDateStr));

  return (
    <div className="flex h-full flex-col bg-[#F7F8FA] overflow-y-auto pb-8">
      <NavBar title="打卡记录" onBack={() => setCurrentView('dashboard')} />
      
      <div className="p-4 space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="text-center font-bold text-lg text-gray-900">
              {format(currentMonth, 'yyyy年MM月')}
            </div>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(d => (
              <div key={d} className="text-xs text-gray-500 font-medium">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            {pad.map((_, i) => <div key={`pad-${i}`} className="h-10" />)}
            {days.map((d, i) => {
              const { hasEx, hasDiet, hasWeight } = getStatus(d);
              const isToday = isSameDay(d, today);
              const isSelected = isSameDay(d, selectedDate);
              
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedDate(d)}
                  className={`h-12 flex flex-col items-center justify-start pt-1 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-gray-100 ring-1 ring-gray-200' : 'hover:bg-gray-50'}`}
                >
                  <span className={`text-sm ${isToday ? 'font-bold text-[#07C160]' : 'text-gray-700'}`}>
                    {format(d, 'd')}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {hasEx && <div className="w-1.5 h-1.5 rounded-full bg-[#07C160]" />}
                    {hasDiet && <div className="w-1.5 h-1.5 rounded-full bg-[#FF976A]" />}
                    {hasWeight && <div className="w-1.5 h-1.5 rounded-full bg-[#1677FF]" />}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#07C160]" />
              <span className="text-xs text-gray-500">运动</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FF976A]" />
              <span className="text-xs text-gray-500">饮食</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#1677FF]" />
              <span className="text-xs text-gray-500">体重</span>
            </div>
          </div>
        </Card>
        
        <h3 className="text-sm font-bold text-gray-900 pt-2 px-1">
          {isSameDay(selectedDate, today) ? '今日详情' : `${format(selectedDate, 'M月d日')} 详情`}
        </h3>

        {dayWeights.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 text-[#1677FF] mb-3">
              <Scale className="h-4 w-4" />
              <h4 className="font-bold text-sm">体重打卡</h4>
            </div>
            {dayWeights.map(w => (
              <div key={w.id} className="flex justify-between items-end border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                <span className="text-2xl font-light text-gray-900">{w.weight} <span className="text-xs font-normal text-gray-500">kg</span></span>
              </div>
            ))}
          </Card>
        )}

        {dayExercises.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 text-[#07C160] mb-3">
              <Activity className="h-4 w-4" />
              <h4 className="font-bold text-sm">运动打卡</h4>
            </div>
            <div className="space-y-3">
              {dayExercises.map(ex => (
                <div key={ex.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{ex.type}</span>
                      <span className="text-[10px] text-gray-500">{formatDateTime(ex.date)}</span>
                    </div>
                    <span className="text-sm text-gray-500">{ex.duration} 分钟</span>
                  </div>
                  <div className="text-xs text-yellow-500 mb-1">强度: {'★'.repeat(ex.intensity)}</div>
                  {ex.notes && <p className="text-xs text-gray-500 mt-1">{ex.notes}</p>}
                  {ex.photos && ex.photos.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {ex.photos.map((url, idx) => (
                        <img key={idx} src={url} alt="运动照片" className="h-20 w-20 object-cover rounded-lg shrink-0 snap-center" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {dayDiets.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 text-[#FF976A] mb-3">
              <Coffee className="h-4 w-4" />
              <h4 className="font-bold text-sm">饮食打卡</h4>
            </div>
            <div className="space-y-4">
              {dayDiets.map(diet => (
                <div key={diet.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                        {diet.meal === 'breakfast' ? '早餐' : diet.meal === 'lunch' ? '午餐' : diet.meal === 'dinner' ? '晚餐' : '加餐'}
                      </span>
                      <span className="text-[10px] text-gray-500">{formatDateTime(diet.date)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 mb-2">{diet.description}</p>
                  {diet.photos && diet.photos.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {diet.photos.map((url, idx) => (
                        <img key={idx} src={url} alt="食物照片" className="h-20 w-20 object-cover rounded-lg shrink-0 snap-center" />
                      ))}
                    </div>
                  )}
                  {diet.dietitianComment && (
                    <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="text-xs font-bold text-[#FF976A] mb-1">营养师批注：</div>
                      <p className="text-sm text-orange-900">{diet.dietitianComment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {dayWeights.length === 0 && dayExercises.length === 0 && dayDiets.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            当日无打卡记录
          </div>
        )}
      </div>
    </div>
  );
};
