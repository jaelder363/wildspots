import Layout from '@/src/components/Layout';

export default function ProfilePage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500">
              👤
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
              <p className="mt-1 text-sm text-gray-500">Campsite Enthusiast</p>
              <div className="mt-2 flex space-x-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <a
              href="#"
              className="border-green-500 text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              My Campsites
            </a>
            <a
              href="#"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Reviews
            </a>
            <a
              href="#"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Saved Lists
            </a>
          </nav>
        </div>

        {/* Campsite Grid */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">My Campsites</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="h-48 bg-gray-200">
                  {/* Placeholder for campsite image */}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">My Campsite {item}</h3>
                  <p className="mt-1 text-sm text-gray-500">Beautiful location</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">3.8 ★ (24 reviews)</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              + Add New Campsite
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
