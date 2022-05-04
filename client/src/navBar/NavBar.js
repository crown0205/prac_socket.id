import React, { useEffect, useState } from 'react';
import './navBar.css';
import { IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { AiOutlineMessage } from 'react-icons/ai';

const NavBar = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 알림기능 ⭐️
    socket.on('getNotification', (data) => {
      // 이렇게 하면 종속성에 관해서 잘못하면 무한루프에 빠질수도 있어서... 방지 하기 위해 스프레드를 사용하지 않고,
      // setNotification((prev) => [...notification, data])

      // 알림 내부에서 이전 개체를 가져올수 있어서 이렇게 사용한다.
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  // ==>  알림 기능 ⭐️
  //  버튼을 누르면 타입에 맡게 action이 발생된다.
  // 구조분해로 바로 쓸 값을 나눔
  const displayNotifications = ({ senderName, type, idx }) => {
    let action;

    if (type === 1) {
      action = 'liked';
    } else if (type === 2) {
      action = 'commented';
    } else {
      action = 'shared';
    }
    return (
      <span
        className="notification"
        key={`notification${idx}`}
      >{`${senderName} ${action} your post`}</span>
    );
  };

  const handleRead = () => {
    setNotifications([]);

    setOpen(false);
  };

  return (
    <div className="navBar">
      <span className="logo">dingo App</span>
      <div className="icons">
        <div className="icon" onClick={() => setOpen(!open)}>
          <IoNotificationsOutline className="iconImg" />
          {notifications.length > 0 && (
            <div className="counter">{notifications.length}</div>
          )}
        </div>
        <div className="icon">
          <AiOutlineMessage
            className="iconImg"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="icon">
          <IoSettingsOutline
            className="iconImg"
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>
      {open && (
        <div className="notifications">
          {notifications.map((item, idx) =>
            displayNotifications({ item, idx }),
          )}
          <button className="nBtn" onClick={handleRead}>
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
