import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, Button, Input } from './ui';

const EXERCISE_TYPES = ['跑步', '游泳', '力量训练', '瑜伽', '快走', '骑行', '其他'];

export const ExerciseView = () => {
  const { setCurrentView, addExerciseRecord } = useApp();
  const [formData, setFormData] = useState({
    type: '跑步',
    duration: '',
    intensity: 3,
    notes: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!formData.duration) {
      setError('请输入运动时长');
      return;
    }
    
    setError('');
    addExerciseRecord({
      id: `ex_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
      duration: parseInt(formData.duration),
      intensity: formData.intensity,
      notes: formData.notes
    });
    
    setCurrentView('dashboard');
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-8">
      <NavBar title="运动打卡" onBack={() => setCurrentView('dashboard')} />
      
      <div className="p-4 space-y-4">
        <Card className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">运动类型</label>
            <div className="flex flex-wrap gap-2">
              {EXERCISE_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setFormData(p => ({ ...p, type }))}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    formData.type === type 
                      ? 'bg-[#07C160] text-white' 
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">运动时长 (分钟) <span className="text-red-500">*</span></label>
            <Input
              type="number"
              placeholder="请输入时长，例如 30"
              value={formData.duration}
              onChange={(e) => { setFormData(p => ({ ...p, duration: e.target.value })); setError(''); }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">主观强度 (1-5级)</label>
            <div className="flex justify-between items-center px-2 py-4">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setFormData(p => ({ ...p, intensity: level }))}
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${
                    formData.intensity === level
                      ? 'bg-[#07C160] text-white scale-110 shadow-md'
                      : 'bg-white text-gray-500'
                  }`}
                >
                  <span className="font-medium">{level}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>很轻松</span>
              <span>非常吃力</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">备注 (选填)</label>
            <textarea
              className="w-full rounded-lg border border-gray-100 p-3 text-base focus:outline-none focus:border-[#07C160]"
              rows={3}
              placeholder="记录一下运动感受吧~"
              value={formData.notes}
              onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </Card>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <div className="pt-4">
          <Button className="w-full" size="lg" onClick={handleSubmit}>
            完成打卡
          </Button>
        </div>
      </div>
    </div>
  );
};
