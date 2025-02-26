"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, Form, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultipleSelector } from "./MultipleSelector";
import Image from "next/image";
import { Button } from "../ui/button";
import axios from "axios";
import apiClient from "@/lib/api-client";
import { CREATE_COMMUNITY, GET_USER_MUTUAL } from "@/lib/constant";
import { useToast } from "@/hooks/use-toast";
import { Types } from "mongoose";

interface IOptions {
  _id: Types.ObjectId;
  name: string;
  username: string;
  image?: string;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  bio: z.string().min(1, "Bio is required"),
  profilePic: z
    .instanceof(File, { message: "Image is required" })
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "File is required"
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be under 4MB"
    ),
  banner: z
    .instanceof(File, { message: "Image is required" })
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "File is required"
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 6,
      "File must be under 6MB"
    ),
  category: z.string().min(1, "Category is Required"),
  members: z
    .array(
      z.object({
        _id: z.string(),
        name: z.string(),
        username: z.string(),
        image: z.string().optional(),
      })
    )
    .min(2, "At least 2 members required."),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    const [profilePicUrl, bannerUrl] = await Promise.all([
      data.profilePic ? uploadToCloudinary(data.profilePic) : null,
      data.banner ? uploadToCloudinary(data.banner) : null,
    ]);

    if (!profilePicUrl || !bannerUrl) {
      return;
    }

    const filteredOptions = selectedOptions?.map((item) => item._id);

    const formData = {
      ...data,
      members: filteredOptions,
      profilePic: profilePicUrl,
      banner: bannerUrl,
    };

    try {
      const response = await apiClient.post(`${CREATE_COMMUNITY}`, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast({ title: "Successfully created community" });
      } else {
        toast({ title: "Unable to create community" });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Try Again!! ",
        description: `${
          error.response.data
            ? error.response?.data
            : "Unable to create community"
        }`,
      });
    }
  };

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [options, setOptions] = useState<IOptions[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<IOptions[]>([]);

  const profilePicRef = useRef<HTMLInputElement | null>(null);
  const bannerImgRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const getMember = async () => {
      try {
        const response = await apiClient.get(GET_USER_MUTUAL, {
          withCredentials: true,
        });
        console.log("USER MUTUALS: ", response.data);
        if (response.status === 200 && response.data) {
          setOptions(response.data.members);
        }
      } catch (error) {
        setOptions([]);
      }
    };

    getMember();
  }, []);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
    );
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string
    );

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, // Replace with your Cloudinary cloud name
        formData
      );

      const data = await response.data;
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error.", error);
      return null;
    }
  };

  const handleProfilePicChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  const handleBannerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
      onChange(file); // ✅ Update form state with the selected file
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" rounded-xl bg-gray-600/10 text-black h-fit min-h-[500px] relative w-[400px] max-w-[400px]"
    >
      <div>
        <div
          className="h-28 bg-zinc-200/10 flex items-center justify-center text-white rounded-t-xl cursor-pointer"
          onClick={() => bannerImgRef.current?.click()}
        >
          {bannerPreview ? (
            <Image
              src={bannerPreview}
              alt="Banner"
              height={300}
              width={400}
              className="w-full h-full object-cover rounded-t-xl"
            />
          ) : (
            <ImagePlus className=" text-2xl " />
          )}
        </div>
        <Controller
          name="banner"
          control={control}
          render={({ field }) => (
            <input
              type="file"
              className="hidden"
              ref={bannerImgRef}
              onChange={(e) => handleBannerChange(e, field.onChange)} // Convert to File object
            />
          )}
        />
        {errors.banner && <div>{errors.banner?.message}</div>}
      </div>

      <div className="mb-8">
        <div
          onClick={() => profilePicRef.current?.click()}
          className="size-[4.5rem] rounded-full bg-white absolute top-16 left-4 flex items-center justify-center cursor-pointer"
        >
          {profilePreview ? (
            <Image
              src={profilePreview}
              alt="Profile"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Plus />
          )}
        </div>
        <Controller
          name="profilePic"
          control={control}
          render={({ field }) => (
            <input
              type="file"
              className="hidden"
              ref={profilePicRef}
              onChange={(e) => handleProfilePicChange(e, field.onChange)} // Convert to File object
            />
          )}
        />
        {errors.profilePic && <div>{errors.profilePic?.message}</div>}
      </div>

      <div className="px-5 space-y-3">
        <div>
          <label className="font-light text-base text-white"> Name </label>
          <br />
          <input
            type="text"
            {...register("name")}
            className="h-10 w-[90%] bg-transparent border-b-2 border-b-gray-700 outline-none text-white"
          />
          {errors.name && <div>{errors.name?.message}</div>}
        </div>

        <div>
          <label className="font-light text-base text-white"> Bio </label>
          <br />
          <input
            {...register("bio")}
            className="h-10 w-[90%] bg-transparent border-b-2 border-b-gray-700 outline-none text-white"
          />
          {errors.bio && <div>{errors.bio?.message}</div>}
        </div>

        <div className="flex gap-5 items-center mt-2">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-[180px] bg-gray-900 rounded-xl text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white rounded-xl">
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {/* <input type="text" {...register("category")} /> */}
          {errors.profilePic && <div> {errors.category?.message} </div>}
        </div>

        <div>
          <label className="font-light text-base text-white pb-2">
            {" "}
            Members{" "}
          </label>
          <br />
          <Controller
            name="members"
            control={control}
            render={({ field }) => (
              <MultipleSelector
                options={options}
                selected={selectedOptions}
                onChange={(selected) => {
                  setSelectedOptions(selected);
                  field.onChange(selected);
                  console.log(field);
                }}
                placeholder="Search by name or username..."
              />
            )}
          />

          {errors.members && (
            <div className="text-red-500">{errors.members?.message}</div>
          )}
        </div>
        <Button
          title="create"
          className="bg-indigo-800 rounded-2xl text-white mx-auto hover:bg-indigo-600 "
          type="submit"
        >
          {" "}
          Create{" "}
        </Button>
      </div>
    </form>
  );
}
