"use client"

import { useState, useEffect } from "react"
import { Phone, Shield, Copy, Check } from "lucide-react"

const PhoneVerification = ({ onPhoneSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [receivedAccessCode, setReceivedAccessCode] = useState("") // Access code từ API
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copied, setCopied] = useState(false)

  // Load data từ localStorage khi component mount
  useEffect(() => {
    const savedAccessCode = localStorage.getItem("accessCode")
    const savedPhoneNumber = localStorage.getItem("phoneNumber")

    if (savedAccessCode) {
      setReceivedAccessCode(savedAccessCode)
    }

    if (savedPhoneNumber) {
      setPhoneNumber(savedPhoneNumber)
    }
  }, [])

  const handleCopyAccessCode = async () => {
    try {
      await navigator.clipboard.writeText(receivedAccessCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!phoneNumber.trim()) {
      setError("Please enter a phone number")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (accessCode.trim()) {
        // Validate access code
        const response = await fetch("http://localhost:8080/ValidateAccessCode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber, accessCode }),
        })

        const data = await response.json()

        if (response.ok) {
          setSuccess("Access code validated successfully!")

          
          localStorage.removeItem("accessCode")

          localStorage.setItem("phoneNumber", phoneNumber)

          // Clear state
          setReceivedAccessCode("")
          setAccessCode("")

          
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 1000) 

          if (onPhoneSubmit) {
            onPhoneSubmit(phoneNumber)
          }
        } else {
          setError(data.error || "Invalid access code")
        }
      } else {
        // Tạo access code mới
        const response = await fetch("http://localhost:8080/CreateNewAccessCode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber }),
        })

        const data = await response.json()

        if (response.ok) {
          
          setReceivedAccessCode(data.accessCode)
          localStorage.setItem("accessCode", data.accessCode)

          setSuccess("Access code sent successfully! Please check your phone.")
        } else {
          setError(data.error || "Failed to send access code")
        }
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {accessCode.trim() ? (
                <Shield className="w-8 h-8 text-green-600" />
              ) : (
                <Phone className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {accessCode.trim() ? "Verify Access Code" : "Phone Verification"}
            </h1>
            <p className="text-gray-600 mt-2">
              {accessCode.trim()
                ? "Enter your access code to verify"
                : "Enter your phone number to receive an access code"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                Access Code (Optional)
              </label>
              <input
                type="text"
                id="accessCode"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength={6}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to request a new access code</p>
            </div>

           
            {receivedAccessCode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-blue-900">Your Access Code</h3>

                    </div>
                    <p className="text-2xl font-mono font-bold text-blue-700 tracking-widest">{receivedAccessCode}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccessCode}
                    className="ml-3 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                    title="Copy access code"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  {localStorage.getItem("accessCode")
                    ? "Restored from previous session"
                    : "Access code saved to your device"}
                  . I show this code to show in case the sms do not arrive on time for testing.
                </p>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>
            )}

            {success && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                {success}
                {success.includes("validated") && <div className="mt-2 text-xs">Redirecting to dashboard...</div>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                accessCode.trim()
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {loading
                ? accessCode.trim()
                  ? "Verifying..."
                  : "Sending..."
                : accessCode.trim()
                  ? "Verify Code"
                  : "Send Access Code"}
            </button>

           
            {receivedAccessCode && !accessCode.trim() && (
              <button
                type="button"
                onClick={() => setAccessCode(receivedAccessCode)}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Use {localStorage.getItem("accessCode") ? "Saved" : "Generated"} Access Code
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default PhoneVerification
