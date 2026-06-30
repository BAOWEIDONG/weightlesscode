import React, { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { Activity, FileText, ClipboardList, Stethoscope, UploadCloud } from 'lucide-react';

type Indicator = {
  name: string;
  unit: string;
  normalRange: string;
  beforeValue: number | string | null;
  afterValue: number | string | null;
  isBeforeOut: boolean;
  isAfterOut: boolean;
};

export type MedicalCategory = {
  title: string;
  items: Indicator[];
};

export const MOCK_MEDICAL_DATA: MedicalCategory[] = [
  {
    title: '体成分检测',
    items: [
      { name: 'BMI', unit: '', normalRange: '18.5 - 23.9', beforeValue: 26.5, afterValue: null, isBeforeOut: true, isAfterOut: false },
      { name: '脂肪率', unit: '%', normalRange: '10.0 - 20.0', beforeValue: 24.5, afterValue: null, isBeforeOut: true, isAfterOut: false },
      { name: '骨骼肌量', unit: 'kg', normalRange: '30.0 - 40.0', beforeValue: 32.1, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '内脏脂肪等级', unit: '级', normalRange: '1 - 9', beforeValue: 12, afterValue: null, isBeforeOut: true, isAfterOut: false },
      { name: '四肢骨骼肌指数', unit: 'kg/m²', normalRange: '7.0 - 10.0', beforeValue: 7.5, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '推测腰臀比', unit: '', normalRange: '0.70 - 0.90', beforeValue: 0.95, afterValue: null, isBeforeOut: true, isAfterOut: false },
      { name: '基础代谢率', unit: 'kcal/d', normalRange: '1300 - 1700', beforeValue: 1450, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '水分率', unit: '%', normalRange: '50.0 - 65.0', beforeValue: 52.0, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '骨盐量', unit: 'kg', normalRange: '2.5 - 3.5', beforeValue: 2.8, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '蛋白质', unit: '%', normalRange: '15.0 - 20.0', beforeValue: 16.5, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '去脂体重', unit: 'kg', normalRange: '45.0 - 60.0', beforeValue: 55.0, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '心率', unit: '次/分', normalRange: '60 - 100', beforeValue: 85, afterValue: null, isBeforeOut: false, isAfterOut: false },
    ]
  },
  {
    title: '血糖相关',
    items: [
      { name: '空腹血糖', unit: 'mmol/L', normalRange: '3.9 - 6.1', beforeValue: 5.8, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '尿糖', unit: 'mmol/L', normalRange: '阴性', beforeValue: '阴性', afterValue: null, isBeforeOut: false, isAfterOut: false },
    ]
  },
  {
    title: '血压相关',
    items: [
      { name: '晨起收缩压(高压)', unit: 'mmHg', normalRange: '90 - 139', beforeValue: 145, afterValue: null, isBeforeOut: true, isAfterOut: false },
      { name: '晨起舒张压(低压)', unit: 'mmHg', normalRange: '60 - 89', beforeValue: 92, afterValue: null, isBeforeOut: true, isAfterOut: false },
    ]
  },
  {
    title: '血脂相关',
    items: [
      { name: '甘油三酯', unit: 'mmol/L', normalRange: '0.45 - 1.69', beforeValue: 2.1, afterValue: null, isBeforeOut: true, isAfterOut: false },
      { name: '总胆固醇', unit: 'mmol/L', normalRange: '2.85 - 5.18', beforeValue: 5.5, afterValue: null, isBeforeOut: true, isAfterOut: false },
      { name: '低密度脂蛋白胆固醇', unit: 'mmol/L', normalRange: '0 - 3.12', beforeValue: 3.5, afterValue: null, isBeforeOut: true, isAfterOut: false },
      { name: '高密度脂蛋白胆固醇', unit: 'mmol/L', normalRange: '1.04 - 1.55', beforeValue: 1.1, afterValue: null, isBeforeOut: false, isAfterOut: false },
    ]
  },
  {
    title: '肝功能相关',
    items: [
      { name: '谷丙转氨酶', unit: 'U/L', normalRange: '0 - 40', beforeValue: 35, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '谷草转氨酶', unit: 'U/L', normalRange: '0 - 40', beforeValue: 32, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '总胆红素', unit: 'umol/L', normalRange: '3.4 - 20.5', beforeValue: 15.2, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '直接胆红素', unit: 'umol/L', normalRange: '0 - 6.8', beforeValue: 4.1, afterValue: null, isBeforeOut: false, isAfterOut: false },
    ]
  },
  {
    title: '肾功能相关',
    items: [
      { name: '血肌酐', unit: 'umol/L', normalRange: '57 - 111', beforeValue: 88, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '尿素氮', unit: 'mmol/L', normalRange: '2.8 - 7.1', beforeValue: 5.4, afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '尿酸', unit: 'umol/L', normalRange: '208 - 428', beforeValue: 450, afterValue: null, isBeforeOut: true, isAfterOut: false },
      { name: '尿蛋白', unit: 'g/L', normalRange: '阴性', beforeValue: '阴性', afterValue: null, isBeforeOut: false, isAfterOut: false },
      { name: '尿微量白蛋白值', unit: 'mg/L', normalRange: '0 - 30', beforeValue: 12, afterValue: null, isBeforeOut: false, isAfterOut: false },
    ]
  }
];

export const HealthProfileView = () => {
  const { setCurrentView, questionnaireAnswered } = useApp();
  const [qData, setQData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('submitted_questionnaire') || localStorage.getItem('draft_questionnaire');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQData(parsed.formData || parsed);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const renderValue = (val: number | string | null, isOut: boolean, isAfter: boolean = false) => {
    if (val === null) return <span className="text-gray-400">-- {isAfter ? '待更新' : '待上传'}</span>;
    if (val === undefined || val === '') return <span className="text-gray-400">-- 未检测</span>;
    return <span className={isOut ? 'text-orange-500 font-bold' : 'text-gray-900 font-medium'}>{val}</span>;
  };

  const handleUploadReport = () => {
    alert('模拟上传体检报告功能，实际会弹出文件选择器。');
  };

  return (
    <div className="flex h-full flex-col bg-[#F7F8FA] pb-20 overflow-y-auto font-sans">
      <NavBar title="健康档案" onBack={() => setCurrentView('dashboard')} right={
        <div className="flex items-center gap-1">
          <button className="text-[#07C160] hover:bg-green-50 p-2 rounded-full transition-colors" onClick={handleUploadReport}>
            <UploadCloud className="h-5 w-5" />
          </button>
        </div>
      } />
      
      <div className="p-4 space-y-4">
        {!qData && !questionnaireAnswered ? (
          <Card className="text-center py-10 text-gray-500 text-sm">
            尚未完成自查问卷
          </Card>
        ) : (
          <>
            <Card>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <ClipboardList className="h-4 w-4 text-[#07C160]" />
                基础与健康信息
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">身高</span><span className="text-gray-900">{qData?.height || '--'} cm</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">体重</span><span className="text-gray-900">{qData?.weight || '--'} kg</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">疾病史/慢性疾病</span><span className="text-gray-900">{qData?.hasChronic === '有' ? qData.chronicDetails : '无'}</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">特殊饮食</span><span className="text-gray-900">{qData?.hasSpecialDiet === '有' ? qData.specialDietDetails : '无'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">过敏史/食物过敏</span><span className="text-gray-900">{qData?.hasFoodAllergy === '有' ? qData.foodAllergyDetails : '无'}</span></div>
              </div>
            </Card>
            
            <Card>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <Activity className="h-4 w-4 text-[#07C160]" />
                生活与运动习惯
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">作息时间</span><span className="text-gray-900">{qData?.sleepTime || '--'} - {qData?.wakeTime || '--'} ({qData?.sleepDuration || '--'}h)</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">饮酒/吸烟</span><span className="text-gray-900">{qData?.drinkAlcohol || '--'} / {qData?.smoke || '--'}</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">经常吃零食</span><span className="text-gray-900">{qData?.snack || '--'}</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">日饮水量</span><span className="text-gray-900">{qData?.dailyWater || '--'} ml</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">每周运动</span><span className="text-gray-900">{qData?.exerciseFrequency || '--'}次 (每次{qData?.exerciseDuration || '--'}分钟)</span></div>
                <div className="flex justify-between"><span className="text-gray-500">运动类型</span><span className="text-gray-900 text-right">{(qData?.exerciseTypes || []).join(', ') || '--'}</span></div>
              </div>
            </Card>
          </>
        )}

        <Card className="bg-orange-50 border-orange-100">
          <p className="text-xs text-orange-800">
            提示：以下数据在客户结营完成后进行更新。橙色字体表示该指标超出医学参考范围。结营后数据若为空，显示为“待更新”；若报告中未包含该项，显示为“未检测”。
          </p>
        </Card>

        {MOCK_MEDICAL_DATA.map((cat, idx) => (
          <Card key={idx} className="p-0 overflow-hidden shadow-sm border border-gray-100">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#1677FF]" />
              <h3 className="font-bold text-gray-900 text-sm">{cat.title}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {cat.items.map((item, iIdx) => (
                <div key={iIdx} className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                    <div className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium tracking-wide">
                      参考: {item.normalRange} {item.unit}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg flex flex-col justify-center items-center">
                      <span className="text-[10px] text-gray-500 mb-1 font-medium">开营前</span>
                      <div className="text-sm">
                        {renderValue(item.beforeValue, item.isBeforeOut, false)}
                        {item.beforeValue !== null && item.beforeValue !== undefined && item.beforeValue !== '' && item.unit && (
                          <span className="text-[10px] text-gray-500 ml-1">{item.unit}</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-[#07C160]/5 p-2 rounded-lg flex flex-col justify-center items-center border border-[#07C160]/10">
                      <span className="text-[10px] text-[#07C160] font-bold mb-1">结营后</span>
                      <div className="text-sm">
                        {renderValue(item.afterValue, item.isAfterOut, true)}
                        {item.afterValue !== null && item.afterValue !== undefined && item.afterValue !== '' && item.unit && (
                          <span className="text-[10px] text-gray-500 ml-1">{item.unit}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {qData?.medicalReports && qData.medicalReports.length > 0 && (
          <Card>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <FileText className="h-4 w-4 text-[#07C160]" />
              个人医疗报告
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {qData.medicalReports.map((url: string, idx: number) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-100 shadow-sm aspect-[3/4]">
                  <img src={url} alt={`报告 ${idx + 1}`} className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(url, '_blank')} />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white text-[10px] p-1.5 text-center truncate">
                    报告 {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
      
      {/* Bottom Nav Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-gray-100 flex items-center justify-around pb-safe z-50">
        <button className="flex flex-col items-center gap-1 w-full h-full text-gray-400 hover:text-gray-700 pt-3 transition-colors" onClick={() => setCurrentView('dashboard')}>
          <Activity className="h-6 w-6" />
          <span className="text-[9px] font-bold tracking-wider">首页</span>
        </button>
        <button className="flex flex-col items-center gap-1 w-full h-full text-[#07C160] pt-3">
          <FileText className="h-6 w-6" />
          <span className="text-[9px] font-bold tracking-wider">档案</span>
        </button>
      </div>
    </div>
  );
};
