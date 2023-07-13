import React from "react";
import { useQuery } from "react-query";
import { getUsers } from "../api/user";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";

export default function Main() {
  const { isLoading, isError, data } = useQuery({
    queryKey: "users",
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    staleTime: 5000,
  });

  const navigate = useNavigate();
  const goToPrivatePage = (e) => {
    e.preventDefault();
    if (auth?.currentUser?.uid) {
      navigate("/writePost");
    } else {
      alert("로그인 후 이용해주세요");
    }
  };

  return (
    <div>
      <button onClick={goToPrivatePage}>write Post</button>
      <div>main</div>
    </div>
  );
}
