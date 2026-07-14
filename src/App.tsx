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
import { ActivitiesListView } from './components/ActivitiesListView';
import { ActivityUploadView } from './components/ActivityUploadView';
import { DietitianDashboardView } from './components/DietitianDashboardView';
import { DietitianStudentDetailView } from './components/DietitianStudentDetailView';
import { DietitianUnannotatedListView } from './components/DietitianUnannotatedListView';
import { CampStatsView } from './components/CampStatsView';
import { RankingView } from './components/RankingView';
import { PointsDetailView } from './components/PointsDetailView';

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
    case 'activity-upload': return <ActivityUploadView />;
    case 'activities-list': return <ActivitiesListView />;
    case 'dietitian-dashboard': return <DietitianDashboardView />;
    case 'dietitian-student-detail': return <DietitianStudentDetailView />;
    case 'dietitian-unannotated-list': return <DietitianUnannotatedListView />;
    case 'camp-stats': return <CampStatsView />;
    case 'ranking': return <RankingView />;
    case 'pointsDetail': return <PointsDetailView />;
    default: return <LoginView />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="w-full h-[100dvh] max-w-md mx-auto overflow-hidden bg-[#F7F8FA] font-sans text-gray-700 sm:shadow-2xl sm:border-x sm:border-gray-100 relative">
        <AppContent />
      </div>
    </AppProvider>
  );
}

