import Image from 'next/image';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  _size?: 'large' | 'small';
  _src: string;
}

const ChatProfile = ({ _size, _src }: Props) => {
  return (
    <span
      className={twMerge(
        'relative rounded-full bg-primary-400',
        _size
          ? _size === 'large'
            ? 'h-[66px] w-[66px]'
            : 'h-[49px] w-[49px]'
          : ''
      )}
    >
      <Image src={_src} alt="profile" fill />
    </span>
  );
};

export default ChatProfile;
