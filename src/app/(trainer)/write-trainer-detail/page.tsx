'use client';
import Button from '@/components/Button/Button';
import TopBottomBarTemplate from '@/components/Template/TopBottomBarPage';
import InputMediumText from '@/components/Text/InputMediumText';
import AddTrainerPhotoVideoTab from '@/components/pages/write-trainer-detail/AddTrainerPhotoVideoTab';
import WriteTrainerDetailInfoTab from '@/components/pages/write-trainer-detail/WriteTrainerDetailInfoTab';
import { userState } from '@/recoil/state';
import BackSpaceArrow from '@/svgs/BackSpaceArrow.svg';
import Building from '@/svgs/Building.svg';
import Clock from '@/svgs/Clock.svg';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { twMerge } from 'tailwind-merge';
import NoProfile from '@/svgs/NoProfile.svg';

type Props = {};
type WriteTrainerDetailTab = '상세내용' | '사진/동영상';
const WRITE_TRAINER_DETAIL_TABS: WriteTrainerDetailTab[] = [
  '상세내용',
  '사진/동영상',
];
const WriteTrainerDetailPage = (props: Props) => {
  const router = useRouter();
  const [userData, seUserData] = useRecoilState(userState);
  const [profileData, setProfileData] = useState({
    name: userData.name,
    startTime: '',
    endTime: '',
    introduction: '',
    career: '',
    cost: '',
    nickname: userData.nickname,
    reviewAvg: '',
    month: '',
    university: '',
  });
  const [profileImages, setProfileImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] =
    useState<WriteTrainerDetailTab>('상세내용');
  const [infoTabData, setInfoTabData] = useState(profileData);

  const handleChange = (key: string, value: string) => {
    setProfileData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleImagesChange = (images: File[]) => {
    setProfileImages(images);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append('dto', JSON.stringify(profileData));

      profileImages.forEach((image) => {
        formDataToSend.append('profileImages', image);
      });

      console.log('formDataToSend', formDataToSend);
      const response = await axios.post(
        'https://서비스.한국/trainers/profiles',
        formDataToSend,
        { headers }
      );
      console.log(response.data);
      setLoading(false);
      setError(null);
      // router.push('/health-management');
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError('에러가 발생했습니다.');
    }
  };

  return (
    <TopBottomBarTemplate
      _topNode={
        <div className="relative flex h-full w-full items-center">
          <div className="absolute left-[22px]">
            <BackSpaceArrow onClick={() => router.back()} />
          </div>
          <div className="flex flex-1 justify-center font-noto text-[18px] font-bold text-primary-400">
            트레이너
          </div>
        </div>
      }
      _bottomNode={
        <div className="px-[21px] pb-[46px] pt-[10px]">
          <div className="relative h-[43px] w-full overflow-hidden rounded-[6px]">
            <Button
              ring={'primary-400'}
              color={'white'}
              background={'primary-400'}
              className="h-full w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '저장 중...' : '완료'}
            </Button>
          </div>
        </div>
      }
      _contentDivProps={{ className: 'bg-white' }}
    >
      <div className="w-full">
        <div className="relative w-full pb-[50%]">
          <div className="absolute inset-0 flex bg-[#dbdbdb]">
            <div className="flex flex-col items-start justify-end pb-4 pl-6">
              <p className="font-noto text-[15px] font-medium text-white">
                트레이너
              </p>
              <h1 className="font-noto text-[25px] font-bold text-white">
                {userData.name}
              </h1>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <NoProfile />
            </div>
            <div className="absolute inset-0 flex items-end justify-end pb-4 pr-6">
              <Button
                ring={'primary-400'}
                color={'white'}
                background={'primary-400'}
                className="h-[20px] w-[75px] rounded-[4px] bg-opacity-50 text-[10px] font-light ring-opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                사진 바꾸기
              </Button>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 p-[22px]">
          <div className="flex h-[18px] gap-[14px]">
            <Building />
            <InputMediumText
              _label="소속: "
              _input={profileData.university}
              _placeholder="내용을 입력하세요."
              _onChange={(value) =>
                setProfileData({ ...profileData, university: value })
              }
            />
          </div>
          <div className="flex h-[18px] items-center gap-[14px]">
            <Clock />
            <div className="flex">
              <InputMediumText
                _label="연락 가능 시간: "
                _input={profileData.startTime}
                _placeholder="09:00"
                _onChange={(value) =>
                  setProfileData({ ...profileData, startTime: value })
                }
              />
              <InputMediumText
                _label="~"
                _input={profileData.endTime}
                _placeholder="18:00"
                _onChange={(value) =>
                  setProfileData({ ...profileData, endTime: value })
                }
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex gap-[18px] border-b border-[#F3F3F3] px-[22px]">
            {WRITE_TRAINER_DETAIL_TABS.map((tab) => (
              <div
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={twMerge(
                  'h-full translate-y-[1px] font-noto  font-bold text-[#C1C1C1]',
                  currentTab === tab &&
                    'border-b-2 border-[#434343] text-[#434343]'
                )}
              >
                {tab === '사진/동영상' ? tab : tab}
              </div>
            ))}
          </div>
          <div className="px-[22px] pb-[90px] pt-5">
            {currentTab === '상세내용' && (
              <WriteTrainerDetailInfoTab
                formData={infoTabData}
                onChange={(key, value) => {
                  setInfoTabData((prevData) => ({
                    ...prevData,
                    [key]: value,
                  }));
                  setProfileData((prevData) => ({
                    ...prevData,
                    [key]: value,
                  }));
                }}
              />
            )}
            {currentTab === '사진/동영상' && (
              <AddTrainerPhotoVideoTab
                profileImages={profileImages}
                onImagesChange={handleImagesChange}
              />
            )}
          </div>
        </div>
      </div>
    </TopBottomBarTemplate>
  );
};

export default WriteTrainerDetailPage;
