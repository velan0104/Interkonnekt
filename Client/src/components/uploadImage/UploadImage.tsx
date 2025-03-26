import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface UploadImagesProps {
  triggerUpload: boolean;
}

const UploadImages = () => {
  const { data: session } = useSession();
  const Router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  return (
    <CldUploadWidget
      uploadPreset="interkonnekt_uploads"
      onError={(error) => {
        console.log("Cloudinary Upload Error:", error);
        alert("Upload failed. Check the console for details.");
      }}
      onSuccess={async ({ event, info }) => {
        if (event === "success") {
          setLoading(true);

          try {
            const response = await fetch("/api/InsertUsername", {
              method: "POST",
              body: JSON.stringify({
                profileImage: info?.url,
                email: session?.user?.email,
                id: session?.user?.id,
              }),
              headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
              console.error("Server Response Error:", await response.json());
              alert("Error in uploading image");
            }
            Router.push("/main");
          } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
      }}
    >
      {({ open }) => (
        <button onClick={() => open()}>
          {loading ? "Uploading..." : "Edit"}
        </button>
      )}
    </CldUploadWidget>
  );
};

export default UploadImages;
