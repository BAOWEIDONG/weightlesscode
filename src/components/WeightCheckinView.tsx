import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Button, Card } from './ui';
import { Scale } from 'lucide-react';
import { format } from 'date-fns';

export const WeightCheckinView = () => {
  const { setCurrentView, addWeightRecord, weightRecords } = useApp();
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (weightRecords.length > 0) {
      setWeight(weightRecords[weightRecords.length - 1].weight.toString());
    }
  }, [weightRecords]);

  const handleSubmit = () => {
    const val = parseFloat(weight);
    if (isNaN(val) || val <= 0 || val > 300) {
      setError('请输入合理的体重数值（例如: 65.5）');
      return;
    }
    
    setError('');
    addWeightRecord({
      id: `w_${Date.now()}`,
      date: format(new Date(), 'yyyy-MM-dd HH:mm'),
      weight: parseFloat(val.toFixed(1))
    });
    
    setCurrentView('dashboard');
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-safe">
      <NavBar title="体重打卡" onBack={() => setCurrentView('dashboard')} />
      
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="w-20 h-20 rounded-full bg-[#1677FF]/10 flex items-center justify-center text-[#1677FF]">
            <Scale className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">今日体重</h2>
          <p className="text-sm text-gray-500 text-center">记录每日体重变化，生成专属趋势图表</p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-center space-x-2 border-b border-gray-200 pb-4">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => { setWeight(e.target.value); setError(''); }}
              className="text-5xl font-light text-center text-gray-900 focus:outline-none w-40 bg-transparent"
              placeholder="0.0"
              autoFocus
            />
            <span className="text-xl font-medium text-gray-400 pb-1">kg</span>
          </div>
          {error && <div className="text-red-500 text-sm text-center mt-4">{error}</div>}
        </Card>

        <div className="pt-8">
          <Button className="w-full bg-[#1677FF] hover:bg-[#1677FF]/90 text-white" size="lg" onClick={handleSubmit}>
            完成打卡
          </Button>
        </div>
      </div>
    </div>
  );
};
