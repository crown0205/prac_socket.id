import React, { useState } from 'react';
import { AiOutlineHeart, AiOutlineComment, AiFillHeart } from 'react-icons/ai';
import { FiShare } from 'react-icons/fi';
import { HiDotsHorizontal } from 'react-icons/hi';
import './card.css';

// socket과 user정보를 카드에 넘겨줌
const Card = ({ post, socket, user }) => {
  const [liked, setLiked] = useState(false);
  console.log(liked);

  //   // 알림 기능 ⭐️
  // const handleNotification = (type) => {
  //   setLiked(true);
  //   // setLiked(!liked);

  //   socket.emit('sendNotification', {
  //     // 이벤트를 보내는 유저
  //     senderName: user,
  //     // 이벤트를 받는 유저
  //     receiverName: post.userName,
  //     type,
  //   });
  // };

  // 채팅 맛보기 📝
  const handleNotification = (type) => {
    type === 1 && setLiked(true);
    socket.emit('sendText', {
      // 이벤트를 보내는 유저
      senderName: user,
      // 이벤트를 받는 유저
      receiverName: post.userName,
      text: '안녕 이건 채팅 맛보기임.',
    });
  };
  return (
    <div className="crad">
      <div className="info">
        <img src={post.userImg} alt="" className="userImg" />
        <span>{post.fullName}</span>
      </div>
      <img src={post.postImg} alt="" className="postImg" />
      <div className="interaction">
        {liked ? (
          <AiFillHeart
            className="cardIcon heartFillIcon"
            // onClick={() => handleNotification(1)}
          />
        ) : (
          <AiOutlineHeart
            className="cardIcon"
            onClick={() => handleNotification(1)}
          />
        )}
        <AiOutlineComment
          className="cardIcon"
          onClick={() => handleNotification(2)}
        />
        <FiShare className="cardIcon" onClick={() => handleNotification(3)} />
        <HiDotsHorizontal className="cardIcon infoIcon" />
      </div>
    </div>
  );
};

export default Card;
