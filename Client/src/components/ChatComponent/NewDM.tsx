import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HOST, SEARCH_CONTACT_ROUTE } from "@/lib/constant";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import {
  setOpenNewContactModal,
  setSelectedChatData,
  setSelectedChatType,
} from "@/Slice/chatSlice";

const NewDM = () => {
  const dispatch = useDispatch();
  const [searchedContacts, setSearchedContacts] = useState([]);
  const openNewContactModal = useSelector(
    (state: RootState) => state.chat.openNewContactModal
  );

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACT_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    dispatch(setOpenNewContactModal(false));
    dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedChatData(contact));
    setSearchedContacts([]);
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className=" text-neutral-400 font-light text-opacity-90 text-start cursor-pointer hover:text-neutral-100 transition-all duration-300"
              onClick={() => dispatch(setOpenNewContactModal(true))}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
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
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
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
    </div>
  );
};

export default NewDM;
