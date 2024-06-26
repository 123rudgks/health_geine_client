'use client';
import axios from 'axios';
import { BASE_URL } from '@/utils/routePath';
import Router from 'next/router';
import LocalStorage from '@/utils/localStorage';

const ACCESS_TOKEN = LocalStorage.getItem('accessToken');
const OAUTH_ACCESS_TOKEN = LocalStorage.getItem('oauthAccessToken');

// trainer-select
export const getUser = async (role: string) => {
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

// my-page
export const withdraw = async () => {
  alert('정말 탈퇴하시겠습니까?');

  try {
    const response = await axios.delete(`https://${BASE_URL}/withdraw`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        OAuthAccessToken: `${OAUTH_ACCESS_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    localStorage.clear();
    Router.push('/');
    return response.data.data;
  } catch (error) {
    console.error('회원 탈퇴 실패:', error);
  }
};

// email-auth
export const getMail = async (emailValue: string, univNameValue: string) => {
  try {
    const res = await axios.post(
      `https://${BASE_URL}/mail`,
      { univ_email: emailValue, univName: univNameValue },
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    return res.data.data;
  } catch (error) {
    console.error('Error handling mail:', error);
    return null;
  }
};

export const getMailVeri = async (
  emailValue: string,
  univNameValue: string,
  codeValue: string
) => {
  try {
    const res = await axios.get(
      `https://${BASE_URL}/mail/verifications?univ_email=${emailValue}&univName=${univNameValue}&code=${codeValue}`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    return {
      message: res.data.message,
      success: res.data.message === '검증이 성공했습니다',
    };
  } catch (error) {
    console.error('Error handling mail verification:', error);
    return null;
  }
};

export const handleVerificationResult = (
  verificationResult: any,
  setVerificationResult: Function,
  setIsCompleteButtonVisible: Function
) => {
  if (verificationResult && verificationResult.success) {
    console.log(verificationResult.message);
    setVerificationResult('인증에 성공했습니다!');
    setIsCompleteButtonVisible(true);
  } else {
    console.log(verificationResult.message);
    setVerificationResult('인증에 실패했습니다');
    setIsCompleteButtonVisible(false);
  }
};

// health-management
export const getTrainerProfileData = async () => {
  const response = await axios.get(
    `https://${BASE_URL}/trainers/profiles/details`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ` + ACCESS_TOKEN,
      },
    }
  );
  return response.data.data;
};

export const getUserData = async () => {
  const response = await axios.get(`https://${BASE_URL}/users`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ` + ACCESS_TOKEN,
    },
  });
  return response.data.data;
};

// trainer-list
export const getTrainerProfileList = async () => {
  const response = await axios.get(`https://${BASE_URL}/trainers/profiles`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ` + ACCESS_TOKEN,
    },
  });
  return response.data.data;
};

// trainer-detail
export const getPhotoResponse = async (trainerProfileId: string) => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/trainers/profiles/${trainerProfileId}/photos`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    const data = response.data.data;

    if (data && Object.keys(data).length > 0) {
      return data;
    }
  } catch (error) {
    console.error('데이터를 불러오는 중 에러가 발생했습니다.', error);
    throw error;
  }
};

export const getTrainerProfileListDetail = async (trainerProfileId: string) => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/trainers/profiles/details/${trainerProfileId}`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    const data = response.data.data;

    if (data && Object.keys(data).length > 0) {
      return data;
    } else {
      throw new Error('데이터가 없습니다.');
    }
  } catch (error) {
    console.error('데이터를 불러오는 중 에러가 발생했습니다.', error);
    throw error;
  }
};

// write-trainer-detail , edit-trainer-detail (사진 게시)
export const getTrainerPostPhotos = async (id: string, photos: FormData) => {
  try {
    const response = await axios.post(
      `https://${BASE_URL}/trainers/profiles/${id}/photos`,
      photos,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// edit-trainer-detail (사진 삭제)
export const getDeleteTrainerPhoto = async (trainerProfileId: string) => {
  try {
    const response = await axios.delete(
      `https://${BASE_URL}/trainers/profiles/${trainerProfileId}/photos`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );

    Router.push('/trainer-list');
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// write-trainer-detail (트레이너 프로필 게시)
export const getTrainerProfile = async (profile: {}) => {
  try {
    const response = await axios.post(
      `https://${BASE_URL}/trainers/profiles`,
      profile,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );

    alert('프로필이 성공적으로 게시되었습니다.');
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// edit-trainer-detail (게시글 수정)
export const getEditTrainerProfileListDetail = async (
  trainerProfileId: string,
  editProfileData: {}
) => {
  try {
    const response = await axios.patch(
      `https://${BASE_URL}/trainers/profiles/${trainerProfileId}`,
      editProfileData,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    const data = response.data.data;

    if (data && Object.keys(data).length > 0) {
      alert('프로필이 성공적으로 수정되었습니다.');
      return data;
    } else {
      throw new Error('데이터가 없습니다.');
    }
  } catch (error) {
    console.error('데이터를 불러오는 중 에러가 발생했습니다.', error);
    throw error;
  }
};

// edit-trainer-detail (트레이너 프로필 삭제)
export const getDeleteTrainerProfileListDetail = async (
  trainerProfileId: string
) => {
  try {
    const response = await axios.delete(
      `https://${BASE_URL}/trainers/profiles/${trainerProfileId}`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );

    Router.push('/trainer-list');
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community
export const getCommunityList = async () => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/community/posts?keyword=&userId=&lastId=&size=`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data.contents;
  } catch (error) {
    console.log(error);
  }
};

// write-community
export const post = async (titleValue: string, contentValue: string) => {
  if (titleValue.trim() !== '' && contentValue.trim() !== '') {
    try {
      const response = await axios.post(
        `https://${BASE_URL}/community/posts`,
        { title: titleValue, content: contentValue },
        {
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ` + ACCESS_TOKEN,
          },
        }
      );

      alert('정상적으로 글이 저장되었습니다.');
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  } else {
    alert('제목과 내용은 비어있을 수 없습니다.');
  }
};

// write-community (사진 게시)
export const getPostPhotos = async (postId: string, photos: FormData) => {
  try {
    const response = await axios.post(
      `https://${BASE_URL}/community/posts/${postId}/photos`,
      photos,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// write-community (게시된 사진 조회)
export const getPhotos = async (postId: string) => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/community/posts/${postId}/photos`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// write-community (사진 삭제)
export const getPhotosDelete = async (postId: string) => {
  try {
    const response = await axios.delete(
      `https://${BASE_URL}/community/posts/${postId}/photos`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// comments count (댓글 개수)
export const getCommentCount = async (postId: string) => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/community/posts/${postId}/comments/count`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// likes boolean (좋아요 true or false)
export const getLikesBoolean = async (postId: string) => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/community/posts/${postId}/likes`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// likes count (좋아요 개수)
export const getLikesCount = async (postId: string) => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/community/posts/${postId}/likes/count`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community-detail
export const getCommunityDetail = async (postId: string) => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/community/posts/${postId}`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community-detail (게시글 수정)
export const getCommunityUpdate = async (
  postId: string,
  title: string,
  content: string
) => {
  try {
    const response = await axios.patch(
      `https://${BASE_URL}/community/posts/${postId}`,
      { title: title, content: content },
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community-detail (게시글 삭제)
export const getCommunityDelete = async (postId: string) => {
  try {
    const response = await axios.delete(
      `https://${BASE_URL}/community/posts/${postId}`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community-detail (댓글 작성)
export const getCommentPost = async (postId: string, content: string) => {
  try {
    const response = await axios.post(
      `https://${BASE_URL}/community/posts/${postId}/comments`,
      { content: content },
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community-detail (댓글 수정)
export const getCommentUpdate = async (
  postId: string,
  commentId: string,
  content: string
) => {
  try {
    const response = await axios.patch(
      `https://${BASE_URL}/community/posts/${postId}/comments/${commentId}`,
      { content: content },
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community-detail (댓글 삭제)
export const getCommentDelete = async (postId: string, commentId: string) => {
  try {
    const response = await axios.delete(
      `https://${BASE_URL}/community/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community-detail (댓글 전체 조회)
export const getComment = async (postId: string) => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/community/posts/${postId}/comments`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community-detail (좋아요 게시)
export const getLikes = async (postId: string, userId: string) => {
  try {
    const response = await axios.post(
      `https://${BASE_URL}/community/posts/${postId}/likes`,
      {
        userId: userId,
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// community-detail (좋아요 취소)
export const getLikesCancel = async (postId: string) => {
  try {
    const response = await axios.delete(
      `https://${BASE_URL}/community/posts/${postId}/likes`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// chatting/list
export const getChatList = async () => {
  try {
    const response = await axios.get(
      `https://${BASE_URL}/chat/rooms?lastId=&size=`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ` + ACCESS_TOKEN,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

// chatting/list -> 마지막 채팅 내용
export const getChatListMessage = async (roomIds: string[]) => {
  try {
    const queryRoomIds = roomIds.map((roomId) => `roomIds=${roomId}`).join('&');
    const response = await axios.get(
      `https://${BASE_URL}/chat/lastMessages?${queryRoomIds}`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
