import React from "react";
import { useQuery, useMutation } from "react-query";
import { deletePost, getPost } from "../api/post";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../api/firebase";
import Layout from "../components/common/Layout";

export default function DetailPost() {
  const user = auth.currentUser;
  const params = useParams();
  const { postId } = params;
  const navigate = useNavigate();

  const { isLoading, isError, error, data } = useQuery("posts", () =>
    getPost(postId)
  );

  const post = data && data[0];

  const mutation = useMutation(deletePost, {
    onSuccess: () => {
      alert("게시물이 삭제되었습니다.");
      navigate("/");
    },
  });

  const handleDeletePost = async () => {
    const confirmState = window.confirm("정말 삭제하시겠습니까?");
    confirmState && mutation.mutate(postId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }
  return (
    <div className="bg-neutral-900 py-12">
      <Layout>
        <div className="w-[500px] mx-auto px-6 py-10 border border-lime-700 bg-neutral-800 rounded">
          <div>
            <div className="flex justify-end gap-3 mb-4 ">
              <p className="text-white">{post.writer}</p>
              <p className="text-neutral-400">
                {post.modifiedDate === ""
                  ? post.createdDate
                  : post.modifiedDate}
              </p>
            </div>
            <div
              className="h-96 w-96 object-cover bg-cover bg-center bg-slate-400 mx-auto"
              style={{
                backgroundImage: `url(${post.postImgUrl})`,
              }}
            ></div>
            <div>
              <p className="px-3 py-1 my-5 text-lime-300">{post.postContent}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-1 rounded font-bold text-sm bg-neutral-950 text-white"
                >
                  뒤로
                </button>
              </div>
              {user?.uid === post.writerId && (
                <div className="flex gap-3">
                  <button
                    onClick={handleDeletePost}
                    className="px-4 py-1 rounded font-bold text-sm bg-red-500 text-white"
                  >
                    삭제하기
                  </button>
                  <button
                    onClick={() => navigate(`/modifyPost/${postId}`)}
                    className="px-4 py-1 rounded font-bold text-sm bg-sky-500 text-white"
                  >
                    수정하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
