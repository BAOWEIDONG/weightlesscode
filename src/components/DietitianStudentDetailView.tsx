import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card, Button, Input } from './ui';
import { UserCircle, Coffee, MessageCircle } from 'lucide-react';
import { MOCK_STUDENTS } from './CoachDashboardView';
import { format } from 'date-fns';

const MEAL_TYPES = [
  { id: 'breakfast', label: '早餐' },
  { id: 'lunch', label: '午餐' },
  { id: 'dinner', label: '晚餐' },
  { id: 'snack', label: '加餐' },
];

export const DietitianStudentDetailView = () => {
  const { setCurrentView, selectedStudentId, dietRecords, updateDietRecord, user } = useApp();
  const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId);

  // In a real app, we would filter dietRecords by studentId. 
  // For this mock, we just show all records to demonstrate functionality.
  const records = [...dietRecords].sort((a, b) => b.date.localeCompare(a.date));

  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  if (!student) {
    return (
      <div className="flex h-screen flex-col bg-[#F7F8FA] pb-safe">
        <NavBar title="学员详情" onBack={() => setCurrentView('dietitian-dashboard')} />
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          未选择学员
        </div>
      </div>
    );
  }

  const handleSaveComment = (recordId: string) => {
    updateDietRecord(recordId, {
      dietitianComment: commentText,
      dietitianId: user?.id,
      dietitianName: user?.name || '营养师'
    });
    setCommentingId(null);
    setCommentText('');
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-safe">
      <NavBar title={`${student.name} 的饮食记录`} onBack={() => setCurrentView('dietitian-dashboard')} />
      
      <div className="p-4 space-y-4">
        <Card className="flex items-center space-x-3 p-4 bg-[#FF976A]/5 border-[#FF976A]/20">
          <div className="h-10 w-10 rounded-full bg-[#FF976A]/10 flex items-center justify-center text-[#FF976A]">
            <UserCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 mb-1">{student.name}</div>
            <div className="text-xs text-gray-500">
              {student.gender === 'male' ? '男' : '女'} · {student.age}岁 · {student.phone}
            </div>
          </div>
        </Card>

        {records.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
            暂无饮食打卡记录
          </div>
        ) : (
          <div className="space-y-4">
            {records.map(record => (
              <Card key={record.id} className="p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500 font-medium">{record.date}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded text-[#FF976A] bg-[#FF976A]/10 font-bold uppercase">
                      {MEAL_TYPES.find(m => m.id === record.meal)?.label}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-3 whitespace-pre-wrap">{record.description}</p>
                  
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {record.photos?.map((url, idx) => (
                      <img key={idx} src={url} alt="食物" className="h-20 w-20 object-cover rounded-lg shrink-0 border border-gray-100" />
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50/50">
                  {commentingId === record.id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:border-[#FF976A]"
                        rows={3}
                        placeholder="输入专业批注..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCommentingId(null)}>取消</Button>
                        <Button className="bg-[#FF976A] hover:bg-[#c47f66] text-white" size="sm" onClick={() => handleSaveComment(record.id)}>保存</Button>
                      </div>
                    </div>
                  ) : record.dietitianComment ? (
                    <div className="relative group">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#FF976A]">您的批注</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {record.dietitianComment}
                      </p>
                      <button 
                        onClick={() => {
                          setCommentingId(record.id);
                          setCommentText(record.dietitianComment || '');
                        }}
                        className="text-xs text-[#1677FF] mt-2 block"
                      >
                        编辑
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setCommentingId(record.id);
                        setCommentText('');
                      }}
                      className="flex items-center gap-1 text-sm text-[#FF976A] font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      添加批注
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
