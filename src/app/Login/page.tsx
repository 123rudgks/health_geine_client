'use client';
import React from 'react';
import Button from '@/components/Button/Button';
import Google from '@/svgs/Google.svg';
import HealthGenie from '@/svgs/HealthGenieTitle.svg';
import KakaoTalk from '@/svgs/KakaoTalk.svg';
import MainLogo from '@/svgs/MainLogo.svg';
import { useRouter } from 'next/navigation';
import ReactQueryClientProvider from '../ReactQueryClientProvider';
import { BASE_URL } from '@/utils/routePath';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    router.push(`https://${BASE_URL}/oauth2/authorization/google`);
  };

  const handleKakaoLogin = () => {
    router.push(`https://${BASE_URL}/oauth2/authorization/kakao`);
  };

  return (
    <ReactQueryClientProvider>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-[328px] flex-col gap-10">
          <div className="flex flex-col items-center gap-4">
            <MainLogo />
            <HealthGenie />
            <span className="font-noto text-[15px] font-bold text-[#A6BCFF]">
              우리 학교 내 트레이너 매칭 서비스
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleGoogleLogin}
              ring={'gray-100'}
              color={'gray-400'}
              background={'white'}
              className="flex h-10 w-full items-center justify-center gap-3 rounded font-bold"
            >
              <Google /> 구글로 로그인하기
            </Button>
            <Button
              onClick={handleKakaoLogin}
              ring={'yellow'}
              color={'gray-400'}
              background={'yellow'}
              className="flex h-10 w-full items-center justify-center gap-3 rounded font-bold "
            >
              <KakaoTalk /> 카카오로 로그인하기
            </Button>
          </div>
        </div>
      </div>
    </ReactQueryClientProvider>
  );
}
