import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOutWithFB, watchAuthStateChange } from "../../api/firebase";

export default function Header() {
  const [userChk, setUserChk] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    watchAuthStateChange((user) => {
      if (user) {
        console.log(user);
        setUserChk((prev) => (prev = true));
      } else {
        console.log(user);
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
    <div
      style={{ display: "flex", justifyContent: "space-between", padding: 10 }}
    >
      <div>
        <Link to="/">Main</Link>{" "}
      </div>
      <div>
        {!userChk && (
          <div>
            <Link to="/signUp">signUp</Link> <Link to="/signIn">signIn</Link>{" "}
          </div>
        )}
        {userChk && (
          <div>
            <Link to="/myPage/dd">myPage</Link>{" "}
            <Link to="/" onClick={handleSignOut}>
              signOut
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
