
import { useState } from "react"
import { Search, User, LogOut } from "lucide-react"
import GitHubUserGrid from "./GitHubUserGrid"
import UserProfileModal from "./UserProfileModal"

const Dashboard = ({ phoneNumber }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showProfile, setShowProfile] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    // The search will be handled by the GitHubUserGrid component
  }

  const onLogout = () => {
  localStorage.removeItem('phoneNumber'); // hoặc xóa hết: localStorage.clear()
  window.location.href = '/'; // chuyển hướng về trang chủ
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-900 mr-8">GitHub Search</h1>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search GitHub users..."
                  />
                </div>
              </form>
            </div>

            {/* Profile and Logout */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfile(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <User className="h-6 w-6" />
              </button>
              <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <LogOut className="h-6 w-6" />
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GitHubUserGrid searchQuery={searchQuery} phoneNumber={phoneNumber} />
      </main>

      {/* Profile Modal */}
      {showProfile && <UserProfileModal phoneNumber={phoneNumber} onClose={() => setShowProfile(false)} />}
    </div>
  )
}

export default Dashboard
