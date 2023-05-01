import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL} from "firebase/storage";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState(" ");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState();

    useEffect(() => { //실시간으로 데이터베이스의 내용을 가져오는 함수 (128)
        onSnapshot(collection(dbService, "nweets"), (snapshot) => { //onSnapshot은 데이터베이스의 내용이 변경될 때마다 실행되는 함수
            const nweetArray = snapshot.docs.map((doc) => ({ //snapshot.docs는 데이터베이스의 내용을 배열로 가져오는 함수
                id: doc.id, //doc.id는 데이터베이스의 내용의 id를 가져오는 함수
                ...doc.data(), //doc.data()는 데이터베이스의 내용을 가져오는 함수
            })); 
            setNweets(nweetArray); //setNweets는 nweets의 내용을 변경하는 함수
        });
    }, []);

    const onSubmit = async (event) => { //데이터베이스에 내용을 추가하는 함수
        event.preventDefault(); //이벤트의 기본 동작을 막는 함수
        let attachmentUrl = ""; //파일을 저장할 변수
        if (attachment !== "") { //파일이 있을 경우
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); //파일을 저장할 경로를 지정하는 함수
            const response = await uploadString(attachment, "data_url"); //파일을 저장하는 함수
            attachmentUrl = await getDownloadURL(ref(response)); //파일의 경로를 가져오는 함수
        }
        
        await addDoc(collection(dbService, "nweets"), { //데이터베이스에 내용을 추가하는 함수
            text: nweet,
            createdAt: Date.now(), 
            creatorId: userObj.uid, 
            attachmentUrl,
          });
        setNweet("");
        setAttachment("");
    };

    
    const onChange = (event) => {
        event.preventDefault();
        const { target: { value }, } = event;
        setNweet(value); 
    };

    const onFileChange = (event) => {
        const { target: { files }, } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }, } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");

    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                type="text" 
                value={nweet} 
                onChange={onChange} 
                placeholder = "여기에 글을 입력하세요." 
                maxLength = {120} 
                />

                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="글쓰기" />

                {attachment && (
                    <div>
                        <img src = {attachment} width = "50px" height = "50px" />
                        <button onClick = {onClearAttachment}>취소</button>
                    </div>
                )}
            </form>

            <div>
                {nweets.map((nweet) => (
                   <Nweet 
                    key={nweet.id} 
                    nweetObj={nweet} 
                    isOwner = {nweet.creatorId === userObj.uid}
                   /> 
                ))}
            </div>
        </>
    );
};

export default Home;

