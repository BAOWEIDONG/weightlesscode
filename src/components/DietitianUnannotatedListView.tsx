import React from 'react';
import { useApp } from '../AppContext';
import { NavBar, Card } from './ui';
import { UserCircle, Coffee, Clock } from 'lucide-react';
import { MOCK_STUDENTS } from '../AppContext';

const MEAL_TYPES = [
  { id: 'breakfast', label: '早餐' },
  { id: 'lunch', label: '午餐' },
  { id: 'dinner', label: '晚餐' },
  { id: 'snack', label: '加餐' },
];

export const DietitianUnannotatedListView = () => {
  const { setCurrentView, setSelectedStudentId, dietRecords } = useApp();

  // Filter records that don't have a dietitian comment
  const unannotatedRecords = dietRecords.filter(r => !r.dietitianComment);

  // Group by student
  const studentRecords = new Map<string, typeof unannotatedRecords>();
  
  // Initialize with empty arrays for students that have unannotated records
  unannotatedRecords.forEach(record => {
    // We assume every record has a studentId property, but since DietRecord doesn't currently 
    // have studentId in our types, let's use a mock logic or map them round-robin for demonstration
    // Since this is a demo, let's just pick random students for the unannotated records if studentId is missing.
    const sId = (record as any).studentId || MOCK_STUDENTS[0].id;
    if (!studentRecords.has(sId)) {
      studentRecords.set(sId, []);
    }
    studentRecords.get(sId)!.push(record);
  });

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-safe">
      <NavBar title="待批注饮食" onBack={() => setCurrentView('dietitian-dashboard')} />
      
      <div className="p-4 space-y-4">
        {Array.from(studentRecords.entries()).map(([studentId, records]) => {
          const student = MOCK_STUDENTS.find(s => s.id === studentId);
          if (!student) return null;

          return (
            <Card key={studentId} className="p-0 overflow-hidden border border-gray-100">
              <div 
                className="p-4 flex items-center justify-between bg-white cursor-pointer hover:bg-gray-50 border-b border-gray-50"
                onClick={() => {
                  setSelectedStudentId(student.id);
                  setCurrentView('dietitian-student-detail');
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-[#FF976A]/10 flex items-center justify-center text-[#FF976A]">
                    <UserCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{student.name}</div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      等待批注：{records.length} 条记录
                    </div>
                  </div>
                </div>
                <div className="text-[#FF976A] font-bold">›</div>
              </div>
              
              <div className="bg-gray-50/50 p-4 space-y-3">
                {records.slice(0, 2).map(record => (
                  <div 
                    key={record.id} 
                    className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm cursor-pointer"
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setCurrentView('dietitian-student-detail');
                    }}
                  >
                    {record.photos && record.photos.length > 0 ? (
                      <img src={record.photos[0]} alt="食物" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Coffee className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded text-[#FF976A] bg-[#FF976A]/10 font-bold uppercase">
                          {MEAL_TYPES.find(m => m.id === record.meal)?.label}
                        </span>
                        <span className="text-xs text-gray-500">{record.date}</span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-2">{record.description}</p>
                    </div>
                  </div>
                ))}
                {records.length > 2 && (
                  <div 
                    className="text-xs text-center text-gray-500 pt-2 cursor-pointer"
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setCurrentView('dietitian-student-detail');
                    }}
                  >
                    查看全部 {records.length} 条记录
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {unannotatedRecords.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
            暂无待批注饮食记录，大家表现都很好！
          </div>
        )}
      </div>
    </div>
  );
};
