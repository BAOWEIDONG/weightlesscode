import React from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, ImageCarousel } from './ui';
import { Clock, User } from 'lucide-react';

export const ActivitiesListView = () => {
  const { setCurrentView, coachActivities } = useApp();

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-safe font-sans">
      <NavBar title="锻炼活动" onBack={() => setCurrentView('dashboard')} />
      
      <div className="p-4 space-y-5">
        {coachActivities.length === 0 ? (
          <Card className="text-center py-10 text-gray-500 text-sm">
            暂无锻炼活动
          </Card>
        ) : (
          <div className="grid gap-5">
            {coachActivities.map(activity => (
              <div 
                key={activity.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <ImageCarousel imageUrls={activity.imageUrls} heightClass="h-48" />
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{activity.description}</p>
                  
                  <div className="flex items-center text-xs text-gray-400 gap-4 font-medium border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{activity.coachName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>发布于 {activity.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
