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