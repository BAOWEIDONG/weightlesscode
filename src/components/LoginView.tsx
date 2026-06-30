import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Button, Input, NavBar } from './ui';
import { MessageCircle } from 'lucide-react';

export const LoginView = () => {
  const { setUser, setCurrentView } = useApp();
  const [step, setStep] = useState<1 | 2>(1); // 1: WeChat Auth, 2: Phone Binding
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [role, setRole] = useState<'student' | 'coach' | 'dietitian'>('student');

  const [error, setError] = useState('');

  const handleWeChatLogin = () => {
    // Simulate WeChat login delay
    setTimeout(() => {
      setStep(2);
      setError('');
    }, 1000);
  };

  const handlePhoneSubmit = () => {
    if (phone.length === 11 && code.length === 6) {
      setError('');
      setUser({
        id: `usr_${Date.now()}`,
        role,
        name: '',
        phone,
      });
      if (role === 'coach') {
        setCurrentView('coach-dashboard');
      } else if (role === 'dietitian') {
        setCurrentView('dietitian-dashboard');
      } else {
        setCurrentView('register');
      }
    } else {
      setError('请输入正确的11位手机号和6位验证码');
    }
  };

  if (step === 1) {
    return (
      <div className="flex h-screen flex-col bg-[#F7F8FA]">
        <NavBar title="授权登录" />
        <div className="flex flex-1 flex-col items-center justify-center p-6 space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#07C160]">
              <MessageCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">新项目开营</h1>
            <p className="text-gray-500 text-center text-sm">授权获取您的微信头像和昵称</p>
          </div>
          
          <div className="w-full space-y-4">
            <div className="flex justify-center space-x-4 mb-6">
              <label className="flex items-center space-x-2 text-sm">
                <input type="radio" checked={role === 'student'} onChange={() => setRole('student')} className="text-[#07C160]" />
                <span>我是学员</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input type="radio" checked={role === 'coach'} onChange={() => setRole('coach')} className="text-[#07C160]" />
                <span>我是教练</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input type="radio" checked={role === 'dietitian'} onChange={() => setRole('dietitian')} className="text-[#07C160]" />
                <span>我是营养师</span>
              </label>
            </div>

            <Button className="w-full flex items-center gap-2" size="lg" onClick={handleWeChatLogin}>
              <MessageCircle className="h-5 w-5" />
              微信一键登录
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F7F8FA]">
      <NavBar title="绑定手机号" onBack={() => setStep(1)} />
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">手机号码</label>
            <Input
              type="tel"
              placeholder="请输入11位手机号"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              maxLength={11}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">验证码</label>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="6位验证码"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                maxLength={6}
              />
              <Button variant="outline" className="shrink-0 w-32" onClick={() => { setCode('123456'); setError(''); }}>
                获取验证码
              </Button>
            </div>
          </div>
        </div>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
        <Button className="w-full" size="lg" onClick={handlePhoneSubmit}>
          确认绑定
        </Button>
      </div>
    </div>
  );
};
