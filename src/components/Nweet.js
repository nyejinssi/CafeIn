import { dbService, storageService} from "fbase";
import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제한 글은 복구할 수 없습니다. 정말 삭제하시겠습니까?");

        if (ok) {
            await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
            if (nweetObj.attachmentUrl !== "") {
                await deleteObject(ref(storageService, nweetObj.attachmentUrl));
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);
 
    const onChange = (event) => {
        const { 
            target: { value }, 
        } = event;
        setNewNweet(value);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        updateDoc(doc(dbService, `nweets/${nweetObj.id}`), {text : newNweet });
        setEditing(false);
    };

    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit = {onSubmit}>
                        <input onChange = {onChange} type = "text" placeholder = "Edit your nweet" value = {newNweet} required  />
                        <input type = "submit" value = "Update Nweet" />
                    </form>
                    <button onClick = {toggleEditing}> 취소 </button>
                </>
            ) : (
                <>
                    <h4> {nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && (
                        <img src = {nweetObj.attachmentUrl} width = "50px" height = "50px" />
                    )}
                    
                    {isOwner && (
                        <>
                            <button onClick = {onDeleteClick} > 삭제 </button>
                            <button onClick = {toggleEditing} > 수정 </button>
                        </>
                    )}
                </>
            )}            
        </div>
    );
};

export default Nweet;
