export interface Message {
    id: string,
    senderId: string,
    receverId: string,
    type: string,
    message: string,
    messageStatus: string,
    createdAt: string,
    formSelf?: boolean,
}
export interface MessagesInterface {
    data: Message[]
}


export interface UserInfo {
    id?: string,
    displayName: string,
    email: string,
    photoURL: string,
    about?: string,
}

export interface ChatUser {
    id: string,
    name: string,
    email: string,
    profilePicture: string,
    about: string
}

export interface UserContact {
    about: string,
    createdAt: string,
    email: string,
    id: string,
    message: string,
    messageId: string,
    messageStatus: string,
    name: string,
    profilePicture: string,
    receverId: string,
    senderId: string,
    type: string,
    totalUnreadMessages: number
}

export interface VideoCall {
    currentChatUser: {
        id: string,
        name: string,
        profilePicture: string,
    },
    type: string,
    callType: string,
    roomId: number,
}

export interface VoiceCall {
    currentChatUser: {
        id: string,
        name: string,
        profilePicture: string,
    },
    type: string,
    callType: string,
    roomId: number,
}

export interface IncomingVideoCall {
    from: {
        id: string,
        name: string,
        profilePicture: string,
    },
    roomId: number,
    callType: string
}

export interface IncomingVoiceCall {
    from: {
        id: string,
        name: string,
        profilePicture: string,
    },
    roomId: number,
    callType: string
}