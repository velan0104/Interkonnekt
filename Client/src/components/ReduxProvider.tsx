"use client";

import { Provider } from "react-redux";
import { FC, ReactNode } from "react";
import { store } from "@/app/Store/store"; // Adjust the path to your store file

interface Props {
  children: ReactNode;
}

const ReduxProvider: FC<Props> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
