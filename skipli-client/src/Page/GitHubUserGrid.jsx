
import { useState, useEffect } from "react"
import { Heart, ExternalLink, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"

const GitHubUserGrid = ({ searchQuery }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalResults, setTotalResults] = useState(0)

  const phoneNumber = localStorage.getItem("phoneNumber")

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers()
    } else {
      setUsers([])
    }
  }, [searchQuery, currentPage, perPage])

  const searchUsers = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `http://localhost:8080/searchGithubUsers?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&per_page=${perPage}&phone_number=${phoneNumber}`,
      )

      if (response.ok) {
        const data = await response.json()

        // Fetch additional details for each user
        const usersWithDetails = await Promise.all(
          data.map(async (user) => {
            try {
              const detailResponse = await fetch(`http://localhost:8080/findGithubUserProfile?q=${user.login}`)
              if (detailResponse.ok) {
                const details = await detailResponse.json()
                return { ...user, ...details }
              }
            } catch {
              console.error("Failed to fetch user details")
            }
            return user
          }),
        )

        setUsers(usersWithDetails)
        setTotalResults(1000) // GitHub API limit
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to search users")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (githubUserId) => {
    try {
      const response = await fetch("http://localhost:8080/likeGithubUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, githubUserId }),
      })

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === githubUserId ? { ...user, isLike: !user.isLike } : user)),
        )
      }
    } catch (err) {
      console.error("Failed to like/unlike user:", err)
    }
  }

  const totalPages = Math.ceil(totalResults / perPage)

  if (!searchQuery.trim()) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Start typing to search GitHub users...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Info and Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-gray-600">
          Showing {users.length} results for "{searchQuery}"
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <img src={user.avatar_url || "/placeholder.svg"} alt={user.login} className="w-16 h-16 rounded-full" />
              <button
                onClick={() => handleLike(user.id)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  user.isLike
                    ? "text-red-500 bg-red-100 hover:bg-red-200"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart className={`h-5 w-5 transition-transform duration-200 ${user.isLike ? "fill-current" : ""}`} />
              </button>
            </div>

            <h3 className="font-semibold text-lg text-gray-900 mb-2">{user.login}</h3>
            <p className="text-gray-600 text-sm mb-4">ID: {user.id}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No users found for "{searchQuery}"</div>
        </div>
      )}
    </div>
  )
}

export default GitHubUserGrid
