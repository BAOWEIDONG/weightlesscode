import React, { useMemo, useState } from 'react';
import { useApp, MOCK_STUDENTS } from '../AppContext';
import { NavBar, Card } from './ui';
import { rankStudents } from '../lib/scoring';
import { Trophy, Download, ChevronRight } from 'lucide-react';

const OlympicMedal = ({ rank, className = '' }: { rank: 1 | 2 | 3; className?: string }) => {
  const config = {
    1: { bg: '#FDE047', border: '#EAB308', text: '#A16207' }, // Gold
    2: { bg: '#E2E8F0', border: '#94A3B8', text: '#475569' }, // Silver
    3: { bg: '#FDBA74', border: '#F97316', text: '#C2410C' }, // Bronze
  }[rank];

  if (!config) return null;

  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 0L10.5 9H12V0H6Z" fill="#3B82F6"/>
      <path d="M12 0V9H13.5L18 0H12Z" fill="#EF4444"/>
      <circle cx="12" cy="14" r="8" fill={config.bg} stroke={config.border} strokeWidth="1.5" />
      <circle cx="12" cy="14" r="5" fill="none" stroke={config.border} strokeWidth="0.5" />
    </svg>
  );
};

export const RankingView = () => {
  const { setCurrentView, goBack, dietRecords, exerciseRecords, user, setSelectedStudentId } = useApp();
  const [toast, setToast] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

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

  const handleScrollToMe = () => {
    if (!user) return;
    const el = document.getElementById(`rank-row-${user.id}`);
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setHighlightedId(user.id);
      setTimeout(() => {
        setHighlightedId(null);
      }, 1500);
    }
  };

  const currentUserRank = useMemo(() => {
    return rankedStudents.find(s => s.studentId === user?.id);
  }, [rankedStudents, user]);

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
            {user?.role === 'dietitian' ? (
              <>
                <h2 className="text-xl font-bold mb-1">共 {rankedStudents.length} 名学员参与排名</h2>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-1 leading-snug">
                  当前我的排名位于 <span onClick={handleScrollToMe} className="text-white border-b border-white/60 cursor-pointer pb-0.5">{currentUserRank?.rank || '--'}</span> 位，<br/>
                  总积分 <span onClick={() => user && handleRowClick(user.id)} className="text-white border-b border-white/60 cursor-pointer pb-0.5">{currentUserRank?.totalScore || 0}</span> 分
                </h2>
                <p className="text-xs opacity-90 mt-2">坚持打卡，健康生活每一天！</p>
              </>
            )}
          </div>
          <Trophy className="absolute right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
        </div>

        {rankedStudents.map((student) => {
          const isCurrentUser = user?.id === student.studentId;
          const isClickable = user?.role === 'dietitian' || isCurrentUser;
          const isHighlighted = highlightedId === student.studentId;
          
          return (
            <Card 
              key={student.studentId}
              id={`rank-row-${student.studentId}`}
              className={`p-4 flex items-center transition-all duration-300 ${isCurrentUser ? 'bg-green-50/30' : ''} ${isHighlighted ? 'ring-2 ring-[#FF976A] bg-orange-50/50 scale-[1.02]' : ''}`}
            >
              <div className="w-12 mr-3 flex items-center justify-center shrink-0 relative">
                <span className={`text-4xl font-black italic tracking-tighter ${
                  student.rank === 1 ? 'text-yellow-500 drop-shadow-md' : 
                  student.rank === 2 ? 'text-gray-400 drop-shadow-md' : 
                  student.rank === 3 ? 'text-amber-600 drop-shadow-md' : 
                  'text-gray-300'
                }`}>
                  {student.rank}
                </span>
                {student.rank <= 3 && (
                  <OlympicMedal rank={student.rank as 1 | 2 | 3} className="absolute -top-3 -right-3 w-8 h-8 drop-shadow-sm" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 flex items-center gap-2 truncate">
                  <span className="truncate">{student.name}</span>
                  {isCurrentUser && <span className="text-[10px] bg-[#07C160] text-white px-1.5 py-0.5 rounded shrink-0">我</span>}
                </div>
              </div>
              
              <div 
                className={`flex items-center gap-1 pl-3 py-1 ml-2 ${isClickable ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity' : 'opacity-80'}`}
                onClick={() => handleRowClick(student.studentId)}
              >
                <div className="text-right flex flex-col items-end justify-center">
                  <div className="text-[22px] font-black text-[#FF976A] leading-none tracking-tighter">{student.totalScore}</div>
                  <div className="text-[10px] text-gray-400 mt-1">积分详情</div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isClickable ? 'text-gray-300' : 'text-transparent'}`} />
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
