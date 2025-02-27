import { useSession } from 'next-auth/react';
import { CldUploadWidget } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

interface UploadImagesProps {

  triggerUpload: boolean;

}

 
 const UploadImages = () => {
  const { data: session } = useSession();
  const Router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("email in upload image: ",session?.user?.email)
    return (
<CldUploadWidget uploadPreset="interkonnekt_uploads" onSuccess={async({event, info}) => {
  if(event === 'success'){
    setLoading(true);
    console.log("info at uploading image", info)
    try {
      const response = await fetch('/api/InsertUsername', {
        method: 'POST',
        body: JSON.stringify({  profileImage: info?.url, email: session?.user?.email, id: session?.user?.id}),
        headers: { 'Content-Type': 'application/json' },
      });
      // const response2 = await fetch("/api/createPost",{
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(profileImage: info?.public_id)
      // })
      if (!response.ok){
        console.log("response after error: ",response)
        alert("Error in uploading image")
      }
      Router.push('/main');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
}}>
  {({ open }) => {
    return (
      <button onClick={() => open()}>
       {loading ? "Uploading..." : "Edit"}
      </button>
    );
  }}
</CldUploadWidget>
    )
}

export default UploadImages