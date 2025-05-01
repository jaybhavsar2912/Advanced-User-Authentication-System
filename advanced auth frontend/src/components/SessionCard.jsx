import { useDispatch } from "react-redux";
import { logoutSession } from "../redux/slice/sessionSlice";

function SessionCard({ session }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutSession(session._id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
      <p className="text-sm text-gray-600">
        <strong>IP Address:</strong> {session.ipAddress}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Device:</strong> {session.userAgent}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Last Active:</strong>{" "}
        {new Date(session.lastActiveAt).toLocaleString()}
      </p>
    </div>
  );
}

export default SessionCard;
