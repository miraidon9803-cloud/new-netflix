import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { auth, db, googleProvider } from "../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useAuthStore = create((set) => ({
  //1. 상태변수
  user: null,
  isJoin: false,
  setIsJoin: (value) => set({ isJoin: value }),

  initAuth: () => {
    onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userRef = doc(db, "users", fbUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          set({ user: userDoc.data() });
        } else {
          const basicUser = {
            uid: fbUser.uid,
            name: fbUser.displayName || "",
            email: fbUser.email,
            phone: fbUser.phoneNumber || "",
            addnum: "",
            address: "",
            add: "",
          };

          await setDoc(userRef, basicUser);
          set({ user: basicUser });
        }
      } else {
        set({ user: null });
      }
    });
  },

  //회원가입
  onMember: async ({ name, email, password, addnum, address, add, phone }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const fbUser = userCredential.user;

      const userData = {
        uid: fbUser.uid,

        name: name || "",
        email,
        password,
        phone: phone || "",
        addnum: addnum || "",
        address: address || "",
        add: add || "",
        provider: "email",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", fbUser.uid), userData);
      set({ user: userData });

      console.log("회원가입 + Firestore 저장 성공");
    } catch (err) {
      console.log("회원가입 실패:", err.message);
      throw err;
    }
  },

  //로그인
  onLogin: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const fbUser = userCredential.user;

      const userRef = doc(db, "users", fbUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        set({ user: userDoc.data() }); // Firestore 값으로 저장 !!!
      } else {
        set({ user: fbUser });
      }

      return fbUser;
    } catch (err) {
      console.log("로그인 실패:", err.message);
      throw err;
    }
  },
  onGoogleLogin: async () => {
    try {
      // 구글 로그인창을 띄워서 사용자로부터 로그인하게 라고 그 결과값 저장하기
      const result = await signInWithPopup(auth, googleProvider);
      // 로그인한 사람의 정보를 가져오기
      const user = result.user;

      // 그 정보를 데이터베이스에 저장하기
      const userRef = doc(db, "users", user.uid);
      // 이미지 회원인지 아닌지 체크하기
      const userDoc = await getDoc(userRef);
      //데이터가 없으면 새로운 정보로 회원가입을하고 있으면,
      if (!userDoc.exists()) {
        const userInfo = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          nickname: "",
          phone: user.phoneNumber,
          file: user.photoURL,
          profile: "",
        };
        await setDoc(userRef, userInfo);
        set({ user: userInfo });
      } else {
        set({ user: userDoc.data() });
      }
      // 정보를 불러오기
    } catch (err) {
      console.log(err.message);
    }
  },
  //카카오 로그인
  onKakaoLogin: async (navigate) => {
    try {
      // 1 카카오 SDK 초기화
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init("b3fc478b356ae6fee151857a00679e07");
        console.log(" Kakao SDK 초기화 완료");
      }

      // 2 로그인 요청 (Promise 변환)
      const authObj = await new Promise((resolve, reject) => {
        window.Kakao.Auth.login({
          scope: "profile_nickname, profile_image",
          success: resolve,
          fail: reject,
        });
      });
      console.log(" 카카오 로그인 성공:", authObj);

      // 3 사용자 정보 요청 (Promise 기반)
      const res = await window.Kakao.API.request({
        url: "/v2/user/me",
      });

      console.log(" 카카오 사용자 정보:", res);

      // 4 사용자 정보 가공
      const uid = res.id.toString();
      const kakaoUser = {
        uid,
        email: res.kakao_account?.email || "",
        name: res.kakao_account.profile?.nickname || "카카오사용자",
        nickname: res.kakao_account.profile?.nickname || "카카오사용자",
        photoURL: res.kakao_account.profile?.profile_image_url || "",
        provider: "kakao",
        createdAt: new Date(),
      };

      // 5 Firestore에 저장
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, kakaoUser);
        console.log(" 신규 카카오 회원 Firestore에 등록 완료");
      } else {
        console.log("기존 카카오 회원 Firestore 데이터 있음");
      }

      // 6 Zustand 상태 업데이트
      set({ user: kakaoUser });

      alert(`${kakaoUser.nickname}님, 카카오 로그인 성공! `);
      if (navigate) navigate("/dashboard");
    } catch (err) {
      console.error(" 카카오 로그인 중 오류:", err);
      console.log("카카오 로그인 실패: " + err.message);
    }
  },

  //로그아웃
  onLogout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  //마이페이지
  updateUser: {
    email: "",
    password: "",
    phone: "",
  },

  // 초기값 설정
  setUpdateUser: (data) =>
    set({
      updateUser: {
        email: data.email || "",
        password: data.password || "",
        phone: data.phone || "",
      },
    }),

  // 개별 필드 업데이트
  updateUserField: (key, value) =>
    set((state) => ({
      updateUser: {
        ...state.updateUser,
        [key]: value,
      },
    })),

  updateUserinfo: async () => {
    try {
      const { user, updateUser } = useAuthStore.getState();

      if (!user) return alert("로그인이 필요합니다.");

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        email: updateUser.email,
        phone: updateUser.phone,
      });

      // 화면에 user 상태도 바로 반영
      useAuthStore.setState({
        user: {
          ...user,
          email: updateUser.email,
          phone: updateUser.phone,
        },
      });

      alert("회원 정보가 수정되었습니다!");
    } catch (err) {
      console.error("회원정보 수정 오류:", err);
      alert("회원정보 수정 중 오류가 발생했습니다.");
    }
  },
}));
