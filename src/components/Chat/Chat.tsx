import ChatContainer from "./ChatContainer";
import ChatHeader from "./ChatHeader";
import MessageBar from "./MessageBar";

export default function Chat() {
    return <div className="border-conversation-border border w-full  bg-conversation-panel-background flex flex-col h-screen z-10">
        <ChatHeader />
        <ChatContainer />
        <MessageBar />
    </div>
}