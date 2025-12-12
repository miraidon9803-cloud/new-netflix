import React from "react";
import { useAuthStore } from "../store/authStore";

const Mypage = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <div>{user?.email}</div>
      <div>{user?.phone}</div>
    </div>
  );
};

export default Mypage;
