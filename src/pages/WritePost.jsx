import React, { useEffect, useState } from "react";
import { auth, storage } from "../api/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useQueryClient, useMutation } from "react-query";
import { addPost } from "../api/post";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";

export default function WritePost() {
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const mutation = useMutation(addPost, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("posts");
      alert("글이 등록되었습니다.");
      navigate(`/detailPost/${data.id}`);
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

  const handleSumbitPost = async (e) => {
    e.preventDefault();
    const { uid, email, displayName } = auth.currentUser;
    let postImgUrl = "";

    if (!!selectedFile) {
      const imgRef = ref(storage, `${email}/postImg/${selectedFile.name}`);
      await uploadBytes(imgRef, selectedFile);
      postImgUrl = await getDownloadURL(imgRef);
      const today = new Date();
      const newPost = {
        writerId: uid,
        writer: displayName,
        postContent,
        postImgUrl,
        createdDate: today.toLocaleDateString(),
        createdAt: +today,
        modifiedDate: "",
      };
      mutation.mutate(newPost);
    } else {
      alert("이미지 등록은 필수입니다");
    }
  };

  return (
    <div className="bg-neutral-900 py-12">
      <Layout>
        <div className="w-[500px] mx-auto px-6 py-10 border border-lime-700 bg-neutral-800 rounded">
          <form action="" onSubmit={handleSumbitPost}>
            <div>
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
                  className="h-96 w-96 object-cover bg-cover bg-center bg-slate-400 rounded mx-auto"
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
            <div className="text-center mt-10">
              <button
                type="submit"
                className="px-4 py-1 rounded font-bold text-sm bg-sky-500 text-white"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
}
