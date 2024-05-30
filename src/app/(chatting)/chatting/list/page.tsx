'use client';
import BottomNavigationBar from '@/components/BottomNavigationBar/BottomNavigationBar';
import TopBottomBarTemplate from '@/components/Template/TopBottomBarPage';
import ChatListItem from '@/components/pages/chatting/ChatListItem';
import { IChatListContent, chatListState } from '@/recoil/state';
import BackSpaceArrow from '@/svgs/BackSpaceArrow.svg';
import { KEY_CHATLIST } from '@/utils/queryKey';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import ChatListEmpty from '@/svgs/ChatListEmpty.svg';
import { BASE_URL } from '@/utils/routePath';
import { getChatList } from '@/apis/api';
import Link from 'next/link';

type Props = {};

const ChattingList = (props: Props) => {
  const [chatListData, setChatListData] = useRecoilState(chatListState);

  const { data: chatListDataQuery } = useQuery(KEY_CHATLIST, getChatList, {
    onSuccess: (data) => setChatListData(data),
  });

  return (
    <TopBottomBarTemplate
      _topNode={
        <div className="relative flex h-full w-full items-center bg-white">
          <div className="absolute left-[22px]">
            <BackSpaceArrow />
          </div>
          <div className="flex flex-1 justify-center font-noto text-[18px] font-semibold  ">
            채팅 목록
          </div>
        </div>
      }
      _bottomNode={<BottomNavigationBar />}
      _contentDivProps={{ className: 'bg-white' }}
    >
      <div>
        {chatListDataQuery && chatListDataQuery.contents.length > 0 ? (
          <div className="relative flex h-full w-full flex-col px-5 [&>div]:border-b">
            {chatListDataQuery.contents &&
              chatListDataQuery.contents.map((item: IChatListContent) => (
                <div key={item.roomId}>
                  <Link
                    href={{
                      pathname: `/chatting/room`,
                      query: { roomId: item.roomId, name: item.nickname },
                    }}
                  >
                    <ChatListItem
                      nickname={item.nickname}
                      profilePhoto={item.profilePhoto}
                      role={item.role}
                      roomId={item.roomId}
                    />
                  </Link>
                </div>
              ))}
          </div>
        ) : (
          <div className="absolute left-1/2 top-1/2 flex w-[184px] -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <ChatListEmpty />
            <div className="text-center font-noto text-xl font-bold text-[#D9D9D9]">
              진행 중인
              <br />
              채팅 내역이 없습니다.
            </div>
          </div>
        )}
      </div>
    </TopBottomBarTemplate>
  );
};

export default ChattingList;
