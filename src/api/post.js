import axios from "axios";

export const getPosts = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/posts?_sort=createdAt&_order=desc`
  );
  return response.data;
};

export const getPost = async (id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/posts?id=${id}`
  );
  return response.data;
};

export const addPost = async (newPost) => {
  const response = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/posts`,
    newPost
  );
  return response.data;
};

export const deletePost = async (id) => {
  await axios.delete(`${process.env.REACT_APP_SERVER_URL}/posts/${id}`, {
    data: { id: id },
  });
};

export const modifyPost = async (modifiedPostInfo) => {
  const { postId, modifiedPost } = modifiedPostInfo;
  console.log(postId, modifiedPost);
  const response = await axios.patch(
    `${process.env.REACT_APP_SERVER_URL}/posts/${postId}`,
    modifiedPost
  );
  return response.data;
};
