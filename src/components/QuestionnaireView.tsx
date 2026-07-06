import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Button, NavBar, Card } from './ui';
import { UploadCloud, FileText, X } from 'lucide-react';

const EXERCISE_OPTIONS = ['跑步', '快走', '游泳', '骑行', '力量训练', '瑜伽', '球类', '跳绳', '其他'];

export const QuestionnaireView = () => {
  const { user, setUser, setQuestionnaireAnswered, setCurrentView } = useApp();
  
  // 1: 基础信息, 2: 健康与体检, 3: 生活习惯, 4: 运动与活动, 5: 医疗报告上传
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1
    name: user?.name || '',
    gender: user?.gender || '',
    age: user?.age ? String(user.age) : '',
    height: '',
    weight: '',
    // Step 2
    hasChronic: '',
    chronicDetails: '',
    hasSpecialDiet: '',
    specialDietDetails: '',
    hasFoodAllergy: '',
    foodAllergyDetails: '',
    // Step 3
    wakeTime: '',
    sleepTime: '',
    sleepDuration: '',
    drinkAlcohol: '',
    smoke: '',
    snack: '',
    dailyWater: '',
    // Step 4
    exerciseFrequency: '',
    exerciseTypes: [] as string[],
    exerciseDuration: '',
    // Step 5
    medicalReports: [] as string[]
  });

  // Mock auto-save load
  useEffect(() => {
    const saved = localStorage.getItem('draft_questionnaire');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData);
        setStep(parsed.step);
        // Alert that we restored progress
        alert('已为您恢复上次进度');
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Mock auto-save save
  useEffect(() => {
    localStorage.setItem('draft_questionnaire', JSON.stringify({ formData, step }));
  }, [formData, step]);

  const handleNext = () => {
    setError('');
    // Validate current step
    if (step === 1) {
      if (!formData.name || !formData.gender || !formData.age || !formData.height || !formData.weight) {
        setError('请完善所有必填信息');
        return;
      }
      const a = parseInt(formData.age);
      if (a < 1 || a > 120) { setError('请输入正确的年龄'); return; }
      const h = parseFloat(formData.height);
      const w = parseFloat(formData.weight);
      if (h < 100 || h > 250) { setError('身高需在100-250cm之间'); return; }
      if (w < 20 || w > 300) { setError('体重需在20-300kg之间'); return; }
    } else if (step === 2) {
      if (!formData.hasChronic || !formData.hasSpecialDiet || !formData.hasFoodAllergy) {
        setError('请回答所有必填问题'); return;
      }
      if (formData.hasChronic === '有' && !formData.chronicDetails) { setError('请填写疾病名称'); return; }
      if (formData.hasSpecialDiet === '有' && !formData.specialDietDetails) { setError('请说明特殊饮食内容'); return; }
      if (formData.hasFoodAllergy === '有' && !formData.foodAllergyDetails) { setError('请列出过敏食物'); return; }
    } else if (step === 3) {
      if (!formData.wakeTime || !formData.sleepTime || !formData.sleepDuration || !formData.drinkAlcohol || !formData.smoke || !formData.snack || !formData.dailyWater) {
        setError('请回答所有必填问题'); return;
      }
      const sd = parseFloat(formData.sleepDuration);
      if (sd < 0 || sd > 24) { setError('睡眠时间需在0-24小时之间'); return; }
      const dw = parseInt(formData.dailyWater);
      if (dw < 0 || dw > 10000) { setError('饮水量需在0-10000ml之间'); return; }
    } else if (step === 4) {
      if (!formData.exerciseFrequency || formData.exerciseTypes.length === 0 || !formData.exerciseDuration) {
        setError('请回答所有必填问题'); return;
      }
      const ef = parseInt(formData.exerciseFrequency);
      if (ef < 0 || ef > 21) { setError('每周运动频率需在0-21次之间'); return; }
      const ed = parseInt(formData.exerciseDuration);
      if (ed < 0 || ed > 600) { setError('每次运动时长需在0-600分钟之间'); return; }
    } else if (step === 5) {
      // Open confirm dialog
      setShowConfirm(true);
      return;
    }
    
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleSubmit = () => {
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        gender: formData.gender as 'male' | 'female',
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
      });
    }
    localStorage.setItem('submitted_questionnaire', JSON.stringify(formData));
    localStorage.removeItem('draft_questionnaire'); // clear draft
    setQuestionnaireAnswered(true);
    setCurrentView('dashboard');
  };

  const toggleMulti = (opt: string) => {
    setFormData(p => {
      const types = p.exerciseTypes.includes(opt) 
        ? p.exerciseTypes.filter(x => x !== opt)
        : [...p.exerciseTypes, opt];
      return { ...p, exerciseTypes: types };
    });
  };

  const handleSimulateUpload = () => {
    if (formData.medicalReports.length >= 5) return;
    setFormData(p => ({
      ...p,
      medicalReports: [...p.medicalReports, `https://source.unsplash.com/random/400x500?document&sig=${Date.now()}`]
    }));
  };

  const removeReport = (idx: number) => {
    setFormData(p => ({
      ...p,
      medicalReports: p.medicalReports.filter((_, i) => i !== idx)
    }));
  };

  const steps = ['基础信息', '健康体检', '生活习惯', '运动活动', '报告上传'];

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-safe relative">
      <NavBar title="自查问卷" />
      
      <div className="p-4 flex-1 flex flex-col space-y-4">
        {/* Progress */}
        <div className="mb-2">
          <div className="flex justify-between text-[10px] text-gray-500 mb-2">
            {steps.map((s, idx) => (
              <div key={idx} className={`flex-1 text-center ${step === idx + 1 ? 'font-bold text-[#07C160]' : step > idx + 1 ? 'text-[#07C160]' : ''}`}>
                {s}
              </div>
            ))}
          </div>
          <div className="flex gap-1 h-1.5">
            {steps.map((_, idx) => (
              <div key={idx} className={`flex-1 rounded-full ${step >= idx + 1 ? 'bg-[#07C160]' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Step 1: 基础信息 */}
        {step === 1 && (
          <Card className="space-y-4 flex-1">
            <h3 className="font-bold text-gray-900 border-b pb-2">板块一：基础信息</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">姓名 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="请输入您的真实姓名"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">性别 <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  {['男', '女'].map(opt => {
                    const val = opt === '男' ? 'male' : 'female';
                    return (
                      <label key={opt} className="flex items-center space-x-2">
                        <input type="radio" checked={formData.gender === val} onChange={() => setFormData(p => ({ ...p, gender: val }))} className="text-[#07C160]" />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">年龄 <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  placeholder="例如: 28"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                  value={formData.age}
                  onChange={(e) => setFormData(p => ({ ...p, age: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">身高 (cm) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  placeholder="例如: 170.5"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                  value={formData.height}
                  onChange={(e) => setFormData(p => ({ ...p, height: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">体重 (kg) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  placeholder="例如: 65.5"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                  value={formData.weight}
                  onChange={(e) => setFormData(p => ({ ...p, weight: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-500">联系方式</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.phone || '138****0000'}</div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: 健康与体检信息 */}
        {step === 2 && (
          <Card className="space-y-6 flex-1">
            <h3 className="font-bold text-gray-900 border-b pb-2">板块二：健康与体检信息</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">疾病史/慢性疾病 <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {['无', '有'].map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input type="radio" checked={formData.hasChronic === opt} onChange={() => setFormData(p => ({ ...p, hasChronic: opt }))} className="text-[#07C160]" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {formData.hasChronic === '有' && (
                <input
                  type="text"
                  placeholder="请填写疾病名称"
                  className="w-full mt-2 rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                  value={formData.chronicDetails}
                  onChange={(e) => setFormData(p => ({ ...p, chronicDetails: e.target.value }))}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">是否有特殊饮食 <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {['无', '有'].map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input type="radio" checked={formData.hasSpecialDiet === opt} onChange={() => setFormData(p => ({ ...p, hasSpecialDiet: opt }))} className="text-[#07C160]" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {formData.hasSpecialDiet === '有' && (
                <input
                  type="text"
                  placeholder="请说明特殊饮食内容"
                  className="w-full mt-2 rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                  value={formData.specialDietDetails}
                  onChange={(e) => setFormData(p => ({ ...p, specialDietDetails: e.target.value }))}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">过敏史/食物过敏 <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {['无', '有'].map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input type="radio" checked={formData.hasFoodAllergy === opt} onChange={() => setFormData(p => ({ ...p, hasFoodAllergy: opt }))} className="text-[#07C160]" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {formData.hasFoodAllergy === '有' && (
                <input
                  type="text"
                  placeholder="请列出过敏食物"
                  className="w-full mt-2 rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                  value={formData.foodAllergyDetails}
                  onChange={(e) => setFormData(p => ({ ...p, foodAllergyDetails: e.target.value }))}
                />
              )}
            </div>
          </Card>
        )}

        {/* Step 3: 生活习惯 */}
        {step === 3 && (
          <Card className="space-y-5 flex-1">
            <h3 className="font-bold text-gray-900 border-b pb-2">板块三：生活习惯</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">通常几点起床 <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                  value={formData.wakeTime}
                  onChange={(e) => setFormData(p => ({ ...p, wakeTime: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">通常几点睡觉 <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                  value={formData.sleepTime}
                  onChange={(e) => setFormData(p => ({ ...p, sleepTime: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">平均每天睡眠时间 (小时) <span className="text-red-500">*</span></label>
              <input
                type="number"
                placeholder="例如: 7.5"
                className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                value={formData.sleepDuration}
                onChange={(e) => setFormData(p => ({ ...p, sleepDuration: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">是否饮酒 <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {['从不', '偶尔', '经常'].map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input type="radio" checked={formData.drinkAlcohol === opt} onChange={() => setFormData(p => ({ ...p, drinkAlcohol: opt }))} className="text-[#07C160]" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">是否吸烟 <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {['从不', '偶尔', '经常'].map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input type="radio" checked={formData.smoke === opt} onChange={() => setFormData(p => ({ ...p, smoke: opt }))} className="text-[#07C160]" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">是否经常吃零食 <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {['是', '否'].map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input type="radio" checked={formData.snack === opt} onChange={() => setFormData(p => ({ ...p, snack: opt }))} className="text-[#07C160]" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">每天饮水量 (ml) <span className="text-red-500">*</span></label>
              <input
                type="number"
                placeholder="例如: 2000"
                className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                value={formData.dailyWater}
                onChange={(e) => setFormData(p => ({ ...p, dailyWater: e.target.value }))}
              />
            </div>
          </Card>
        )}

        {/* Step 4: 运动与活动 */}
        {step === 4 && (
          <Card className="space-y-6 flex-1">
            <h3 className="font-bold text-gray-900 border-b pb-2">板块四：运动与活动</h3>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">每周运动频率 (次/周) <span className="text-red-500">*</span></label>
              <input
                type="number"
                placeholder="例如: 3"
                className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                value={formData.exerciseFrequency}
                onChange={(e) => setFormData(p => ({ ...p, exerciseFrequency: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">运动类型 (至少选择一项) <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {EXERCISE_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 border border-transparent has-[:checked]:border-[#07C160] has-[:checked]:bg-[#07C160]/5 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.exerciseTypes.includes(opt)}
                      onChange={() => toggleMulti(opt)}
                      className="text-[#07C160] rounded"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">每次运动时长 (分钟) <span className="text-red-500">*</span></label>
              <input
                type="number"
                placeholder="例如: 45"
                className="w-full rounded-lg border border-gray-200 p-3 focus:border-[#07C160] focus:outline-none"
                value={formData.exerciseDuration}
                onChange={(e) => setFormData(p => ({ ...p, exerciseDuration: e.target.value }))}
              />
            </div>
          </Card>
        )}

        {/* Step 5: 医疗报告上传 */}
        {step === 5 && (
          <Card className="space-y-6 flex-1">
            <h3 className="font-bold text-gray-900 border-b pb-2">板块五：医疗报告上传</h3>
            <p className="text-sm text-gray-500">
              请上传您的体检报告或相关医疗材料（支持图片或PDF）。这些材料将用于建立您的基础医疗数据，并在结营后进行对比更新。
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {formData.medicalReports.map((url, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={url} alt={`报告 ${idx + 1}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeReport(idx)}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate">
                      体检报告_{idx + 1}
                    </div>
                  </div>
                ))}
                
                {formData.medicalReports.length < 5 && (
                  <button 
                    onClick={handleSimulateUpload}
                    className="aspect-[3/4] flex flex-col items-center justify-center rounded-lg border border-dashed border-[#07C160]/40 bg-[#07C160]/5 text-[#07C160] hover:bg-[#07C160]/10 transition-colors"
                  >
                    <UploadCloud className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">添加文件</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">支持 JPG/PNG/PDF 格式，最多上传5份，单份不超过 10MB</p>
            </div>
          </Card>
        )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        {/* Navigation */}
        <div className="pt-4 flex gap-3">
          {step > 1 && (
            <Button className="flex-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50" onClick={handlePrev}>
              上一题
            </Button>
          )}
          <Button className="flex-1 bg-[#07C160] hover:bg-[#07C160]/90 text-white" onClick={handleNext}>
            {step === 5 ? '提交' : '下一题'}
          </Button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">提交后不可修改，确认提交？</h3>
            <div className="flex gap-3">
              <Button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setShowConfirm(false)}>
                继续修改
              </Button>
              <Button className="flex-1 bg-[#07C160] hover:bg-[#07C160]/90 text-white" onClick={handleSubmit}>
                确认
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


