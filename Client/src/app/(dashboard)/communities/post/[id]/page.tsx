"use client";
import { RootState } from "@/app/Store/store";
import { PostCard } from "@/components/Communities/Post/PostCard";
import apiClient from "@/lib/api-client";
import { GET_POST_WITH_COMMENTS } from "@/lib/constant";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const page = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiClient.get(`${GET_POST_WITH_COMMENTS}/${id}`, {
          withCredentials: true,
        });
        // console.log("RES: ", res);
        if (res.status === 200 && res.data) {
          setPostData(res.data.data);
        }
        // console.log("POST DATA: ", postData);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return <div>{id}</div>;
};

export default page;
