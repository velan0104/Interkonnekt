import { FC } from "react";
import ChatHeader from "../ChatComponent/ChatHeader";
import MessageContainer from "../ChatComponent/MessageContainer";
import MessageBar from "../ChatComponent/MessageBar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import DefaultLayout from "../ChatComponent/DefaultLayout";

const Messages: FC = () => {
  const selectedChatType = useSelector(
    (state: RootState) => state.chat.selectedChatType
  );
  return (
    <div>
      {!selectedChatType ? (
        <DefaultLayout />
      ) : (
        <div>
          <ChatHeader />
          <MessageContainer />
          <MessageBar />
        </div>
      )}
    </div>
  );
};

export default Messages;
