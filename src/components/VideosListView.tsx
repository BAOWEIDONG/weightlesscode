import React from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { Play } from 'lucide-react';

export const VideosListView = () => {
  const { setCurrentView, videoRecords, setSelectedVideoId } = useApp();

  const handleVideoClick = (id: string) => {
    setSelectedVideoId(id);
    setCurrentView('video-player');
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-safe">
      <NavBar title="锻炼视频" onBack={() => setCurrentView('dashboard')} />
      
      <div className="p-4 space-y-4">
        {videoRecords.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            暂无锻炼视频
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {videoRecords.map(video => (
              <Card key={video.id} className="p-0 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleVideoClick(video.id)}>
                <div className="relative aspect-video bg-gray-900">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <Play className="h-6 w-6 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{video.title}</h3>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>教练: {video.coachName}</span>
                    <span>{video.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
