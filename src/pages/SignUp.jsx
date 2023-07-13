import React, { useEffect, useState } from "react";
import { saveUserInfo, signUpWithFB, updateUserProfile } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { addUser } from "../api/user";
import { useQueryClient, useMutation } from "react-query";

export default function SignUp() {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    displayName: "",
    email: "",
    pwd: "",
    confirmPwd: "",
  });

  const [validationMsg, setValidationMsg] = useState({
    displayNameMsg: "",
    emailMsg: "",
    pwdMsg: "",
    confirmPwdMsg: "",
  });

  const [validationState, setValidationState] = useState({
    displayNameState: false,
    emailState: false,
    pwdState: false,
    confirmPwdState: false,
  });

  const [btnSubmitState, setBtnSubmitState] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "displayName":
        {
          let msg = "";
          let currentState = false;
          if (!validateValue(name, value)) {
            msg =
              "사용가능한 닉네임이 아닙니다.(특수문자 제외한 2자 이상 10자 이하)";
            currentState = false;
          } else {
            msg = "사용가능한 닉네임입니다.";
            currentState = true;
          }
          setValidationMsg((prev) => ({
            ...prev,
            displayNameMsg: msg,
          }));

          setValidationState((prev) => ({
            ...prev,
            displayNameState: currentState,
          }));
        }
        break;
      case "email":
        {
          let msg = "";
          let currentState = false;

          if (!validateValue(name, value)) {
            msg = "이메일 형식이 올바르지 않습니다.";
            currentState = false;
          } else {
            msg = "사용가능한 이메일입니다.";
            currentState = true;
          }
          setValidationMsg((prev) => ({
            ...prev,
            emailMsg: msg,
          }));
          setValidationState((prev) => ({
            ...prev,
            emailState: currentState,
          }));
        }
        break;
      case "pwd":
        {
          let msg = "";
          let currentState = false;
          if (!validateValue(name, value)) {
            msg =
              "영문 대/소문자 + 숫자 + 특수문자(~?!@#$%^&*_-)가 포함 8자이상 15자이하";
            currentState = false;
          } else {
            msg = "사용가능한 비밀번호입니다.";
            currentState = true;
          }
          setValidationMsg((prev) => ({
            ...prev,
            pwdMsg: msg,
          }));
          setValidationState((prev) => ({
            ...prev,
            pwdState: currentState,
          }));
        }
        break;
      case "confirmPwd": {
        let msg = "";
        let currentState = false;
        if (newUser.pwd !== value) {
          msg = "비밀번호가 일치하지 않음";
          currentState = false;
        } else {
          msg = "비밀번호가 일치";
          currentState = true;
        }
        setValidationMsg((prev) => ({
          ...prev,
          confirmPwdMsg: msg,
        }));
        setValidationState((prev) => ({
          ...prev,
          confirmPwdState: currentState,
        }));
      }
      default:
        return;
    }
  };

  const validateValue = (name, value) => {
    switch (name) {
      case "displayName":
        return /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,10}$/.test(value);
      case "email":
        return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(value);
      case "pwd":
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,15}$/.test(
          value
        );
      default:
        return;
    }
  };

  // 리액트 쿼리 관련 코드
  const queryClient = useQueryClient();
  const mutation = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });
  const submitNewUser = async (e) => {
    e.preventDefault();

    const { displayName, email, pwd } = newUser;
    const userData = await signUpWithFB(email, pwd);
    await updateUserProfile(displayName);

    const newUserData = {
      userId: userData.uid,
      email,
      displayName,
      password: pwd,
      photoURL: "",
    };
    saveUserInfo(newUserData);
    mutation.mutate(newUserData);

    // auth.currentUser;

    navigate("/");
  };

  useEffect(() => {
    const { displayNameState, emailState, pwdState, confirmPwdState } =
      validationState;

    displayNameState && emailState && pwdState && confirmPwdState
      ? setBtnSubmitState(false)
      : setBtnSubmitState(true);
  }, [validationState]);

  return (
    <div>
      <form onSubmit={submitNewUser}>
        <div>
          <div>
            <label htmlFor="displayName">닉네임</label>
            <input
              id="displayName"
              type="text"
              name="displayName"
              value={newUser.displayName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <p>{validationMsg.displayNameMsg}</p>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <p>{validationMsg.emailMsg}</p>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="pwd">비밀번호</label>
            <input
              id="pwd"
              type="text"
              name="pwd"
              value={newUser.pwd}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <p>{validationMsg.pwdMsg}</p>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="confirmPwd">비밀번호 확인</label>
            <input
              id="confirmPwd"
              type="text"
              name="confirmPwd"
              value={newUser.confirmPwd}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <p>{validationMsg.confirmPwdMsg}</p>
          </div>
        </div>
        <div>
          <button type="submit" disabled={btnSubmitState}>
            signup
          </button>
        </div>
      </form>
    </div>
  );
}

// TODO: photoURL
// TODO: react-hook-form, yup
// TODO: 중복 이메일, 닉네임
