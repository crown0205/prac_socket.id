import './App.css';
import { useEffect, useState } from 'react';
import NavBar from './navBar/NavBar';
import Card from './card/Card';
import { posts } from './data';
import { io } from 'socket.io-client';

function App() {
  // 굳이 이렇게 4번을 꼬아서 userName 얻어야 되는건가??
  //  한번 정리해보자
  const [user, setUser] = useState('');
  const [userName, setUserName] = useState('');
  const [socket, setSocket] = useState(null);

  // "socket.on" <== 서버에서 오는 것을 받는 메서드이다.
  // "socket.emit" <== 서버로 이벤트를 보내는 메서드.

  useEffect(() => {
    // 소켓을 주소를 받아올 주소는 같아야 된다.
    //  요청을 보내는거라고 생각을 하면됨.

    // //  설명 누군가가 사이트에 접근하면 서버에서 "socket.Id"를 발급해준다. (회원이 아니여도!)
    // const socket = io('http://localhost:3001');
    // console.log(socket);

    // 접속하자마자 발급 받은 socket.id를 바로 서버로 넘겨주어 기존 유저인지 아닌지 판단한다.
    setSocket(io('http://localhost:3001'));
  }, []);

  useEffect(() => {
    // socket을 바로 서버에 보내 있는 유저인지 없는 유저인지에 따라서 이벤트를 처리한다.
    // 그리고 처음에는 socket이 null 값이여서 옵셔널 체이닝을 걸어 에러를 방지 해준다.
    socket?.emit('newUser', user);
  }, [socket, user]);

  return (
    <div className="container">
      {/* 유저 이름 있으면 메인을 보여주고 없으면 로그인을 보여준다. */}
      {user ? (
        <>
          {/* NavBar에 소켓을 보내는 이유는 ... */}
          <NavBar socket={socket} />
          {posts.map((post) => {
            return (
              // 누가 소켓정보와 이벤트를 보내는 유저 정보도 card로 보내서 이벤트를 보낼때 누가 보내는것인지 알려줘야 한다.
              <Card key={post.id} post={post} socket={socket} user={user} />
            );
          })}
          <span className="userName">{user}</span>
        </>
      ) : (
        <div className="login">
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={() => setUser(userName)}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
