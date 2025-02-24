import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Types } from "mongoose";
import Image from "next/image";

interface User {
  image?: string;
  name: string;
  username: string;
  _id: Types.ObjectId;
}

interface MultipleSelectorProps {
  options: User[];
  selected: User[];
  onChange: (selected: User[]) => void;
  placeholder?: string;
}

export function MultipleSelector({
  options,
  selected,
  onChange,
  placeholder = "Select users...",
}: MultipleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(
    (user) =>
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())) &&
      !selected.some((selectedUser) => selectedUser.username === user.username)
  );

  const handleSelect = (user: User) => {
    onChange([...selected, user]);
    setSearch("");
  };

  const handleRemove = (userToRemove: User) => {
    onChange(
      selected.filter((user) => user.username !== userToRemove.username)
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative " ref={containerRef}>
      <div
        className="min-h-[42px] p-2 border rounded-xl bg-white cursor-pointer "
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selected.map((user) => (
            <span
              key={user.username}
              className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={100}
                  height={100}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full object-cover bg-gray-200"></div>
              )}
              {user.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(user);
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full outline-none bg-transparent"
              placeholder={selected.length === 0 ? placeholder : ""}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            />
          </div>
        </div>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 max-h-60 overflow-auto bg-white border rounded-lg shadow-lg z-10">
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-gray-500 text-center">
              No results found
            </div>
          ) : (
            filteredOptions.map((user) => (
              <div
                key={user.username}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                onClick={() => {
                  handleSelect(user);
                  setIsOpen(false);
                }}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={100}
                    height={100}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full object-cover bg-gray-200" />
                )}
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
