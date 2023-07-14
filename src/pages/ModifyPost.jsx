import React, { useState } from "react";
import { auth, storage } from "../api/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { getPost, modifyPost } from "../api/post";
import Layout from "../components/common/Layout";

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
    <div className="bg-neutral-900 py-12">
      <Layout>
        <div className="w-[500px] mx-auto px-6 py-10 border border-lime-700 bg-neutral-800 rounded">
          <h2 className="mb-5 text-white text-xl font-bold text-center">
            수정하기
          </h2>
          <form action="" onSubmit={handleSumbitModifiedPost}>
            <div className="">
              <div className="shrink-0">
                <label className="block mb-4">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    onChange={handleImgPreview}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-500 hover:file:bg-sky-100"
                  />
                </label>
                <div
                  className="h-96 w-96 object-cover bg-cover bg-center bg-slate-400 mx-auto"
                  style={{
                    backgroundImage: `url(${imgSrc})`,
                  }}
                  alt="Current profile photo"
                />
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <label htmlFor="content" className="text-white flex-shrink-0">
                내용
              </label>
              <input
                id="content"
                type="text"
                value={postContent}
                onChange={(e) => {
                  setPostContent(e.target.value);
                }}
                className="flex-1 rounded px-3 py-1"
              />
            </div>
            <div className="flex justify-between mt-10">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-1 rounded font-bold text-sm bg-neutral-950 text-white"
              >
                뒤로
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded font-bold text-sm bg-sky-500 text-white"
              >
                수정하기
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
}
