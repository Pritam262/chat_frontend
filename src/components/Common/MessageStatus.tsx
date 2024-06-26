import { BsCheck, BsCheckAll } from "react-icons/bs"

interface PropsInterface {
    props: {
        messageStatus: string
    }
}
export default function MessageStatus ({ props: { messageStatus } }: PropsInterface) {
    return <>
        {messageStatus === "sent" && <BsCheck className="text-lg text-slate-300 opacity-40" />}
        {messageStatus === "delivered" && <BsCheckAll className="text-lg text-slate-400 opacity-40" />}
        {messageStatus === "read" && <BsCheckAll className="text-lg text-icon-ack" />}
    </>
}