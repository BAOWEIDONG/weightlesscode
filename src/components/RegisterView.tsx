import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Button, Input, NavBar, Card } from './ui';

export const RegisterView = () => {
  const { user, setUser, setCurrentView } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    age: '',
    height: '',
    medicalHistory: '',
    allergies: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!formData.name || !formData.age || !formData.height) {
      setError('请填写所有必填项');
      return;
    }
    
    setUser({
      ...user!,
      name: formData.name,
      gender: formData.gender as any,
      age: Number(formData.age),
      height: Number(formData.height),
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies,
    });
    setCurrentView('questionnaire');
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA] overflow-y-auto pb-8">
      <NavBar title="完善基本信息" />
      <div className="p-4 space-y-4">
        <Card className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">姓名 <span className="text-red-500">*</span></label>
            <Input
              placeholder="请输入您的真实姓名"
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">性别 <span className="text-red-500">*</span></label>
            <div className="flex gap-4 pt-2">
              <label className="flex items-center space-x-2">
                <input type="radio" checked={formData.gender === 'male'} onChange={() => setFormData(p => ({ ...p, gender: 'male' }))} className="text-[#07C160]" />
                <span>男</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" checked={formData.gender === 'female'} onChange={() => setFormData(p => ({ ...p, gender: 'female' }))} className="text-[#07C160]" />
                <span>女</span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">年龄 <span className="text-red-500">*</span></label>
            <Input
              type="number"
              placeholder="请输入年龄"
              value={formData.age}
              onChange={(e) => setFormData(p => ({ ...p, age: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">身高 (cm) <span className="text-red-500">*</span></label>
            <Input
              type="number"
              placeholder="请输入身高"
              value={formData.height}
              onChange={(e) => setFormData(p => ({ ...p, height: e.target.value }))}
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">既往病史 (选填)</label>
            <textarea
              className="w-full rounded-lg border border-gray-100 p-3 text-base focus:outline-none focus:border-[#07C160]"
              rows={3}
              placeholder="如高血压、糖尿病等"
              value={formData.medicalHistory}
              onChange={(e) => setFormData(p => ({ ...p, medicalHistory: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">过敏史 (选填)</label>
            <textarea
              className="w-full rounded-lg border border-gray-100 p-3 text-base focus:outline-none focus:border-[#07C160]"
              rows={3}
              placeholder="如海鲜过敏、青霉素过敏等"
              value={formData.allergies}
              onChange={(e) => setFormData(p => ({ ...p, allergies: e.target.value }))}
            />
          </div>
        </Card>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <div className="pt-4">
          <Button className="w-full" size="lg" onClick={handleSubmit}>
            下一步
          </Button>
        </div>
      </div>
    </div>
  );
};
