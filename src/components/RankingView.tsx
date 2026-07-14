import React, { useMemo, useState } from 'react';
import { useApp, MOCK_STUDENTS } from '../AppContext';
import { NavBar, Card, Button } from './ui';
import { rankStudents } from '../lib/scoring';
import { Trophy, Medal, Download } from 'lucide-react';

export const RankingView = () => {
  const { setCurrentView, goBack, dietRecords, exerciseRecords, user, setSelectedStudentId } = useApp();
  const [toast, setToast] = useState('');

  const rankedStudents = useMemo(() => {
    return rankStudents(MOCK_STUDENTS, dietRecords, exerciseRecords);
  }, [dietRecords, exerciseRecords]);

  const handleExportCSV = () => {
    const BOM = '\uFEFF';
    let csvContent = '排名,姓名,总积分,饮食积分,运动积分\n';
    
    rankedStudents.forEach(row => {
      csvContent += `${row.rank},${row.name},${row.totalScore},${row.dietScore},${row.exerciseScore}\n`;
    });

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `学员积分排名_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowClick = (studentId: string) => {
    if (user?.role === 'student' && user.id !== studentId) {
      setToast('仅可查看自己的明细');
      setTimeout(() => setToast(''), 2000);
      return;
    }
    setSelectedStudentId(studentId);
    setCurrentView('pointsDetail');
  };

  return (
    <div className="flex h-full flex-col bg-[#F7F8FA] relative">
      <NavBar 
        title="积分排行" 
        onBack={goBack} 
        right={
          user?.role === 'dietitian' ? (
            <button onClick={handleExportCSV} className="text-gray-500 hover:text-gray-900 p-2">
              <Download className="w-5 h-5" />
            </button>
          ) : undefined
        }
      />
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
        <div className="bg-gradient-to-r from-[#FF976A] to-[#ffb191] rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-1">训练营积分榜</h2>
            <p className="text-sm opacity-90">坚持打卡，健康生活每一天！</p>
          </div>
          <Trophy className="absolute right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
        </div>

        {rankedStudents.map((student) => {
          const isCurrentUser = user?.id === student.studentId;
          const isTop3 = student.rank <= 3;
          const isClickable = user?.role === 'dietitian' || isCurrentUser;
          
          return (
            <Card 
              key={student.studentId}
              className={`p-4 flex items-center transition-transform hover:scale-[1.02] ${isCurrentUser ? 'ring-2 ring-[#07C160] bg-green-50/50' : ''} ${isClickable ? 'cursor-pointer' : 'opacity-80'}`}
              onClick={() => handleRowClick(student.studentId)}
            >
              <div className="w-12 h-8 mr-2 flex flex-col items-center justify-center font-bold">
                {student.rank === 1 ? <Medal className="w-6 h-6 text-yellow-500" /> :
                 student.rank === 2 ? <Medal className="w-6 h-6 text-gray-400" /> :
                 student.rank === 3 ? <Medal className="w-6 h-6 text-amber-600" /> :
                 <span className="text-gray-400 text-lg">{student.rank}</span>}
              </div>
              
              <div className="flex-1">
                <div className="font-bold text-gray-900 flex items-center gap-2 mb-0.5">
                  {student.name}
                  {isCurrentUser && <span className="text-[10px] bg-[#07C160] text-white px-1.5 py-0.5 rounded">我</span>}
                </div>
                <div className="text-[10px] text-gray-500">总排名第 {student.rank} 位</div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-[#FF976A]">{student.totalScore}</div>
                <div className="text-[10px] text-gray-500">总积分</div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {toast && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm z-50">
          {toast}
        </div>
      )}
    </div>
  );
};
