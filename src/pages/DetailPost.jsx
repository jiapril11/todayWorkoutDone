import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { deletePost, getPost } from "../api/post";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../api/firebase";

export default function DetailPost() {
  const user = auth.currentUser;
  const params = useParams();
  const navigate = useNavigate();
  const { postId } = params;

  const { isLoading, isError, error, data } = useQuery("posts", () =>
    getPost(postId)
  );

  const post = data[0];

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
        <p>{post.createdDate}</p>
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
          <button onClick={(e) => navigate(-1)}>Back</button>
        </div>
        {user?.uid === post.writerId && (
          <div className="flex gap-3">
            <button className="bg-red-50">delete</button>
            <button className="bg-blue-50">modify</button>
          </div>
        )}
      </div>
    </div>
  );
}
