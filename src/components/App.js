import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          uid : user.uid,
          displayname: user.displayName,
          updateProfile: (args) => user.updateProfile(args),
      });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      uid : user.uid,
      displayname: user.displayName,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter 
          refreshUser={refreshUser}  
          isLoggedIn={Boolean(userObj)} 
          userObj={ userObj }
        />
        ) : (
          "Initializing..." 
        )}
    </>
  );
}

export default App;

