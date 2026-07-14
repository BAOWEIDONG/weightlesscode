import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Button, Input, NavBar } from './ui';
import { MessageCircle, UserCircle, Dumbbell, Leaf, Activity } from 'lucide-react';

export const LoginView = () => {
  const { setUser, setCurrentView } = useApp();
  const [step, setStep] = useState<1 | 2>(1); // 1: WeChat Auth, 2: Phone Binding
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [role, setRole] = useState<'student' | 'coach' | 'dietitian'>('student');
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState('');

  const handleWeChatLogin = () => {
    // Simulate WeChat login delay
    setTimeout(() => {
      setStep(2);
      setError('');
    }, 1000);
  };

  const handlePhoneSubmit = () => {
    if (!agreed) {
      setError('请先勾选同意《服务协议》与《隐私政策》');
      return;
    }
    if (phone.length === 11 && code.length === 6) {
      setError('');
      setUser({
        id: role === 'student' ? 's1' : `usr_${Date.now()}`,
        role,
        name: role === 'student' ? '李明' : (role === 'coach' ? '李教练' : '王营养师'),
        phone,
      });
      if (role === 'coach') {
        setCurrentView('coach-dashboard');
      } else if (role === 'dietitian') {
        setCurrentView('dietitian-dashboard');
      } else {
        setCurrentView('questionnaire');
      }
    } else {
      setError('请输入正确的11位手机号和6位验证码');
    }
  };

  if (step === 1) {
    return (
      <div className="flex h-full flex-col bg-[#F7F8FA]">
        <NavBar title="授权登录" />
        <div className="flex flex-1 flex-col items-center justify-center p-6 space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#07C160]">
              <Activity className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">28天营养减重</h1>
            <p className="text-gray-500 text-center text-sm px-4">科学减脂，专业指导，开启你的28天健康蜕变之旅</p>
          </div>
          
          <div className="w-full space-y-4">
            <div className="grid grid-cols-3 gap-3 mb-8">
              <button
                onClick={() => setRole('student')}
                className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${
                  role === 'student' ? 'border-[#07C160] bg-[#07C160]/5' : 'border-gray-100 bg-white hover:border-[#07C160]/30'
                }`}
              >
                <div className={`p-2 rounded-full mb-2 ${role === 'student' ? 'bg-[#07C160] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <UserCircle className="w-6 h-6" />
                </div>
                <span className={`text-sm font-bold ${role === 'student' ? 'text-[#07C160]' : 'text-gray-600'}`}>学员</span>
              </button>
              <button
                onClick={() => setRole('coach')}
                className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${
                  role === 'coach' ? 'border-[#FF976A] bg-[#FF976A]/5' : 'border-gray-100 bg-white hover:border-[#FF976A]/30'
                }`}
              >
                <div className={`p-2 rounded-full mb-2 ${role === 'coach' ? 'bg-[#FF976A] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Dumbbell className="w-6 h-6" />
                </div>
                <span className={`text-sm font-bold ${role === 'coach' ? 'text-[#FF976A]' : 'text-gray-600'}`}>教练</span>
              </button>
              <button
                onClick={() => setRole('dietitian')}
                className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${
                  role === 'dietitian' ? 'border-[#1677FF] bg-[#1677FF]/5' : 'border-gray-100 bg-white hover:border-[#1677FF]/30'
                }`}
              >
                <div className={`p-2 rounded-full mb-2 ${role === 'dietitian' ? 'bg-[#1677FF] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Leaf className="w-6 h-6" />
                </div>
                <span className={`text-sm font-bold ${role === 'dietitian' ? 'text-[#1677FF]' : 'text-gray-600'}`}>营养师</span>
              </button>
            </div>

            <Button className="w-full flex items-center gap-2" size="lg" onClick={handleWeChatLogin}>
              <MessageCircle className="h-5 w-5" />
              登录/注册
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <NavBar title="绑定手机号" onBack={() => setStep(1)} />
      
      <div className="flex-1 flex flex-col px-8 pt-12 pb-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">安全验证</h2>
          <p className="text-sm text-gray-500">为了保障您的账号安全，请绑定您的常用手机号</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-1 relative">
            <input
              type="tel"
              placeholder="请输入11位手机号"
              className="w-full border-b border-gray-200 py-4 px-2 text-lg focus:border-[#07C160] focus:outline-none transition-colors bg-transparent placeholder-gray-300"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              maxLength={11}
            />
          </div>
          
          <div className="space-y-1 relative flex items-center border-b border-gray-200 focus-within:border-[#07C160] transition-colors">
            <input
              type="number"
              placeholder="请输入6位验证码"
              className="flex-1 py-4 px-2 text-lg focus:outline-none bg-transparent placeholder-gray-300"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              maxLength={6}
            />
            <button 
              className="text-[#07C160] font-medium text-sm px-4 whitespace-nowrap active:opacity-70 transition-opacity"
              onClick={() => { setCode('123456'); setError(''); }}
            >
              获取验证码
            </button>
          </div>
        </div>
        
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        
        <div className="mt-12">
          <Button className="w-full h-12 text-base font-medium rounded-full shadow-lg shadow-[#07C160]/20" onClick={handlePhoneSubmit}>
            确认绑定
          </Button>
          <div className="flex items-center justify-center gap-2 mt-6">
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={(e) => { setAgreed(e.target.checked); setError(''); }}
              className="w-3 h-3 text-[#07C160] rounded border-gray-300 focus:ring-[#07C160]"
            />
            <p className="text-[10px] text-gray-400 text-center">
              我已阅读并同意<a href="#" className="text-[#07C160] hover:underline" onClick={(e) => { e.preventDefault(); alert('服务协议详细内容'); }}>《服务协议》</a>与<a href="#" className="text-[#07C160] hover:underline" onClick={(e) => { e.preventDefault(); alert('隐私政策详细内容'); }}>《隐私政策》</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
