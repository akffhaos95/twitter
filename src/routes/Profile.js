import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "../fbase";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const getMyTweets = async() => {
        const tweets = await dbService
            .collection("tweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
        console.log(tweets.docs.map(doc => doc.data()));
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    }
    useEffect(() => {
        getMyTweets();
    }, [])
    return (
    <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
            <input 
                onChange={onChange}
                type="text" 
                autoFocus
                placeholder="Display name"
                value={newDisplayName}
                className="formInput"
            />
            <input 
                type="submit" 
                value="Update profile"
                className="formBtn"
                style={{
                    marginTop: 10,
                }} 
            />
        </form>
        <span className="formBtn cancelBtn logout" onClick={onLogOutClick}>
            Log Out
        </span>
    </div>
    );
};