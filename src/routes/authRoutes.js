// src/routes/authRoutes.js
import express from 'express'; // Express 모듈 불러오기
import jwt from 'jsonwebtoken';
import { kakaoCallback, logoutRedirect, getCurrentUser, logout, refreshToken } from '../controllers/authController.js'; // 카카오 콜백 컨트롤러 함수 불러오기
import naverAuthRoutes from "./naverAuthRoutes.js";
import { User } from '../models/UserProfile.js';

const router = express.Router(); // Express 라우터 인스턴스 생성


// 1. 카카오 OAuth 콜백 엔드포인트 등록
//    - 클라이언트가 카카오 인증 후, 리다이렉트 URI에 붙은 'code' 값을 이 엔드포인트로 전달합니다.
router.get('/kakao/callback', (req, res, next) => {
    console.log('카카오 콜백 라우트 호출됨');
    kakaoCallback(req, res, next);
});

router.use(naverAuthRoutes);


// 3) Access 토큰 갱신
router.post('/refresh', refreshToken);


router.get('/kakao-data', (req, res) => {                     // (추가)
    // (추가) 세션에 저장된 kakaoUserData를 JSON으로 반환 (없으면 빈 객체)
    res.json(req.session.kakaoUserData || {});                // (추가)
});


router.get('/me', getCurrentUser);

// // 4) 현재 로그인된 유저 정보 조회
// router.get('/me', async (req, res) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//
//     const token = authHeader.split(' ')[1];
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.userId).lean();
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         return res.status(200).json({ user });
//     } catch (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//     }
// });


// 전용 JSON 로그아웃
router.post('/logout', logout);
router.get("/logout-redirect", logoutRedirect);

export default router; // 라우터 내보내기
//124