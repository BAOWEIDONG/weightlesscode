import { format } from "date-fns";
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, Button, Input } from './ui';
import { Plus, X } from 'lucide-react';

const EXERCISE_TYPES = ['跑步', '游泳', '力量训练', '瑜伽', '快走', '骑行', '其他'];

type ActivityItem = {
  id: string;
  type: string;
  customType: string;
  duration: string;
  intensity: number;
};

export const ExerciseView = () => {
  const { setCurrentView, addExerciseRecord, exerciseRecords, user } = useApp();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const userExercises = exerciseRecords.filter(r => r.studentId === user?.id || !r.studentId);
  const todayExercises = userExercises.filter(r => r.date.startsWith(todayStr));
  
  const history = [...todayExercises].sort((a, b) => b.date.localeCompare(a.date));

  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: Date.now().toString(), type: '跑步', customType: '', duration: '', intensity: 3 }
  ]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleAddActivity = () => {
    setActivities([...activities, { id: Date.now().toString(), type: '力量训练', customType: '', duration: '', intensity: 3 }]);
  };

  const handleRemoveActivity = (id: string) => {
    if (activities.length > 1) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  const updateActivity = (id: string, field: keyof ActivityItem, value: any) => {
    setActivities(activities.map(a => a.id === id ? { ...a, [field]: value } : a));
    setError('');
  };

  const handleSubmit = () => {
    for (const a of activities) {
      if (!a.duration) {
        setError('请填写所有运动的时长');
        return;
      }
      if (a.type === '其他' && !a.customType.trim()) {
        setError('请填写自定义运动名称');
        return;
      }
    }
    
    setError('');
    
    const today = format(new Date(), 'yyyy-MM-dd HH:mm');
    
    activities.forEach((a, index) => {
      addExerciseRecord({
        id: `ex_${Date.now()}_${index}`,
        studentId: user?.id, date: format(new Date(), 'yyyy-MM-dd HH:mm'),
        type: a.type === '其他' ? a.customType : a.type,
        duration: parseInt(a.duration),
        intensity: a.intensity,
        notes: index === 0 ? notes : undefined // Only attach notes to the first record to avoid duplication
      });
    });
    
    setCurrentView('dashboard');
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-8 font-sans">
      <NavBar title="运动打卡" onBack={() => setCurrentView('dashboard')} />
      
      <div className="p-4 space-y-4">
        {activities.map((activity, index) => (
          <Card key={activity.id} className="space-y-5 relative pt-8 shadow-sm">
            {activities.length > 1 && (
              <button 
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                onClick={() => handleRemoveActivity(activity.id)}
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <div className="absolute top-0 left-0 bg-[#07C160]/10 text-[#07C160] px-3 py-1 rounded-br-lg font-bold text-xs">
              运动项 {index + 1}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900 block">运动类型</label>
              <div className="flex flex-wrap gap-2">
                {EXERCISE_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => updateActivity(activity.id, 'type', type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activity.type === type 
                        ? 'bg-[#07C160] text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {activity.type === '其他' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 block">自定义运动名称 <span className="text-red-500">*</span></label>
                <Input
                  type="text"
                  placeholder="例如：普拉提、爬山"
                  value={activity.customType}
                  onChange={(e) => updateActivity(activity.id, 'customType', e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 block">运动时长 (分钟) <span className="text-red-500">*</span></label>
              <Input
                type="number"
                placeholder="请输入时长，例如 30"
                value={activity.duration}
                onChange={(e) => updateActivity(activity.id, 'duration', e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900 block">主观强度 (1-5级)</label>
              <div className="flex justify-between items-center px-2 py-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => updateActivity(activity.id, 'intensity', level)}
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${
                      activity.intensity === level
                        ? 'bg-[#07C160] text-white scale-110 shadow-md ring-4 ring-[#07C160]/20'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <span className="font-bold">{level}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 px-2 font-medium">
                <span>很轻松</span>
                <span>非常吃力</span>
              </div>
            </div>
          </Card>
        ))}

        <button 
          onClick={handleAddActivity}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex items-center justify-center gap-2 hover:border-[#07C160] hover:text-[#07C160] transition-colors font-medium bg-white"
        >
          <Plus className="w-5 h-5" />
          添加运动项
        </button>

        <Card className="space-y-2 shadow-sm">
          <label className="text-sm font-bold text-gray-900 block">综合备注 (选填)</label>
          <textarea
            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#07C160] bg-gray-50 focus:bg-white transition-colors"
            rows={3}
            placeholder="记录一下今天整体的运动感受吧~"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Card>

        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}

        <div className="pt-4 pb-8">
          <Button className="w-full shadow-lg shadow-[#07C160]/20" size="lg" onClick={handleSubmit}>
            完成打卡
          </Button>
        </div>
        
        <div className="pt-2 pb-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#07C160] rounded-full"></div>
            今日运动记录
          </h3>
          
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
              暂无运动打卡记录
            </div>
          ) : (
            <div className="space-y-4">
              {history.map(record => (
                <Card key={record.id} className="p-0 overflow-hidden">
                  <div className="p-4 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500 font-medium">{record.date}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded text-[#07C160] bg-[#07C160]/10 font-bold uppercase">
                        {record.type}
                      </span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">时长: {record.duration} 分钟</span>
                      <span className="text-xs text-yellow-500 font-bold">强度: {'★'.repeat(record.intensity)}</span>
                    </div>

                    {record.notes && (
                      <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{record.notes}</p>
                    )}
                    
                    {record.photos && record.photos.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {record.photos.map((url, idx) => (
                          <img key={idx} src={url} alt="运动" className="h-20 w-20 object-cover rounded-lg shrink-0 snap-center border border-gray-100" />
                        ))}
                      </div>
                    )}
                  </div>
                  
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
