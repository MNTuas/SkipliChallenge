import { useState } from "react"
import { Shield, ArrowLeft } from "lucide-react"

const AccessCodeVerification = ({ phoneNumber, onCodeVerified, onBack }) => {
  const [accessCode, setAccessCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!accessCode.trim()) {
      setError("Please enter the access code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/ValidateAccessCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, accessCode }),
      })

      const data = await response.json()

      if (response.ok) {
        onCodeVerified()
      } else {
        setError(data.error || "Invalid access code")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Enter Access Code</h1>
            <p className="text-gray-600 mt-2">
              We sent a 6-digit code to <span className="font-medium">{phoneNumber}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Access Code
              </label>
              <input
                type="text"
                id="code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength={6}
                disabled={loading}
              />
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AccessCodeVerification
