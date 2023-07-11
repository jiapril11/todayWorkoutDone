import React, { useState } from "react";
import { signInWithFB } from "../api/firebase";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const submitUser = async (e) => {
    e.preventDefault();
    await signInWithFB(user.email, user.password);
    // TODO: rtk에 저장
    // await auth.currentUser;
    navigate("/");
  };
  return (
    <div>
      <form onSubmit={submitUser}>
        <div>
          <div>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              name="email"
              value={user.email}
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
              value={user.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <p>warning text</p>
          </div>
        </div>
        <div>
          <button>signIn</button>
        </div>
      </form>
    </div>
  );
}
