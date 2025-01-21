import { FC } from "react";
import ChatHeader from "../ChatComponent/ChatHeader";
import MessageContainer from "../ChatComponent/MessageContainer";
import MessageBar from "../ChatComponent/MessageBar";

const Messages: FC = () => {
  return (
    <div>
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default Messages;
