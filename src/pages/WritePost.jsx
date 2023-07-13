import React, { useEffect, useState } from "react";
import { auth, storage } from "../api/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useQueryClient, useMutation } from "react-query";
import { addPost } from "../api/post";
import { useNavigate } from "react-router-dom";

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
        createdAt: today.toLocaleDateString(),
      };
      mutation.mutate(newPost);
    } else {
      alert("이미지 등록은 필수입니다");
    }
  };

  return (
    <div>
      <form action="" onSubmit={handleSumbitPost}>
        <div className="">
          <div className="shrink-0">
            <label class="block">
              <span class="sr-only">Choose profile photo</span>
              <input
                type="file"
                onChange={handleImgPreview}
                class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </label>
            <div
              class="h-96 w-96 object-cover bg-cover bg-center bg-slate-400"
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
        <button type="submit">등록</button>
      </form>
    </div>
  );
}
