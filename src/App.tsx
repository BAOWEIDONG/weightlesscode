/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './AppContext';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { QuestionnaireView } from './components/QuestionnaireView';
import { UploadView } from './components/UploadView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { HealthProfileView } from './components/HealthProfileView';
import { ExerciseView } from './components/ExerciseView';
import { DietView } from './components/DietView';
import { CalendarView } from './components/CalendarView';
import { CoachDashboardView } from './components/CoachDashboardView';
import { CoachRecordView } from './components/CoachRecordView';
import { WeightCheckinView } from './components/WeightCheckinView';
import { VideosListView } from './components/VideosListView';
import { VideoPlayerView } from './components/VideoPlayerView';
import { VideoUploadView } from './components/VideoUploadView';
import { DietitianDashboardView } from './components/DietitianDashboardView';
import { DietitianStudentDetailView } from './components/DietitianStudentDetailView';
import { CampStatsView } from './components/CampStatsView';

const AppContent = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case 'login': return <LoginView />;
    case 'register': return <RegisterView />;
    case 'questionnaire': return <QuestionnaireView />;
    case 'upload': return <UploadView />;
    case 'dashboard': return <StudentDashboardView />;
    case 'health-profile': return <HealthProfileView />;
    case 'exercise': return <ExerciseView />;
    case 'diet': return <DietView />;
    case 'weight-checkin': return <WeightCheckinView />;
    case 'calendar': return <CalendarView />;
    case 'coach-dashboard': return <CoachDashboardView />;
    case 'coach-record-upload': return <CoachRecordView />;
    case 'video-upload': return <VideoUploadView />;
    case 'videos-list': return <VideosListView />;
    case 'video-player': return <VideoPlayerView />;
    case 'dietitian-dashboard': return <DietitianDashboardView />;
    case 'dietitian-student-detail': return <DietitianStudentDetailView />;
    case 'camp-stats': return <CampStatsView />;
    default: return <LoginView />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="mx-auto max-w-md h-screen overflow-hidden bg-[#F7F8FA] font-sans text-gray-700 shadow-2xl sm:border-x sm:border-gray-100 relative">
        <AppContent />
      </div>
    </AppProvider>
  );
}

