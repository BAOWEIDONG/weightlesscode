import { format } from "date-fns";
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Button, Input, NavBar, Card } from './ui';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export const UploadView = () => {
  const { setCurrentView, addWeightRecord } = useApp();
  const [weight, setWeight] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleSimulateUpload = () => {
    if (images.length >= 5) {
      setError('最多上传5张图片');
      return;
    }
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setImages(prev => [...prev, `https://source.unsplash.com/random/200x200?medical&sig=${Date.now()}`]);
          return 100;
        }
        return p + 20;
      });
    }, 200);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    const w = parseFloat(weight);
    if (!w || w < 30 || w > 300) {
      setError('请输入30-300kg之间的有效体重');
      return;
    }
    
    // Save weight
    addWeightRecord({
      id: `w_${Date.now()}`,
      date: format(new Date(), 'yyyy-MM-dd HH:mm'),
      weight: w,
    });
    
    setCurrentView('dashboard');
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-8">
      <NavBar title="数据上传" />
      <div className="p-4 space-y-4">
        <Card className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">体检报告上传</h3>
            <p className="text-xs text-gray-500 mb-3">支持拍照或相册选择，最多5张 (不超过10MB)</p>
            
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg border border-gray-100 overflow-hidden">
                  <img src={img} alt="Report" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && !uploading && (
                <button 
                  onClick={handleSimulateUpload}
                  className="aspect-square flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-[#F7F8FA] text-gray-500 hover:bg-white"
                >
                  <UploadCloud className="w-6 h-6 mb-1" />
                  <span className="text-xs">点击上传</span>
                </button>
              )}

              {uploading && (
                <div className="aspect-square flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-[#F7F8FA]">
                  <div className="text-xs text-[#07C160] font-medium">{progress}%</div>
                  <div className="w-3/4 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#07C160] transition-all duration-200" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="space-y-2">
          <label className="font-medium text-gray-900 block">当前体重录入 <span className="text-red-500">*</span></label>
          <div className="flex items-center space-x-3">
            <Input
              type="number"
              placeholder="0.0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1"
            />
            <span className="text-gray-500">kg</span>
          </div>
        </Card>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <div className="pt-4">
          <Button className="w-full" size="lg" onClick={handleSubmit}>
            完成注册，进入首页
          </Button>
        </div>
      </div>
    </div>
  );
};
