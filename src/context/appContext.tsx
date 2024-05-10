'use client'

import { createContext, ReactNode, useContext, useState, SetStateAction, Dispatch } from "react";

interface UserInfo {
  id?:string,
  displayName: string,
  email: string,
  photoURL: string,
  about?:string,
}

type AppContextType = {

  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>; // Corrected type for setIsLogin
  userInfo: UserInfo | undefined,
  setUserInfo: Dispatch<SetStateAction<UserInfo | undefined>>,
  newUser:boolean,
  setNewUser:Dispatch<SetStateAction<boolean>>,
};


const AppContext = createContext<AppContextType | undefined>(undefined);


export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}



type AppProviderProps = {
  children: ReactNode;
};



export function AppProvider({ children }: AppProviderProps) {


  const [isLogin, setIsLogin] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

  const [newUser, setNewUser] = useState(false);






  const contextValue: AppContextType = {


    isLogin,
    setIsLogin,
    userInfo,
    setUserInfo,
    newUser,
    setNewUser,
  };

  return <AppContext.Provider value={contextValue}> {children} </AppContext.Provider>
}