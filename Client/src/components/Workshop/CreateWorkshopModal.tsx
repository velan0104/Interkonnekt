"use client";

import { useState, useRef } from "react";
import {
  CalendarIcon,
  Users,
  BookOpen,
  Clock,
  Tag,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import axios from "axios";
import apiClient from "@/lib/api-client";
import { CREATE_WORKSHOP } from "@/lib/constant";

const CATEGORIES = [
  "Technology",
  "Art",
  "Business",
  "Education",
  "Health",
  "Lifestyle",
  "Other",
];

const CreateWorkshopModal = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    category: "",
    maxParticipants: 10,
  });
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxParticipants" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setBannerImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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

  const handleRemoveImage = () => {
    setBannerImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (
        !formData.title ||
        !formData.description ||
        !formData.startTime ||
        !formData.category
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Here you would upload the image to Cloudinary and get the URL
      let bannerImageUrl: string | null = "";
      if (bannerImage) {
        bannerImageUrl = await uploadToCloudinary(bannerImage);
      } else {
        bannerImageUrl = null;
      }

      // Prepare the final data to send to the backend
      const workshopData = {
        ...formData,
        bannerImage: bannerImageUrl,
        communityId: id,
      };

      // console.log("WORKSHOP DATA: ", workshopData);

      const response = await apiClient.post(
        `${CREATE_WORKSHOP}`,
        workshopData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201 && response.data) {
        setOpen(false);
      } else {
        alert("Unable to create workshop");
      }

      setFormData({
        title: "",
        description: "",
        startTime: "",
        category: "",
        maxParticipants: 10,
      });
      setBannerImage(null);
      setImagePreview(null);
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium">
          Create Workshop
        </Button>
      </ModalTrigger>
      <ModalContent
        className="sm:max-w-[550px] bg-gray-900 text-white border-4 border-theme"
        style={{ borderRadius: "10px" }}
      >
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle className="text-2xl text-theme text-center">
              Create New Workshop
            </ModalTitle>
            {/* <ModalDescription>
              Fill in the details below to create your workshop. All fields
              marked with * are required.
            </ModalDescription> */}
          </ModalHeader>

          <div className="grid gap-6 py-4">
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label
                htmlFor="title"
                className="flex items-center gap-2 text-theme"
              >
                <BookOpen className="h-4 w-4" />
                Workshop Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a catchy title"
                className="focus-visible:ring-blue-500"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="description"
                className="flex items-center gap-2 text-theme"
              >
                <Tag className="h-4 w-4" />
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what participants will learn"
                className="min-h-[100px] focus-visible:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="startTime"
                  className="flex items-center gap-2 text-theme"
                >
                  <Clock className="h-4 w-4" />
                  Start Time *
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="focus-visible:ring-blue-500"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="category"
                  className="flex items-center gap-2 text-theme"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Category *
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
                    "text-sm ring-offset-background file:border-0 file:bg-transparent",
                    "file:text-sm file:font-medium placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="bannerImage"
                className="flex items-center gap-2 text-theme"
              >
                <ImageIcon className="h-4 w-4" />
                Banner Image
              </Label>

              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-input rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload an image or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG or GIF (max. 5MB)
                  </p>
                  <Input
                    ref={fileInputRef}
                    id="bannerImage"
                    name="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative rounded-md overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Banner preview"
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="maxParticipants"
                className="flex items-center gap-2 text-theme"
              >
                <Users className="h-4 w-4" />
                Max Participants
              </Label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <ModalFooter className="mx-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="mr-2 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-theme/40 to-theme hover:from-theme/70 hover:to-theme rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Workshop"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateWorkshopModal;
