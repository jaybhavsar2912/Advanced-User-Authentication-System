function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Dashboard
        </h2>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p className="text-gray-600 text-center">
            Welcome to the admin dashboard. This is a protected route for admin
            users only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
