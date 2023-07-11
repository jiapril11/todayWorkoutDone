import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Main from "../pages/Main";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import MyPage from "../pages/MyPage";
import DetailPost from "../pages/DetailPost";

export default function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/myPage/:userId" element={<MyPage />} />
        <Route path="/detailPost/:postId" element={<DetailPost />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
