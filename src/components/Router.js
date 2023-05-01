import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Routes>
                {isLoggedIn ? ( //로그인 유무에 따라 라우트 중 하나 나타냄
                    <>
                        <Route exact path="/" element = {<Home userObj = {userObj} />}/>
                        <Route exact path="/profile" element = {<Profile refreshUser={refreshUser} userObj={userObj}/>} />
                    </>
                ) : (
                    <Route exact path="/" element = { <Auth />} />
                )}
            </Routes>
        </Router>
    );
};

export default AppRouter;
