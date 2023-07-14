import React from "react";
import { auth } from "../api/firebase";

export default function MyPage() {
  const currentUser = auth.currentUser;
  return (
    <>
      <div>{currentUser.uid}</div>
      <div>{currentUser.displayName}</div>
      <div>{currentUser.email}</div>
    </>
  );
}
