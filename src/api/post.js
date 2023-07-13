import axios from "axios";

const getPosts = async () => {
  const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts`);
  return response.data;
};

const addPost = async (newPost) => {
  const response = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/posts`,
    newPost
  );
  return response.data;
};

export { getPosts, addPost };