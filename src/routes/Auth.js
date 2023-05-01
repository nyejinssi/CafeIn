// 로그인, 로그아웃, 계정 생성, 구글 로그인, 구글 로그아웃 처리
import { authService , firebaseInstance } from "fbase";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Auth = () => {
    const [email, setEmail] = useState(""); //이메일
    const [password, setPassword] = useState(""); //패스워드
    const [newAccount, setNewAccount] = useState(true); //계정 생성 ㅇ여부
    const [error, setError] = useState(""); //로그인의 에러를 관리하기 위한 상태

    const onChange = (event) => { //이벤트 연결
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (event) => { //이벤트 연결
        event.preventDefault();
        try {
            let data;
            if (newAccount) { //계정 생성
                data = await createUserWithEmailAndPassword(authService, email, password);
            } else { //로그인
                data = await signInWithEmailAndPassword(authService, email, password);
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        if (name === "google") {
            provider = new GoogleAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
        console.log(data);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    name = "email" 
                    type="email" 
                    placeholder="Email" 
                    required
                    value = {email}
                    onChange = {onChange} 
                /> <br></br>
                <input 
                    name = "password"
                    type ="password" 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={onChange}
                    />
                    <br></br>
                <input type="submit" value={newAccount ? "create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}> {newAccount ? "Sign In" : "Create Account"} </span>

            <div>
                <button onClick={onSocialClick} name = "google"> 구글로 회원가입 / 로그인 </button> 
            </div>
        </div>
    );
};

export default Auth;

