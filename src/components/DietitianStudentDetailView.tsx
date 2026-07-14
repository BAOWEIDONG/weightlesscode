import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, Button, Input } from './ui';
import { UserCircle, Coffee, MessageCircle, Stethoscope, ClipboardList, AlertCircle, FileText, Activity } from 'lucide-react';
import { MOCK_STUDENTS } from '../AppContext';
import { format } from 'date-fns';
import { formatDateTime } from '../lib/utils';
import { MOCK_MEDICAL_DATA, MedicalCategory } from './HealthProfileView';

const MEAL_TYPES = [
  { id: 'breakfast', label: '早餐' },
  { id: 'lunch', label: '午餐' },
  { id: 'dinner', label: '晚餐' },
  { id: 'snack', label: '加餐' },
];

export const DietitianStudentDetailView = () => {
  const { setCurrentView, goBack, selectedStudentId, dietRecords, exerciseRecords, updateDietRecord, user } = useApp();
  const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId);

  const [activeTab, setActiveTab] = useState<'diet' | 'exercise' | 'medical' | 'questionnaire'>('diet');

  // For Diet tab
  const records = dietRecords
    .filter(r => r.studentId === selectedStudentId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentScore, setCommentScore] = useState<-1 | 0 | 1>(1);

  // For Exercise tab
  const studentExercises = exerciseRecords
    .filter(r => r.studentId === selectedStudentId)
    .sort((a, b) => b.date.localeCompare(a.date));

  // For Medical tab (Mock local state for editing)
  const [medicalData, setMedicalData] = useState<MedicalCategory[]>(JSON.parse(JSON.stringify(MOCK_MEDICAL_DATA)));
  const [isEditingMedical, setIsEditingMedical] = useState(false);

  // For Questionnaire tab
  const [qData, setQData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('submitted_questionnaire') || localStorage.getItem('draft_questionnaire');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQData(parsed.formData || parsed);
      } catch (e) {}
    }
  }, []);

  if (!student) {
    return (
      <div className="flex h-full flex-col bg-[#F7F8FA] pb-safe">
        <NavBar title="学员详情" onBack={goBack} />
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          未选择学员
        </div>
      </div>
    );
  }

  const handleSaveComment = (recordId: string) => {
    updateDietRecord(recordId, {
      dietitianComment: commentText,
      dietitianScore: commentScore,
      dietitianName: user?.name || '营养师',
      dietitianCommentDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    });
    setCommentingId(null);
    setCommentText('');
    setCommentScore(1);
  };

  const handleMedicalChange = (catIdx: number, itemIdx: number, field: 'beforeValue' | 'afterValue', value: string) => {
    const newData = [...medicalData];
    newData[catIdx].items[itemIdx][field] = value ? Number(value) : null;
    
    // Auto-calculate out of range (simplified mock logic)
    const item = newData[catIdx].items[itemIdx];
    if (item.normalRange.includes('-')) {
      const [min, max] = item.normalRange.split('-').map(Number);
      if (field === 'beforeValue' && item.beforeValue !== null) {
        item.isBeforeOut = (item.beforeValue as number) < min || (item.beforeValue as number) > max;
      }
      if (field === 'afterValue' && item.afterValue !== null) {
        item.isAfterOut = (item.afterValue as number) < min || (item.afterValue as number) > max;
      }
    }
    
    setMedicalData(newData);
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-safe relative font-sans">
      <NavBar title={`${student.name} 的档案`} onBack={goBack} />
      
      <div className="bg-white px-4 pt-4 border-b border-gray-200 sticky top-14 z-10 space-y-4">
        <Card className="flex items-center justify-between p-4 bg-[#FF976A]/5 border-[#FF976A]/20">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-[#FF976A]/10 flex items-center justify-center text-[#FF976A]">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 mb-1">{student.name}</div>
              <div className="text-xs text-gray-500">
                {student.gender === 'male' ? '男' : '女'} · {student.age}岁 · {student.phone}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[#FF976A] border-[#FF976A] shrink-0 text-xs"
            onClick={() => setCurrentView('pointsDetail')}
          >
            积分与排名
          </Button>
        </Card>

        <div className="flex gap-4 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
          <button 
            className={`py-3 text-sm font-bold border-b-2 transition-colors shrink-0 ${activeTab === 'diet' ? 'border-[#07C160] text-[#07C160]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('diet')}
          >
            饮食打卡
          </button>
          <button 
            className={`py-3 text-sm font-bold border-b-2 transition-colors shrink-0 ${activeTab === 'exercise' ? 'border-[#07C160] text-[#07C160]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('exercise')}
          >
            运动打卡
          </button>
          <button 
            className={`py-3 text-sm font-bold border-b-2 transition-colors shrink-0 ${activeTab === 'medical' ? 'border-[#07C160] text-[#07C160]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('medical')}
          >
            基础医疗
          </button>
          <button 
            className={`py-3 text-sm font-bold border-b-2 transition-colors shrink-0 ${activeTab === 'questionnaire' ? 'border-[#07C160] text-[#07C160]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('questionnaire')}
          >
            自查问卷
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'diet' && (
          records.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
              暂无饮食打卡记录
            </div>
          ) : (
            <div className="space-y-4">
              {records.map(record => (
                <Card key={record.id} className="p-0 overflow-hidden">
                  <div className="p-4 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500 font-medium">{formatDateTime(record.date)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded text-[#FF976A] bg-[#FF976A]/10 font-bold uppercase">
                        {MEAL_TYPES.find(m => m.id === record.meal)?.label}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 mb-3 whitespace-pre-wrap">{record.description}</p>
                    
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {record.photos?.map((url, idx) => (
                        <img key={idx} src={url} alt="食物" className="h-20 w-20 object-cover rounded-lg shrink-0 border border-gray-100" />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50/50">
                    {commentingId === record.id ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-700 font-medium">该餐打分:</label>
                          <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${commentScore === 1 ? 'bg-[#FF976A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                              onClick={() => setCommentScore(1)}
                            >
                              +1 (认可)
                            </button>
                            <button
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${commentScore === 0 ? 'bg-gray-300 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                              onClick={() => setCommentScore(0)}
                            >
                              0 (不计分)
                            </button>
                            <button
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${commentScore === -1 ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                              onClick={() => setCommentScore(-1)}
                            >
                              -1 (扣分)
                            </button>
                          </div>
                        </div>
                        <textarea
                          className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:border-[#FF976A]"
                          rows={3}
                          placeholder="输入专业批注..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setCommentingId(null)}>取消</Button>
                          <Button className="bg-[#FF976A] hover:bg-[#c47f66] text-white" size="sm" onClick={() => handleSaveComment(record.id)}>保存</Button>
                        </div>
                      </div>
                    ) : record.dietitianComment ? (
                      <div className="relative group">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#FF976A]">您的批注</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              (record.dietitianScore ?? 1) > 0 ? 'bg-green-100 text-green-700' :
                              (record.dietitianScore ?? 1) < 0 ? 'bg-red-100 text-red-700' :
                              'bg-gray-200 text-gray-600'
                            }`}>
                              积分: {(record.dietitianScore ?? 1) > 0 ? `+${record.dietitianScore ?? 1}` : (record.dietitianScore ?? 1)}
                            </span>
                          </div>
                          {record.dietitianCommentDate && (
                            <span className="text-[10px] text-gray-500">{record.dietitianCommentDate}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {record.dietitianComment}
                        </p>
                        <button 
                          onClick={() => {
                            setCommentingId(record.id);
                            setCommentText(record.dietitianComment || '');
                            setCommentScore(record.dietitianScore ?? 1);
                          }}
                          className="text-xs text-[#1677FF] mt-2 block"
                        >
                          编辑
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setCommentingId(record.id);
                          setCommentText('');
                          setCommentScore(1);
                        }}
                        className="flex items-center gap-1 text-sm text-[#FF976A] font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        添加批注 (未打分，预估+1)
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )
        )}

        {activeTab === 'exercise' && (
          studentExercises.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
              暂无运动打卡记录
            </div>
          ) : (
            <div className="space-y-4">
              {studentExercises.map(record => (
                <Card key={record.id} className="p-0 overflow-hidden">
                  <div className="p-4 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500 font-medium">{formatDateTime(record.date)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded text-[#07C160] bg-[#07C160]/10 font-bold uppercase flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {record.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3 bg-gray-50 p-3 rounded-xl">
                      <div>
                        <div className="text-[10px] text-gray-500 mb-0.5">运动时长</div>
                        <div className="text-sm font-bold text-gray-900">{record.duration} <span className="text-xs font-normal">分钟</span></div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 mb-0.5">强度 (1-5)</div>
                        <div className="text-sm font-bold text-gray-900 flex gap-1">
                          {[1,2,3,4,5].map(v => (
                            <div key={v} className={`w-2 h-3 rounded-full ${v <= record.intensity ? 'bg-[#07C160]' : 'bg-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {record.notes && (
                      <div className="mb-3">
                        {record.type === '线下活动陪练' ? (
                          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                            <span className="text-xs font-bold text-blue-500 mb-1 block">教练打卡备注</span>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{record.notes}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{record.notes}</p>
                        )}
                      </div>
                    )}
                    
                    {record.photos && record.photos.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {record.photos.map((url, idx) => (
                          <img key={idx} src={url} alt="运动" className="h-20 w-20 object-cover rounded-lg shrink-0 border border-gray-100" />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )
        )}

        {activeTab === 'medical' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">医疗数据维护</h3>
                <p className="text-xs text-gray-500">协助填写和更新学员体检指标</p>
              </div>
              <Button 
                size="sm" 
                variant={isEditingMedical ? 'primary' : 'outline'}
                onClick={() => setIsEditingMedical(!isEditingMedical)}
              >
                {isEditingMedical ? '完成编辑' : '编辑指标'}
              </Button>
            </div>

            {medicalData.map((cat, idx) => (
              <Card key={idx} className="p-0 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#1677FF]" />
                  <h3 className="font-bold text-gray-900 text-sm">{cat.title}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {cat.items.map((item, iIdx) => (
                    <div key={iIdx} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                        <div className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                          参考: {item.normalRange} {item.unit}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-2 rounded flex flex-col justify-center items-center">
                          <span className="text-[10px] text-gray-500 mb-1">开营前</span>
                          <div className="text-sm w-full flex justify-center">
                            {isEditingMedical ? (
                              <input
                                type="number"
                                className="w-20 text-center rounded border border-gray-200 p-1 text-sm focus:border-[#07C160] outline-none"
                                value={item.beforeValue === null ? '' : item.beforeValue}
                                onChange={(e) => handleMedicalChange(idx, iIdx, 'beforeValue', e.target.value)}
                                placeholder="未检测"
                              />
                            ) : (
                              <span className={item.isBeforeOut ? 'text-orange-500 font-bold' : 'text-gray-900 font-medium'}>
                                {item.beforeValue === null ? <span className="text-gray-400 font-normal">-- 未上传</span> : item.beforeValue}
                              </span>
                            )}
                            {!isEditingMedical && item.beforeValue !== null && item.unit && (
                              <span className="text-[10px] text-gray-500 ml-1">{item.unit}</span>
                            )}
                          </div>
                        </div>
                        <div className="bg-[#07C160]/5 p-2 rounded flex flex-col justify-center items-center border border-[#07C160]/10">
                          <span className="text-[10px] text-[#07C160] font-medium mb-1">结营后</span>
                          <div className="text-sm w-full flex justify-center">
                            {isEditingMedical ? (
                              <input
                                type="number"
                                className="w-20 text-center rounded border border-gray-200 p-1 text-sm focus:border-[#07C160] outline-none"
                                value={item.afterValue === null ? '' : item.afterValue}
                                onChange={(e) => handleMedicalChange(idx, iIdx, 'afterValue', e.target.value)}
                                placeholder="未检测"
                              />
                            ) : (
                              <span className={item.isAfterOut ? 'text-orange-500 font-bold' : 'text-gray-900 font-medium'}>
                                {item.afterValue === null ? <span className="text-gray-400 font-normal">-- 待更新</span> : item.afterValue}
                              </span>
                            )}
                            {!isEditingMedical && item.afterValue !== null && item.unit && (
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
          </div>
        )}

        {activeTab === 'questionnaire' && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <FileText className="h-4 w-4 text-[#07C160]" />
                学员体检报告
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {qData?.medicalReports && qData.medicalReports.length > 0 ? (
                  qData.medicalReports.map((url: string, idx: number) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-[#07C160]">
                      <img src={url} alt={`报告 ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-2 truncate">
                        体检报告_第{idx + 1}页
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-[#07C160]">
                      <img src="https://source.unsplash.com/random/400x500?document,1" alt="报告 1" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-2 truncate">
                        体检报告_第1页.jpg
                      </div>
                    </div>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-[#07C160]">
                      <img src="https://source.unsplash.com/random/400x500?document,2" alt="报告 2" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-2 truncate">
                        体检报告_第2页.jpg
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <ClipboardList className="h-4 w-4 text-[#07C160]" />
                基础与健康信息
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">身高</span><span className="text-gray-900">{qData?.height || '170'} cm</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">体重</span><span className="text-gray-900">{qData?.weight || '65'} kg</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">疾病史/慢性疾病</span><span className="text-gray-900">{qData?.hasChronic === '有' ? qData.chronicDetails : (qData?.hasChronic === '无' ? '无' : '无')}</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">特殊饮食</span><span className="text-gray-900">{qData?.hasSpecialDiet === '有' ? qData.specialDietDetails : (qData?.hasSpecialDiet === '无' ? '无' : '无')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">过敏史/食物过敏</span><span className="text-gray-900">{qData?.hasFoodAllergy === '有' ? qData.foodAllergyDetails : (qData?.hasFoodAllergy === '无' ? '无' : '无')}</span></div>
              </div>
            </Card>
            
            <Card>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <AlertCircle className="h-4 w-4 text-[#07C160]" />
                生活与运动习惯
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">作息时间</span><span className="text-gray-900">{qData?.sleepTime || '23:00'} - {qData?.wakeTime || '07:00'} ({qData?.sleepDuration || '8'}h)</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">饮酒/吸烟</span><span className="text-gray-900">{qData?.drinkAlcohol || '偶尔'} / {qData?.smoke || '从不'}</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">经常吃零食</span><span className="text-gray-900">{qData?.snack || '否'}</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">日饮水量</span><span className="text-gray-900">{qData?.dailyWater || '2000'} ml</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">每周运动</span><span className="text-gray-900">{qData?.exerciseFrequency || '3'}次 (每次{qData?.exerciseDuration || '45'}分钟)</span></div>
                <div className="flex justify-between"><span className="text-gray-500">运动类型</span><span className="text-gray-900 text-right">{qData?.exerciseTypes ? qData.exerciseTypes.join(', ') : '跑步, 力量训练'}</span></div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
