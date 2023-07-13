import React from "react";
import { useQuery } from "react-query";
import { getUsers } from "../api/user";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";
import { getPosts } from "../api/post";

export default function Main() {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: "posts",
    queryFn: getPosts,
    refetchOnWindowFocus: false,
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

  isLoading && <div>Loading</div>;

  isError && <div>{error.message}</div>;

  return (
    <div>
      <button onClick={goToPrivatePage}>write Post</button>
      <ul>
        {data?.map((post) => {
          return (
            <li
              key={post.id}
              onClick={(e) => navigate(`/detailPost/${post.id}`)}
            >
              <div
                className="h-96 w-96 object-cover bg-cover bg-center bg-slate-400"
                style={{
                  backgroundImage: `url(${post.postImgUrl})`,
                }}
              ></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
