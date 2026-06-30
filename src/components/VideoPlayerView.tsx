import React from 'react';
import { useApp } from '../AppContext';
import { NavBar } from './ui';

export const VideoPlayerView = () => {
  const { setCurrentView, videoRecords, selectedVideoId } = useApp();
  const video = videoRecords.find(v => v.id === selectedVideoId);

  if (!video) {
    return (
      <div className="flex h-screen flex-col bg-[#F7F8FA]">
        <NavBar title="视频播放" onBack={() => setCurrentView('videos-list')} />
        <div className="flex-1 flex items-center justify-center text-gray-500">
          视频未找到
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-black overflow-y-auto">
      <NavBar title={video.title} onBack={() => setCurrentView('videos-list')} className="bg-black/50 text-white border-0 backdrop-blur-md !text-white" />
      
      <div className="flex-1 flex flex-col">
        {/* Mock Video Player */}
        <div className="w-full aspect-video bg-gray-900 relative">
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-contain" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
            {/* Mock controls */}
            <div className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer">
              <div className="w-1/3 h-full bg-[#07C160] rounded-full relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-white">
              <span>01:23</span>
              <span>{Math.floor(video.duration / 60).toString().padStart(2, '0')}:{(video.duration % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 bg-white rounded-t-3xl -mt-4 relative z-10">
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h2>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#07C160] flex items-center justify-center text-white text-xs font-bold">
              {video.coachName.substring(0, 1)}
            </div>
            <span className="text-sm font-medium text-gray-700">{video.coachName} 教练</span>
            <span className="text-xs text-gray-400 ml-auto">{video.date}</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-sm">训练说明</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
