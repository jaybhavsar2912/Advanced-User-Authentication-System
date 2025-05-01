import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessions, clearError } from "../redux/slice/sessionSlice";
import SessionCard from "../components/SessionCard";

function Sessions() {
  const { sessions, isLoading, error } = useSelector((state) => state.sessions);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSessions());
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Active Sessions
        </h2>
        {error && <div className="text-red-500 text-center mb-6">{error}</div>}
        {isLoading ? (
          <div className="text-center text-gray-600">Loading sessions...</div>
        ) : !Array.isArray(sessions) || sessions.length === 0 ? (
          <div className="text-center text-gray-600">
            No active sessions found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sessions;
