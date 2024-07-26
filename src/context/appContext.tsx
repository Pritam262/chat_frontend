'use client'

import { createContext, ReactNode, useContext, useState, SetStateAction, Dispatch } from "react";
import crypto from 'crypto';
import { Socket } from "socket.io-client";
import { ChatUser, IncomingVideoCall, IncomingVoiceCall, Message, MessagesInterface, UserContact, UserInfo, VideoCall, VoiceCall } from "@/utils/types";

// interface UserInfo {
//   id?: string,
//   displayName: string,
//   email: string,
//   photoURL: string,
//   about?: string,
// }

// interface ChatUser {
//   id: string,
//   name: string,
//   email: string,
//   profilePicture: string,
//   about: string
// }

// interface Message {
//   id: string,
//   senderId: string,
//   receverId: string,
//   type: string,
//   message: string,
//   messageStatus: string,
//   createdAt: string
// }
// interface MessagesInterface {
//   messages: Message[]
// }

interface SocketMessage {
  id: string,
  senderId: string,
  receverId: string,
  type: string,
  message: string,
  messageStatus: string,
  createdAt: string
}



interface OnlineUser {

}[]



type AppContextType = {

  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>; // Corrected type for setIsLogin
  userInfo: UserInfo | undefined,
  setUserInfo: Dispatch<SetStateAction<UserInfo | undefined>>,
  newUser: boolean,
  setNewUser: Dispatch<SetStateAction<boolean>>,
  isContactPage: boolean,
  setIsContactPage: Dispatch<SetStateAction<boolean>>,
  // changeCurrentChatUser:
  currentChatUser: ChatUser | undefined,
  setCurrentChatUser: Dispatch<SetStateAction<ChatUser | undefined>>,
  // messages: MessagesInterface | undefined,
  // setMessages: Dispatch<SetStateAction<MessagesInterface | undefined>>,
  messages: Message[] | undefined;  // Corrected type for messages
  setMessages: Dispatch<SetStateAction<Message[] | undefined>>;

  encryptText: (text: string) => string,
  decryptText: (text: string) => string,
  // encrypt: (text: string) => string,
  // decrypt: (text: string) => string,
  socket: Socket | undefined,
  setSocket: Dispatch<SetStateAction<Socket | undefined>>,
  messagesSearch: boolean,
  setMessagesSearch: Dispatch<SetStateAction<boolean>>,
  // socketMessage: Message | undefined,
  // setSocketMessage: Dispatch<SetStateAction<Message | undefined>>,
  userContacts: UserContact[] | undefined;
  setUserContacts: Dispatch<SetStateAction<UserContact[] | undefined>>;
  onlineUsers: OnlineUser[] | undefined;
  setOnlineUsers: Dispatch<SetStateAction<OnlineUser[] | undefined>>;
  filterContacts: UserContact[] | undefined;
  setFilterContacts: Dispatch<SetStateAction<UserContact[] | undefined>>;
  isSearchChatActive: boolean;
  setIsSearchChatActive: Dispatch<SetStateAction<boolean>>;
  videoCall: VideoCall | undefined;
  setVideoCall: Dispatch<SetStateAction<VideoCall | undefined>>;
  voiceCall: VoiceCall | undefined;
  setVoiceCall: Dispatch<SetStateAction<VoiceCall | undefined>>;
  endCall: () => void;
  // setEndCall: Dispatch<SetStateAction<void>>;
  incomingVoiceCall: IncomingVoiceCall | undefined;
  setIncomingVoiceCall: Dispatch<SetStateAction<IncomingVoiceCall | undefined>>;
  incomingVideoCall: IncomingVideoCall | undefined;
  setIncomingVideoCall: Dispatch<SetStateAction<IncomingVideoCall | undefined>>;

  exitChat: () => void;
  isCallEnd: boolean;
  setIsCallEnd: Dispatch<SetStateAction<boolean>>;
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
  const [isContactPage, setIsContactPage] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState<ChatUser | undefined>();
  const [messages, setMessages] = useState<Message[] | undefined>([]);

  const [socket, setSocket] = useState<Socket | undefined>();
  const [messagesSearch, setMessagesSearch] = useState<boolean>(false);

  const [userContacts, setUserContacts] = useState<UserContact[] | undefined>();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[] | undefined>();
  const [filterContacts, setFilterContacts] = useState<UserContact[] | undefined>()

  const [isSearchChatActive, setIsSearchChatActive] = useState(false);
  const [voiceCall, setVoiceCall] = useState<VoiceCall | undefined>()
  const [videoCall, setVideoCall] = useState<VideoCall | undefined>();
  const [incomingVoiceCall, setIncomingVoiceCall] = useState<IncomingVoiceCall | undefined>();
  const [incomingVideoCall, setIncomingVideoCall] = useState<IncomingVideoCall | undefined>();

  const [isCallEnd, setIsCallEnd] = useState(true);


  const endCall = () => {
    setIncomingVideoCall(undefined);
    setIncomingVoiceCall(undefined);
    setVoiceCall(undefined);
    setVideoCall(undefined);
  }
  // const [endCall, setEndCall] = useState(endCallU);

  // const [socketMessage, setSocketMessage] = useState<Message | undefined>();


  const exitChat = () => {
    setCurrentChatUser(undefined);

  }

  function encryptText(text: string,) {
    const bufferKey = Buffer.from([0x8e, 0x60, 0x5e, 0xfe, 0xc7, 0x5f, 0xda, 0xda, 0xad, 0xcf, 0x4c, 0x9b, 0xea, 0x33, 0xde, 0x82, 0x2a, 0x4a, 0xf5, 0x77, 0x32, 0x25, 0xba, 0x43, 0xd6, 0x4b, 0x9a, 0xa8, 0xe1, 0xd2, 0x20, 0x0d]);
    // console.log(bufferKey)
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16); // 128-bit IV

    const cipher = crypto.createCipheriv(algorithm, bufferKey, iv);
    const encryptedData = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

    return `${iv.toString('hex')}:${encryptedData}`; // Combine IV and encrypted data
  }

  function decryptText(encryptedData: string,) {
    const bufferKey = Buffer.from([0x8e, 0x60, 0x5e, 0xfe, 0xc7, 0x5f, 0xda, 0xda, 0xad, 0xcf, 0x4c, 0x9b, 0xea, 0x33, 0xde, 0x82, 0x2a, 0x4a, 0xf5, 0x77, 0x32, 0x25, 0xba, 0x43, 0xd6, 0x4b, 0x9a, 0xa8, 0xe1, 0xd2, 0x20, 0x0d]);
    const [ivStr, encryptedText] = encryptedData.split(':');
    const iv = Buffer.from(ivStr, 'hex');
    if (!ivStr || !encryptedText) {
      return encryptedData;
    }
    else {


      const decipher = crypto.createDecipheriv('aes-256-cbc', bufferKey, iv);
      const decryptedData = decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');

      return decryptedData;
    }
  }



  //   // Generate keys
  //   const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  //     modulusLength: 2048, // Key size
  //     publicKeyEncoding: {
  //       type: 'spki',
  //       format: 'pem'
  //     },
  //     privateKeyEncoding: {
  //       type: 'pkcs8',
  //       format: 'pem',
  //     }
  //   });

  //   console.log(publicKey, privateKey);


  //  function encrypt(text: string): string {
  //     const encryptedBuffer = crypto.publicEncrypt({
  //         key: publicKey,
  //         padding: crypto.constants.RSA_PKCS1_PADDING
  //     }, Buffer.from(text));

  //     return encryptedBuffer.toString('base64');
  // }

  // // Decryption function
  //  function decrypt(encryptedText: string): string {
  //     const decryptedBuffer = crypto.privateDecrypt({
  //         key: privateKey,
  //         padding: crypto.constants.RSA_PKCS1_PADDING
  //     }, Buffer.from(encryptedText, 'base64'));

  //     return decryptedBuffer.toString('utf8');
  // }



  const contextValue: AppContextType = {


    isLogin,
    setIsLogin,
    userInfo,
    setUserInfo,
    newUser,
    setNewUser,
    isContactPage,
    setIsContactPage,
    currentChatUser,
    setCurrentChatUser,
    messages,
    setMessages,
    encryptText,
    decryptText,
    // encrypt,
    // decrypt
    socket,
    setSocket,
    // socketMessage,
    // setSocketMessage,
    messagesSearch,
    setMessagesSearch,
    userContacts,
    setUserContacts,
    onlineUsers,
    setOnlineUsers,
    filterContacts,
    setFilterContacts,
    isSearchChatActive,
    setIsSearchChatActive,
    voiceCall,
    setVoiceCall,
    videoCall,
    setVideoCall,
    endCall,
    // setEndCall,
    incomingVoiceCall,
    setIncomingVoiceCall,
    incomingVideoCall,
    setIncomingVideoCall,
    exitChat,
    isCallEnd,
    setIsCallEnd,
  };

  return <AppContext.Provider value={contextValue}> {children} </AppContext.Provider>
}