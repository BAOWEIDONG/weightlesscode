import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, Button, Input } from './ui';
import { Camera, UploadCloud, FileText, Video } from 'lucide-react';
import { format } from 'date-fns';

export const ActivityUploadView = () => {
  const { setCurrentView, goBack, addCoachActivity, user } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSimulatePhotoUpload = () => {
    setImageFiles(prev => [...prev, `https://source.unsplash.com/random/400x300?fitness&sig=${Date.now()}`]);
  };

  const handleSimulateVideoUpload = () => {
    setVideoUrl('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  };

  const handleSubmit = () => {
    if (!formData.title) {
      setError('请输入活动标题');
      return;
    }
    if (!formData.description) {
      setError('请输入活动介绍');
      return;
    }
    if (imageFiles.length === 0 && !videoUrl) {
      setError('请至少上传一张图片或视频');
      return;
    }

    addCoachActivity({
      id: `act_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      imageUrls: imageFiles,
      videoUrl: videoUrl || undefined,
      coachName: user?.name || '教练',
      date: format(new Date(), 'yyyy-MM-dd'),
    });

    setCurrentView('coach-dashboard');
  };

  return (
    <div className="flex h-full flex-col bg-[#F7F8FA] overflow-y-auto pb-safe">
      <NavBar title="发布锻炼活动" onBack={goBack} />
      
      <div className="p-4 space-y-4">
        <Card>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">活动多媒体 <span className="text-red-500">*</span></label>
              
              <div className="grid grid-cols-3 gap-2">
                {videoUrl && (
                  <div className="aspect-square rounded-xl bg-black overflow-hidden relative col-span-2 row-span-2">
                    <video src={videoUrl} className="w-full h-full object-contain" controls />
                    <button 
                      onClick={() => setVideoUrl(null)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-xs"
                    >
                      删除
                    </button>
                  </div>
                )}
                
                {imageFiles.map((url, index) => (
                  <div key={index} className="aspect-square rounded-xl bg-gray-100 overflow-hidden relative">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                
                {!videoUrl && (
                  <div 
                    onClick={handleSimulateVideoUpload}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <Video className="h-6 w-6 text-[#1677FF] mb-1" />
                    <span className="text-[10px] text-gray-400">上传视频</span>
                  </div>
                )}

                {imageFiles.length < (videoUrl ? 7 : 8) && (
                  <div 
                    onClick={handleSimulatePhotoUpload}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <Camera className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-400">上传图片</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">活动标题 <span className="text-red-500">*</span></label>
              <Input
                placeholder="例如：全身燃脂 HIIT"
                value={formData.title}
                onChange={(e) => { setFormData(p => ({ ...p, title: e.target.value })); setError(''); }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">活动介绍 <span className="text-red-500">*</span></label>
              <textarea
                placeholder="请输入详细的锻炼动作说明、注意事项及建议时长..."
                value={formData.description}
                onChange={(e) => { setFormData(p => ({ ...p, description: e.target.value })); setError(''); }}
                className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20 focus:border-[#1677FF] resize-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </Card>

        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}

        <div className="pt-4">
          <Button 
            className="w-full bg-[#1677FF] hover:bg-[#1677FF]/90 text-white shadow-lg shadow-[#1677FF]/20" 
            size="lg" 
            onClick={handleSubmit}
          >
            发布活动
          </Button>
        </div>
      </div>
    </div>
  );
};
