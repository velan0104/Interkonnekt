"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST, SEARCH_CONTACT_ROUTE } from "@/lib/constant";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import {
  setSelectedChatData,
  setSelectedChatType,
  setSelectedChatMessages,
  setOpenAddMemberModal,
  setOpenNewContactModal,
} from "@/Slice/chatSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import apiClient from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { IContact } from "@/types";

interface ContactListProps {
  contacts: IContact[];
  isChannel?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts = [],
  isChannel = false,
}) => {
  const { data: user } = useSession();
  const dispatch = useDispatch();
  const [searchedContacts, setSearchedContacts] = useState([]);
  const selectedChatData = useSelector(
    (state: RootState) => state.chat.selectedChatData
  );
  const openNewContactModal = useSelector(
    (state: RootState) => state.chat.openNewContactModal
  );

  const handleClick = (contact: IContact) => {
    if (isChannel) {
      dispatch(setSelectedChatType("channel"));
    } else {
      dispatch(setSelectedChatType("contact"));
    }

    dispatch(setSelectedChatData(contact));

    if (selectedChatData && selectedChatData._id !== contact._id) {
      dispatch(setSelectedChatMessages([]));
    }
  };

  const searchContacts = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACT_ROUTE,
          { searchTerm, user: user?.user?.id },
          { withCredentials: true }
        );
        // console.log("SEARCH CONTACTS: ", response);

        if (response.status === 200 && response.data.message) {
          setSearchedContacts(response.data.message);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact: IContact) => {
    dispatch(setOpenNewContactModal(false));
    dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedChatData(contact));
    setSearchedContacts([]);
  };

  const openModal = () => {
    dispatch(setOpenAddMemberModal(true));
  };

  const getColor = (color?: string) => {
    return color || "bg-gray-500"; // Default color if `contact.color` is undefined
  };

  return (
    <div className="mt-5 bg-gray-900">
      <div className="border-b-2 border-b-gray-800">
        <h1 className="text-3xl text-white text-center p-3"> Messages </h1>
        <div className="flex justify-center items-center pb-5">
          <input
            className="w-[85%] rounded-3xl bg-gray-300 h-[50px] mx-auto px-5 outline-none"
            type="text"
            placeholder="Search..."
            onClick={() => dispatch(setOpenNewContactModal(true))}
          />
        </div>
      </div>
      {(contacts.length === 0 || !contacts) && (
        <div className="h-[60vh] flex justify-center items-center ">
          <div className="text-3xl text-white"> No Messages </div>
        </div>
      )}
      {contacts.length > 0 &&
        contacts.map((contact) => (
          <div
            key={`${
              typeof contact._id === "string"
                ? contact._id
                : contact._id.toString
            }`}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer bg-gray-900 ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-purple-600"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300">
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={contact.image}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`${
                        selectedChatData && selectedChatData._id === contact._id
                          ? "bg-[#ffffff22] border border-white"
                          : "bg-[#FF0000]"
                      } uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}
                    >
                      {contact.name?.charAt(0)}
                    </div>
                  )}
                </Avatar>
              )}
              {isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image && contact.image.includes(".svg") ? (
                    <AvatarImage src={contact.image} />
                  ) : (
                    <AvatarImage src={contact.image} />
                  )}
                </Avatar>
              )}
              {isChannel ? (
                <span>{contact.name}</span>
              ) : (
                <span> {contact.username} </span>
              )}
            </div>
          </div>
        ))}
      {openNewContactModal && (
        <Dialog
          open={openNewContactModal}
          onOpenChange={() => dispatch(setOpenNewContactModal(false))}
        >
          <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
            <DialogHeader>
              <DialogTitle> Please select a contact </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <Input
                placeholder="Search Contacts"
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                onChange={(e) => searchContacts(e.target.value)}
              />
            </div>
            {searchContacts.length > 0 && (
              <ScrollArea className="h-[250px] ">
                <div className="flex flex-col gap-5">
                  {searchedContacts.map((contact: IContact) => (
                    <div
                      key={contact._id.toString()}
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={() => selectNewContact(contact)}
                    >
                      <div className=" w-12 h-12 relative">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          {contact.image ? (
                            <AvatarImage
                              src={`${HOST}/${contact.image}`}
                              alt="profile"
                              className="object-cover w-full h-full bg-black"
                            />
                          ) : (
                            <div
                              className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full `}
                            >
                              {contact.name
                                ? contact.name.split("").shift()
                                : contact.email.split("").shift()}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {contact.name ? `${contact.name}` : contact.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            {searchedContacts.length == 0 && (
              <div className="flex-1 md:bg-inherit md:flex flex-col justify-center items-center duration-1000 transition-all">
                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
                  <h3 className="poppins-medium">
                    Hi <span className=" text-purple-500"> !</span> Search New{" "}
                    <span className=" text-purple-500"> Contact </span>
                  </h3>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContactList;
