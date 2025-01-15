import { FC } from "react";
import ChatHeader from "../ChatComponent/ChatHeader";
import MessageContainer from "../ChatComponent/MessageContainer";

const Messages: FC = () => {
  return (
    <div>
      <ChatHeader />
      <MessageContainer />
    </div>
  );
};

export default Messages;
