import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, Button, Input } from './ui';
import { Video, UploadCloud } from 'lucide-react';
import { MOCK_STUDENTS } from './CoachDashboardView';
import { format } from 'date-fns';

export const VideoUploadView = () => {
  const { setCurrentView, addVideoRecord, user } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    targetStudentIds: [] as string[],
    description: '',
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleSimulateUpload = () => {
    // Simulate picking a file
    setVideoFile(new File([''], 'training_video.mp4', { type: 'video/mp4' }));
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 20;
      });
    }, 300);
  };

  const toggleStudent = (id: string) => {
    setFormData(prev => {
      if (prev.targetStudentIds.includes(id)) {
        return { ...prev, targetStudentIds: prev.targetStudentIds.filter(s => s !== id) };
      }
      return { ...prev, targetStudentIds: [...prev.targetStudentIds, id] };
    });
  };

  const handleSubmit = () => {
    if (!videoFile || uploadProgress < 100) {
      setError('请先上传视频并等待上传完成');
      return;
    }
    if (!formData.title) {
      setError('请输入视频标题');
      return;
    }
    if (formData.targetStudentIds.length === 0) {
      setError('请选择至少一名目标学员');
      return;
    }

    addVideoRecord({
      id: `vid_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      videoUrl: 'https://example.com/mock-video.mp4',
      thumbnailUrl: `https://source.unsplash.com/random/400x300?fitness&sig=${Date.now()}`,
      duration: 120, // mock duration
      coachId: user?.id || 'c1',
      coachName: user?.name || '教练',
      targetStudentIds: formData.targetStudentIds,
      date: format(new Date(), 'yyyy-MM-dd HH:mm'),
    });

    setCurrentView('coach-dashboard');
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-safe">
      <NavBar title="上传锻炼视频" onBack={() => setCurrentView('coach-dashboard')} />
      
      <div className="p-4 space-y-4">
        <Card>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">视频文件 <span className="text-red-500">*</span></label>
              
              {!videoFile ? (
                <div 
                  onClick={handleSimulateUpload}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-[#1677FF]/30 bg-[#1677FF]/5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1677FF]/10 transition-colors"
                >
                  <UploadCloud className="h-8 w-8 text-[#1677FF] mb-2" />
                  <span className="text-sm font-medium text-[#1677FF]">点击选择视频</span>
                  <span className="text-xs text-gray-400 mt-1">支持 MP4, 最大 500MB</span>
                </div>
              ) : (
                <div className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{videoFile.name}</div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1677FF] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 w-8">{uploadProgress}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">视频标题 <span className="text-red-500">*</span></label>
              <Input
                placeholder="例如：核心力量基础训练"
                value={formData.title}
                onChange={(e) => { setFormData(p => ({ ...p, title: e.target.value })); setError(''); }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">训练说明</label>
              <textarea
                placeholder="请输入视频内容说明及注意事项..."
                value={formData.description}
                onChange={(e) => { setFormData(p => ({ ...p, description: e.target.value })); }}
                className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20 focus:border-[#1677FF] resize-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 block">指定学员 <span className="text-red-500">*</span></label>
                <button 
                  className="text-xs text-[#1677FF]" 
                  onClick={() => setFormData(p => ({ ...p, targetStudentIds: MOCK_STUDENTS.map(s => s.id) }))}
                >
                  全选
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {MOCK_STUDENTS.map(student => {
                  const isSelected = formData.targetStudentIds.includes(student.id);
                  return (
                    <button
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
                        ${isSelected 
                          ? 'bg-[#1677FF]/10 text-[#1677FF] border-[#1677FF]/30' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {student.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <div className="pt-4">
          <Button 
            className="w-full bg-[#1677FF] hover:bg-[#1677FF]/90 text-white" 
            size="lg" 
            onClick={handleSubmit}
          >
            发布视频
          </Button>
        </div>
      </div>
    </div>
  );
};
