import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOutWithFB, watchAuthStateChange } from "../../api/firebase";
import { AiFillThunderbolt } from "react-icons/ai";
import Layout from "./Layout";

export default function Header() {
  const [userChk, setUserChk] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    watchAuthStateChange((user) => {
      if (user) {
        setUserChk((prev) => (prev = true));
      } else {
        setUserChk((prev) => (prev = false));
      }
    });
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();
    await signOutWithFB();
    navigate("/");
  };
  return (
    <header className="bg-neutral-950">
      <Layout>
        <div className="flex justify-between gap-5 py-3">
          <div>
            <Link to="/" className="flex items-center gap-1">
              <AiFillThunderbolt
                className="text-2xl text-lime-300"
                style={{ transform: "translateY(2px)" }}
              />{" "}
              <h1 className="text-lime-300 font-bold">T.W.D</h1>
            </Link>{" "}
          </div>
          <div>
            {!userChk && (
              <div>
                <Link
                  to="/signUp"
                  className="mr-3 text-sm text-white hover:text-sky-300"
                >
                  회원가입
                </Link>
                <Link
                  to="/signIn"
                  className="text-sm text-white hover:text-sky-300"
                >
                  로그인
                </Link>
              </div>
            )}
            {userChk && (
              <div>
                {/* <Link
                  to="/myPage/dd"
                  className="mr-3 text-sm text-white hover:text-sky-300"
                >
                  마이페이지
                </Link>{" "} */}
                <Link
                  to="/"
                  onClick={handleSignOut}
                  className="text-sm text-neutral-400"
                >
                  로그아웃
                </Link>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </header>
  );
}
