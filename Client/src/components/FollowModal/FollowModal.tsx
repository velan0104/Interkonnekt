import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: { id: string; name: string }[];
}

const FollowModal: React.FC<FollowModalProps> = ({ isOpen, onClose, title, users }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="mb-2">
              {user.name}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default FollowModal;
