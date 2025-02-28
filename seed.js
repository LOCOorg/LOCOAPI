import connectMongoDB from './src/config/mongoDB.js'; // mongoDB.js에서 연결 함수 가져오기
import { User } from './src/models/UserProfile.js'; // User 모델 불러오기
import { ChatRoom } from './src/models/chat.js'; // ChatRoom 모델 불러오기
import mongoose from 'mongoose'; // mongoose 모듈 불러오기

// 더미 유저 데이터
// const dummyUsers = [
//     {
//         name: 'John Doe',
//         nickname: 'johndoe123',
//         phone: '010-1234-5678',
//         birthdate: new Date('1990-01-01'),
//         accountLink: '',
//     },
//     {
//         name: 'Jane Smith',
//         nickname: 'janesmith456',
//         phone: '010-9876-5432',
//         birthdate: new Date('1995-05-15'),
//         accountLink: '',
//     },
//     {
//         name: 'Alice Brown',
//         nickname: 'alicebrown789',
//         phone: '010-5678-1234',
//         birthdate: new Date('1992-03-10'),
//         accountLink: '',
//     },
//     {
//         name: 'Bob Johnson',
//         nickname: 'bobjohnson234',
//         phone: '010-3456-7890',
//         birthdate: new Date('1988-07-22'),
//         accountLink: '',
//     },
//     {
//         name: 'Charlie Davis',
//         nickname: 'charliedavis567',
//         phone: '010-8765-4321',
//         birthdate: new Date('1993-11-30'),
//         accountLink: '',
//     },
//     {
//         name: 'Emma Wilson',
//         nickname: 'emmawilson890',
//         phone: '010-6789-0123',
//         birthdate: new Date('1997-09-05'),
//         accountLink: '',
//     }
// ];


// 더미 채팅방 데이터
const dummyChatRooms = [
    // {
    //     chatUsers: [], // 채팅방의 참여자들, 실제 _id 값으로 채워짐
    //     roomType: 'friend',
    //     capacity: null,
    //     isActive: true,
    //     createdAt: new Date(),
    // },
    // {
    //     chatUsers: [],
    //     roomType: 'friend',
    //     capacity: null,
    //     isActive: true,
    //     createdAt: new Date(),
    // },
    // {
    //     chatUsers: [],
    //     roomType: 'friend',
    //     capacity: null,
    //     isActive: true,
    //     createdAt: new Date(),
    // },
    {
        chatUsers: [],
        roomType: 'random',
        capacity: 2,
        isActive: true,
        createdAt: new Date(),
    }
];

// 더미 데이터 삽입 함수
const seedData = async () => {
    try {
        // MongoDB 연결
        await connectMongoDB();

        // 더미 유저 데이터 삽입 (MongoDB가 _id를 자동으로 생성)
        const insertedUsers = await User.insertMany(dummyUsers);
        console.log('유저 더미 데이터 삽입 완료');

        // 삽입된 유저들의 _id를 사용하여 채팅방 데이터를 삽입
        const userIds = insertedUsers.map(user => user._id.toString());

        // 더미 채팅방 데이터에 유저들의 _id 값을 채팅방에 넣음
        const updatedChatRooms = dummyChatRooms.map((room, index) => ({
            ...room,
            chatUsers: userIds.slice(index * 2, (index * 2) + 2) // 예시로 2명의 사용자만 할당
        }));

        // 더미 채팅방 데이터 삽입
        await ChatRoom.insertMany(updatedChatRooms);
        console.log('채팅방 더미 데이터 삽입 완료');

        // 연결 종료
        await mongoose.connection.close();
    } catch (err) {
        console.error('데이터 삽입 중 오류 발생:', err);
    }
};

// 더미 데이터 삽입 실행
seedData();
