interface Follower {
  _id: string;
  name: string;
  username: string;
}

interface FollowerModalProps {
  followers: Follower[];
  onClose: () => void;
}

export default function FollowerModal({ followers, onClose }: FollowerModalProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-gray-800 text-white p-6 rounded-lg w-80">
          <h2 className="text-xl font-bold mb-4 text-[#53c97d]">Followers</h2>
          <ul>
            {followers.map((user) => (
              <li key={user._id} className="mb-2">
                {user.name} (@{user.username})
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  