'use client';
import { loginState, userState } from '@/recoil/state';
import SearchTrainer from '@/svgs/SelectTrainer.svg';
import SearchUser from '@/svgs/SelectUser.svg';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { BASE_URL, ACCESS_TOKEN } from '@/utils/routePath';

type Props = {};

const TrainerSelectPage = () => {
  const router = useRouter();
  const [user, setUserState] = useRecoilState(userState);
  const setUser = useSetRecoilState(userState);
  const setLoginState = useSetRecoilState(loginState);

  const handleUser = async (role: string) => {
    const res = await axios.patch(
      `https://${BASE_URL}/users/role`,
      { role: role },
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );

    return res.data.data;
  };

  const fetchData = async (role: string) => {
    try {
      const data = await handleUser(role);
      setUser(data);
      setLoginState((prevLoginState) => ({
        ...prevLoginState,
        role: role,
      }));
      router.push('/health-management');
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-[332px] flex-col items-center gap-5">
        <span className="font-noto text-xl font-bold text-[#4B76F4]">
          해당 부분을 선택해주세요!
        </span>
        <div className="flex w-full gap-7">
          <div
            onClick={() => {
              fetchData('ROLE_USER');
              setUserState({ ...user, role: 'ROLE_USER' });
            }}
            className="flex h-[204px] flex-1 flex-col items-center justify-center rounded-[20px] bg-primary-400"
          >
            <SearchUser />
            <span className="font-noto text-xl font-thin text-white">
              일반회원
            </span>
          </div>
          <div
            onClick={() => {
              fetchData('ROLE_TRAINER');
              setUserState({ ...user, role: 'ROLE_TRAINER' });
            }}
            className="flex h-[204px] flex-1 flex-col items-center justify-center rounded-[20px] bg-primary-400"
          >
            <SearchTrainer />
            <span className="font-noto text-xl font-thin text-white">
              트레이너
            </span>
          </div>
        </div>
        <div className="font-noto text-sm text-primary-400">
          선택 후 로그인이 진행됩니다.
        </div>
      </div>
    </div>
  );
};

export default TrainerSelectPage;
