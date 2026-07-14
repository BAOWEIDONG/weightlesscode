import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { Download } from 'lucide-react';
import { MOCK_STUDENTS } from '../AppContext';

// Helper to define indicator directions
const INDICATORS = [
  { key: 'bmi', name: 'BMI', isIncreaseGood: false },
  { key: 'fatRate', name: '脂肪率(%)', isIncreaseGood: false },
  { key: 'muscle', name: '骨骼肌量(kg)', isIncreaseGood: true },
  { key: 'visceral', name: '内脏脂肪', isIncreaseGood: false },
  { key: 'bg', name: '空腹血糖', isIncreaseGood: false },
  { key: 'sbp', name: '收缩压', isIncreaseGood: false },
  { key: 'dbp', name: '舒张压', isIncreaseGood: false },
  { key: 'tg', name: '甘油三酯', isIncreaseGood: false },
];

// Mock data for 3 students
const MOCK_DATA = [
  { studentId: 's1', before: { bmi: 26.5, fatRate: 24.5, muscle: 32.1, visceral: 12, bg: 5.8, sbp: 145, dbp: 92, tg: 2.1 }, after: { bmi: 24.2, fatRate: 20.1, muscle: 33.5, visceral: 9, bg: 5.2, sbp: 128, dbp: 82, tg: 1.5 } },
  { studentId: 's2', before: { bmi: 28.1, fatRate: 30.2, muscle: 25.4, visceral: 14, bg: 6.2, sbp: 138, dbp: 88, tg: 2.5 }, after: { bmi: 26.5, fatRate: 26.8, muscle: 26.1, visceral: 11, bg: 5.6, sbp: 125, dbp: 80, tg: 1.8 } },
  { studentId: 's3', before: { bmi: 24.5, fatRate: 22.0, muscle: 30.5, visceral: 10, bg: 5.5, sbp: 130, dbp: 85, tg: 1.9 }, after: { bmi: 23.8, fatRate: 19.5, muscle: 31.8, visceral: 8, bg: 5.1, sbp: 120, dbp: 78, tg: 1.4 } },
];

export const CampStatsView = () => {
  const { setCurrentView, goBack } = useApp();
  const [activeTab, setActiveTab] = useState<'individual' | 'average'>('average');

  // Calculate changes for each student
  const studentChanges = MOCK_DATA.map(d => {
    const student = MOCK_STUDENTS.find(s => s.id === d.studentId);
    const changes: Record<string, number> = {};
    INDICATORS.forEach(ind => {
      const b = d.before[ind.key as keyof typeof d.before];
      const a = d.after[ind.key as keyof typeof d.after];
      changes[ind.key] = Number((a - b).toFixed(2));
    });
    return { name: student?.name || '未知', changes };
  });

  // Calculate averages
  const averageChanges: Record<string, number> = {};
  INDICATORS.forEach(ind => {
    let sum = 0;
    studentChanges.forEach(sc => {
      sum += sc.changes[ind.key];
    });
    averageChanges[ind.key] = Number((sum / studentChanges.length).toFixed(2));
  });

  const renderChangeValue = (val: number, isIncreaseGood: boolean) => {
    if (val === 0) return <span className="text-gray-500">0</span>;
    const isIncrease = val > 0;
    const isGood = isIncrease ? isIncreaseGood : !isIncreaseGood;
    
    // For string formatting
    const strVal = val > 0 ? `+${val}` : `${val}`;
    
    if (isGood) {
      return <span className="text-[#07C160] font-bold">{strVal}</span>;
    } else {
      return <span className="text-red-500 font-bold">{strVal}</span>;
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#F7F8FA] overflow-y-auto pb-safe">
      <NavBar title="结营数据统计" onBack={goBack} right={
        <button className="p-2 text-gray-500 hover:text-gray-900" onClick={() => alert('数据已导出')}>
          <Download className="w-5 h-5" />
        </button>
      } />

      <div className="bg-white px-4 border-b border-gray-200">
        <div className="flex gap-6">
          <button 
            className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'average' ? 'border-[#07C160] text-[#07C160]' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('average')}
          >
            全员平均变化量
          </button>
          <button 
            className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'individual' ? 'border-[#07C160] text-[#07C160]' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('individual')}
          >
            个人指标变化量
          </button>
        </div>
      </div>

      <div className="p-4 flex-1">
        <Card className="p-0 overflow-hidden bg-white border border-gray-200">
          {activeTab === 'average' ? (
            <div>
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm mb-1">训练营整体改善效果</h3>
                <p className="text-xs text-gray-500">基于 {MOCK_STUDENTS.length} 名学员的结营与开营数据对比（结营后 - 开营前）</p>
                <div className="flex gap-4 mt-3 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#07C160]"></span>改善方向</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>恶化方向</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {INDICATORS.map(ind => (
                  <div key={ind.key} className="flex justify-between items-center p-4 hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">{ind.name}</span>
                    <div className="text-base text-right w-24">
                      {renderChangeValue(averageChanges[ind.key], ind.isIncreaseGood)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm mb-1">学员个人改善明细</h3>
                <p className="text-xs text-gray-500">左右滑动查看更多指标（结营后 - 开营前）</p>
              </div>
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="p-3 font-medium sticky left-0 bg-gray-50 border-r border-gray-200">学员姓名</th>
                    {INDICATORS.map(ind => (
                      <th key={ind.key} className="p-3 font-medium text-center">{ind.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {studentChanges.map((sc, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900 sticky left-0 bg-white border-r border-gray-200 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                        {sc.name}
                      </td>
                      {INDICATORS.map(ind => (
                        <td key={ind.key} className="p-3 text-center">
                          {renderChangeValue(sc.changes[ind.key], ind.isIncreaseGood)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
