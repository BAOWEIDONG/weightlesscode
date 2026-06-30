import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, Button } from './ui';
import { Camera, X } from 'lucide-react';
import { format } from 'date-fns';
import { formatDateTime } from '../lib/utils';

const MEAL_TYPES = [
  { id: 'breakfast', label: '早餐' },
  { id: 'lunch', label: '午餐' },
  { id: 'dinner', label: '晚餐' },
  { id: 'snack', label: '加餐' },
];

export const DietView = () => {
  const { setCurrentView, addDietRecord, dietRecords, user } = useApp();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const userDiets = dietRecords.filter(r => r.studentId === user?.id || !r.studentId);
  const todayDiets = userDiets.filter(r => r.date.startsWith(todayStr));
  const uploadedMealIds = todayDiets.map(r => r.meal);

  const availableMeals = MEAL_TYPES.filter(m => !uploadedMealIds.includes(m.id as any));
  const initialMeal = availableMeals.length > 0 ? availableMeals[0].id : '';

  const [formData, setFormData] = useState({
    meal: initialMeal,
    description: '',
  });
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');
  
  const handleSimulatePhoto = () => {
    if (photos.length >= 3) return;
    setPhotos([...photos, `https://source.unsplash.com/random/400x300?food&sig=${Date.now()}`]);
    setError('');
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!formData.meal) {
      setError('今日餐次已全部打卡');
      return;
    }
    if (formData.description.length < 5 || formData.description.length > 500) {
      setError('请输入5-500字的食物描述');
      return;
    }
    if (photos.length === 0) {
      setError('请至少上传一张照片');
      return;
    }
    if (photos.length > 3) {
      setError('最多上传3张照片');
      return;
    }
    
    setError('');
    addDietRecord({
      id: `diet_${Date.now()}`,
      studentId: user?.id || 's1',
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      meal: formData.meal as any,
      description: formData.description,
      photos: photos
    });
    
    // reset form
    setFormData({ meal: '', description: '' });
    setPhotos([]);
  };

  // Update selected meal if current selection becomes disabled
  React.useEffect(() => {
    if (uploadedMealIds.includes(formData.meal as any) || !formData.meal) {
      const avail = MEAL_TYPES.filter(m => !uploadedMealIds.includes(m.id as any));
      if (avail.length > 0) {
        setFormData(p => ({ ...p, meal: avail[0].id }));
      } else {
        setFormData(p => ({ ...p, meal: '' }));
      }
    }
  }, [uploadedMealIds, formData.meal]);

  // Sort history by date desc (only today's records)
  const history = [...todayDiets].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-8">
      <NavBar title="饮食打卡" onBack={() => setCurrentView('dashboard')} />
      
      <div className="p-4 space-y-6">
        {/* Top: Upload Area */}
        <Card className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">选择餐次</label>
            <div className="flex gap-2">
              {MEAL_TYPES.map(m => {
                const isUploaded = uploadedMealIds.includes(m.id as any);
                const isSelected = formData.meal === m.id;
                
                return (
                  <button
                    key={m.id}
                    disabled={isUploaded}
                    onClick={() => setFormData(p => ({ ...p, meal: m.id }))}
                    className={`flex-1 py-2 rounded-lg text-sm transition-colors font-medium
                      ${isUploaded ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : isSelected ? 'bg-[#FF976A] text-white shadow-sm' 
                      : 'bg-white text-gray-700 border border-gray-200'}`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">食物描述 <span className="text-red-500">*</span></label>
            <div className="relative">
              <textarea
                placeholder="请详细描述您的餐食，包含食物种类和大概份量 (5-500字)"
                value={formData.description}
                onChange={(e) => { setFormData(p => ({ ...p, description: e.target.value })); setError(''); }}
                className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF976A]/20 focus:border-[#FF976A] resize-none text-sm text-gray-900 placeholder:text-gray-400"
                maxLength={500}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {formData.description.length}/500
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 block">拍照记录 <span className="text-red-500">*</span></label>
              <span className="text-xs text-gray-400">{photos.length}/3 张</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {photos.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
                  <img src={url} alt={`上传的照片 ${idx + 1}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {photos.length < 3 && (
                <button 
                  onClick={handleSimulatePhoto}
                  className="aspect-square flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:bg-white transition-colors"
                >
                  <Camera className="w-6 h-6 mb-1 text-gray-400" />
                  <span className="text-[10px]">添加照片</span>
                </button>
              )}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div className="pt-2">
            <Button 
              className="w-full bg-[#FF976A] hover:bg-[#c47f66] active:bg-[#af715a] disabled:bg-[#FF976A]/50 text-white" 
              size="lg" 
              onClick={handleSubmit}
              disabled={!formData.meal}
            >
              {formData.meal ? '提交打卡' : '今日已全部打卡'}
            </Button>
          </div>
        </Card>

        {/* Bottom: Upload Records & Dietitian Comments */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 pl-1 text-lg">历史打卡与批注</h3>
          
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
              暂无饮食打卡记录
            </div>
          ) : (
            <div className="space-y-4">
              {history.map(record => (
                <Card key={record.id} className="p-0 overflow-hidden">
                  <div className="p-4 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500 font-medium">{formatDateTime(record.date)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded text-[#FF976A] bg-[#FF976A]/10 font-bold uppercase">
                        {MEAL_TYPES.find(m => m.id === record.meal)?.label}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 mb-3 whitespace-pre-wrap">{record.description}</p>
                    
                    <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {record.photos.map((url, idx) => (
                        <img key={idx} src={url} alt="食物" className="h-20 w-20 object-cover rounded-lg shrink-0 snap-center border border-gray-100" />
                      ))}
                    </div>
                  </div>
                  
                  {record.dietitianComment && (
                    <div className="bg-[#07C160]/5 p-4 relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#07C160]"></div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#07C160]">
                          {record.dietitianName || '营养师'} 批注
                        </span>
                        {record.dietitianCommentDate && (
                          <span className="text-[10px] text-gray-500">{record.dietitianCommentDate}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {record.dietitianComment}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
