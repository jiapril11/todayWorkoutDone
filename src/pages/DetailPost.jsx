import React from "react";
import { useQuery, useMutation } from "react-query";
import { deletePost, getPost } from "../api/post";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../api/firebase";

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
    <div>
      <h2>DetailPost</h2>
      <div className="flex justify-end gap-3">
        <p>{post.writer}</p>
        <p>{post.modifiedDate === "" ? post.createdDate : post.modifiedDate}</p>
      </div>
      <div
        className="h-96 w-96 object-cover bg-cover bg-center bg-slate-400"
        style={{
          backgroundImage: `url(${post.postImgUrl})`,
        }}
      ></div>
      <div>
        <p>{post.postContent}</p>
      </div>
      <div className="flex justify-between">
        <div>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
        {user?.uid === post.writerId && (
          <div className="flex gap-3">
            <button className="bg-red-50" onClick={handleDeletePost}>
              delete
            </button>
            <button
              onClick={() => navigate(`/modifyPost/${postId}`)}
              className="bg-blue-50"
            >
              modify
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
