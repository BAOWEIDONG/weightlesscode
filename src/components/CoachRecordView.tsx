import React, { useState } from 'react';
import { useApp, MOCK_STUDENTS } from '../AppContext';
import { NavBar, Card, Button } from './ui';
import { Camera, X, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

export const CoachRecordView = () => {
  const { setCurrentView, addExerciseRecord, selectedStudentId } = useApp();
  
  const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId);

  const [photos, setPhotos] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const handleSimulatePhoto = () => {
    if (photos.length >= 20) return;
    setPhotos([...photos, `https://source.unsplash.com/random/400x300?fitness&sig=${Date.now()}`]);
    setError('');
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (photos.length === 0) {
      setError('请至少上传一张照片');
      return;
    }
    
    setError('');
    // Create an exercise record for the selected student to represent the activity
    addExerciseRecord({
      id: `act_${Date.now()}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      type: '线下活动陪练',
      duration: 60, // default
      intensity: 3,
      notes: remarks || '教练上传的活动记录',
      photos: photos,
    });
    
    setCurrentView('coach-dashboard');
  };

  if (!student) {
    return (
      <div className="flex h-full flex-col bg-[#F7F8FA] pb-safe">
        <NavBar title="上传陪练记录" onBack={() => setCurrentView('coach-dashboard')} />
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          未选择学员
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-safe">
      <NavBar title="上传活动照片" onBack={() => setCurrentView('coach-dashboard')} />
      
      <div className="p-4 space-y-4">
        <Card className="flex items-center space-x-3 p-4 bg-[#07C160]/5 border-[#07C160]/20">
          <div className="h-10 w-10 rounded-full bg-[#07C160]/10 flex items-center justify-center text-[#07C160]">
            <UserCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 mb-1">目标学员: {student.name}</div>
            <div className="text-xs text-gray-500">
              {format(new Date(), 'yyyy-MM-dd HH:mm')}
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 block">现场照片 <span className="text-red-500">*</span></label>
              <span className="text-xs text-gray-400">{photos.length}/20 张</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {photos.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group">
                  <img src={url} alt={`照片 ${idx + 1}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {photos.length < 20 && (
                <button 
                  onClick={handleSimulatePhoto}
                  className="aspect-square flex flex-col items-center justify-center rounded-lg border border-dashed border-[#07C160]/40 bg-[#07C160]/5 text-[#07C160] hover:bg-[#07C160]/10 transition-colors"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">添加照片</span>
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">支持 JPG/PNG 格式，单张不超过 10MB</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">备注说明</label>
            <textarea
              placeholder="请输入本次训练的重点或学员表现..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07C160]/20 focus:border-[#07C160] resize-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </Card>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <div className="pt-4">
          <Button 
            className="w-full bg-[#07C160] hover:bg-[#07C160]/90 text-white" 
            size="lg" 
            onClick={handleSubmit}
          >
            提交记录
          </Button>
        </div>
      </div>
    </div>
  );
};
