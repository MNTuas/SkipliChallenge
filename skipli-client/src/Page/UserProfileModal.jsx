
import { useState, useEffect } from "react"
import { X, Phone, Heart, ExternalLink, Users, BookOpen } from "lucide-react"

const UserProfileModal = ({ onClose }) => {
  const [likedUsers, setLikedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const phoneNumber = localStorage.getItem("phoneNumber");
  
  useEffect(() => {
    fetchUserProfile()
  }, [phoneNumber])

  const fetchUserProfile = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://localhost:8080/getUserProfile?phone_number=${phoneNumber}`)

      if (response.ok) {
        const data = await response.json()
        setLikedUsers(data.favorite_github_users || [])
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch profile")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Phone Number */}
          <div className="mb-8">
            <div className="flex items-center text-lg">
              <Phone className="h-5 w-5 mr-2 text-gray-600" />
              <span className="font-medium">Phone Number:</span>
              <span className="ml-2 text-gray-700">{phoneNumber}</span>
            </div>
          </div>

          {/* Liked Users Section */}
          <div>
            <div className="flex items-center mb-6">
              <Heart className="h-6 w-6 mr-2 text-red-500 fill-current" />
              <h3 className="text-xl font-semibold text-gray-900">Liked GitHub Users ({likedUsers.length})</h3>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600">{error}</div>
              </div>
            ) : likedUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">No liked users yet</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {likedUsers.map((user) => (
                  <div key={user.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center mb-3">
                      <img
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={user.login}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.login}</h4>
                        <p className="text-sm text-gray-600">ID: {user.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      {user.public_repos !== undefined && (
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {user.public_repos} repos
                        </div>
                      )}
                      {user.followers !== undefined && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {user.followers} followers
                        </div>
                      )}
                    </div>

                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Profile
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileModal
