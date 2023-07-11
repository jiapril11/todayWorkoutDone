import React, { useState } from "react";
import { auth, signUpWithFB } from "../api/firebase";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const submitNewUser = async (e) => {
    e.preventDefault();
    await signUpWithFB(newUser.email, newUser.password);
    // TODO: rtk에 저장
    // auth.currentUser;
    navigate("/");
  };

  // TODO: 유효성(닉네임 중복, 메일, 비번, 비번확인, 기본이미지 세팅)
  return (
    <div>
      <form onSubmit={submitNewUser}>
        <div>
          <div>
            <label htmlFor="">닉네임</label>
            <input type="text" />
          </div>
          <div>
            <p>warning text</p>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <p>warning text</p>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <p>warning text</p>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="">비밀번호 확인</label>
            <input type="password" />
          </div>
          <div>
            <p>warning text</p>
          </div>
        </div>
        <div>
          <button>signup</button>
        </div>
      </form>
    </div>
  );
}
