console.log('hello22');
import { Server } from 'socket.io';

const io = new Server({
  cors: {
    origin: 'http://localhost:3000',
  },
});

let onlineUsers = [];

console.log(onlineUsers);

const addNewUser = (userName, socketId) => {
  !onlineUsers.some((user) => user.userName === userName) &&
    onlineUsers.push({ userName, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userName) => {
  return onlineUsers.find((user) => user.userName === userName);
};

io.on('connection', (socket) => {
  socket.on('newUser', (userName) => {
    addNewUser(userName, socket.id);
  });

  // 알림 이벤트를 하는 곳이다. ⭐️
  socket.on('sendNotification', ({ senderName, receiverName, type }) => {
    // 받는 유저가 누구인지 찾고, 그 유저에게만 이벤트를 보내기 위해 "io.to(receiver.socketId).emit()"를 사용한다.
    // 그리고 누가 보내는것인지 senderName도 같이 보내준다.
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit('getNotification', {
      senderName,
      type,
    });
  });

  // 채팅 기능 맛보기 📝
  socket.on('sendText', ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    io.to(receiver?.socketId).emit('getText', {
      senderName,
      text,
    });
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });

  // -- 설명 --

  // // 지금 같은 경우는 접속했을때 모든 클라이언트에게 메세지를 보내는 경우이다.
  // // "io.emit" <== 모든 클라이언트에게 보내는 경우에 사용된다.
  // io.emit('firstEvent', 'Hello this it test!');

  // 특정 한명의 클라이언트에게 보낼때는 socket Id가 필요하다.
  // "io.to("socketId").emit()" <== 이 메서드이다.
  // io.to("socketId").emit('firstEvent', 'Hello this it test!');

  // "socket.on" <== 클라이언트 측에서 이벤트를 가져오는 경우에 사용된다.
});

// 연결할 서버와 같으면 안된다!!!! 에러남.
io.listen(3001);
