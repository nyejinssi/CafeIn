import { authService, dbService, storageService } from "fbase";
import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";

const Profile = ({ userObj, refreshUser}) => {
    const navigate = useNavigate(); //로그아웃 시 홈으로 이동하기 위한 변수
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName); //새로운 닉네임을 저장하는 변수

    const onLogOutClick = () => { //로그아웃 버튼 클릭 시
        authService.signOut();    //로그아웃
        navigate("/");
    };

    const onChange = (event) => { //닉네임 변경 시
        const { target: { value }, } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => { //닉네임 변경 버튼 클릭 시
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) { //닉네임이 변경되었을 경우
            await updateProfile(userObj, { displayName: newDisplayName }); //닉네임을 변경하는 함수
            refreshUser(); //닉네임을 변경한 후에는 새로고침을 해야 변경된 닉네임이 보임
        }
    };

    const getMyNweets = async () => { //내가 쓴 글들을 가져오는 함수
        const nweets = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid), //creatorId가 userObj.uid와 같은 것들을 가져옴
            orderBy("createdAt", "asc") //asc : 오름차순
        );
        console.log(nweets.getDocs.map((doc) => doc.data()));
    };

    useEffect(() => {}, []);

    return ( 
        <>
            <form onSubmit={onSubmit}>
                <input 
                    onChange={onChange} 
                    type="text" 
                    placeholder="Display name" 
                    value={newDisplayName} 
                />
                <input 
                    type="submit" 
                    value="Update Profile" 
                />
            </form>
            <button onClick={onLogOutClick}> 로그아웃 </button> 
        </>
    );
};

export default Profile;
