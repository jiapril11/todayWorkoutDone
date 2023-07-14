import React from "react";
import { useQuery } from "react-query";
import { getUsers } from "../api/user";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";
import { getPosts } from "../api/post";
import Layout from "../components/common/Layout";

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
    <div className="bg-neutral-800">
      <Layout>
        <div className="py-12">
          <div className="flex justify-end pb-6">
            <button
              onClick={goToPrivatePage}
              className="px-4 py-1 bg-sky-500 rounded text-sm text-white font-bold"
            >
              포스트 작성하기
            </button>
          </div>
          <ul className="grid grid-cols-4 gap-2">
            {data?.map((post) => {
              return (
                <li
                  key={post.id}
                  onClick={(e) => navigate(`/detailPost/${post.id}`)}
                  className="hover:cursor-pointer"
                >
                  <img className=" aspect-square" src={post.postImgUrl}></img>
                </li>
              );
            })}
          </ul>
        </div>
      </Layout>
    </div>
  );
}
