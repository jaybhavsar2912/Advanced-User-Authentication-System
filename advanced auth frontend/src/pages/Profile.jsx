import { useSelector } from "react-redux";

function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Profile
        </h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-600">
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
