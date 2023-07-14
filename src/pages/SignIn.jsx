import React, { useState } from "react";
import { signInWithFB } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";

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
    <div className="bg-neutral-900 py-12">
      <Layout>
        <div className="w-[500px] mx-auto px-6 py-10 border border-lime-700 bg-neutral-800 rounded">
          <h2 className="text-xl text-center text-white font-bold mb-5">
            로그인
          </h2>
          <form onSubmit={submitUser}>
            <div className="mb-6">
              <div className="flex gap-3 items-center">
                <label htmlFor="email" className="text-white flex-shrink-0">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-1 rounded"
                />
              </div>
              {/* <div>
                <p>warning text</p>
              </div> */}
            </div>
            <div>
              <div className="flex gap-3 items-center">
                <label htmlFor="password" className="text-white flex-shrink-0">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-1 rounded"
                />
              </div>
              {/* <div>
                <p>warning text</p>
              </div> */}
            </div>
            <div className="text-center mt-10">
              <button
                className={`px-4 py-1 rounded font-bold text-sm bg-lime-400`}
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
}
