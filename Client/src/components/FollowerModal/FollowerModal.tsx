export default function FollowerModal({ followers, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-gray-800 text-white p-6 rounded-lg w-80">
          <h2 className="text-xl font-bold mb-4">Followers</h2>
          <ul>
            {followers.map((user) => (
              <li key={user._id} className="mb-2">
                {user.name} (@{user.username})
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  