import React, { useState } from "react";
import { auth, storage } from "../api/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { getPost, modifyPost } from "../api/post";

export default function ModifyPost() {
  const user = auth.currentUser;
  const params = useParams();
  const { postId } = params;
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const { isLoading, isError, error, data } = useQuery("posts", () =>
    getPost(postId)
  );

  const post = data && data[0];
  const [postContent, setPostContent] = useState(post?.postContent);
  const [imgSrc, setImgSrc] = useState(post?.postImgUrl);

  const queryClient = useQueryClient();
  const mutation = useMutation(modifyPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      alert("글이 수정되었습니다.");
      navigate(`/detailPost/${postId}`);
    },
  });

  const handleImgPreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      setSelectedFile(file);
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setImgSrc(e.target.result);
      };
    } else {
      setSelectedFile(null);
      setImgSrc(null);
    }
  };

  const handleSumbitModifiedPost = async (e) => {
    e.preventDefault();
    const { email } = user;
    let postImgUrl = post?.postImgUrl;

    if (!!selectedFile) {
      const imgRef = ref(storage, `${email}/postImg/${selectedFile.name}`);
      await uploadBytes(imgRef, selectedFile);
      postImgUrl = await getDownloadURL(imgRef);
    }
    const today = new Date();
    const modifiedPostInfo = {
      postId,
      modifiedPost: {
        postContent,
        postImgUrl,
        modifiedDate: today.toLocaleDateString(),
      },
    };
    mutation.mutate(modifiedPostInfo);
  };
  return (
    <div>
      <h2>ModifyPost</h2>

      <form action="" onSubmit={handleSumbitModifiedPost}>
        <div className="">
          <div className="shrink-0">
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                onChange={handleImgPreview}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </label>
            <div
              className="h-96 w-96 object-cover bg-cover bg-center bg-slate-400"
              style={{
                backgroundImage: `url(${imgSrc})`,
              }}
              alt="Current profile photo"
            />
          </div>
        </div>
        <div>
          <label htmlFor="">내용</label>
          <input
            type="text"
            value={postContent}
            onChange={(e) => {
              setPostContent(e.target.value);
            }}
            className="bg-violet-50"
          />
        </div>
        <button type="submit">modify</button>
      </form>

      <div>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}
