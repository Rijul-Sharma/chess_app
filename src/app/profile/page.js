'use client'

import { useState } from 'react'
import { getUserProfile } from '../../lib/lichess-api'
import BackButton from '../components/BackButton'

export default function ProfilePage() {
  const [username, setUsername] = useState('')
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!username.trim()) return
    
    setLoading(true)
    setError(null)
    setUserProfile(null)
    
    try {
      const profile = await getUserProfile(username.trim())
      setUserProfile(profile)
    } catch (err) {
      setError('User not found or API error. Please check the username and try again.')
      console.error('Profile fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Player Profile</h1>
        
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Search Player</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Lichess username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              disabled={loading}
            />
            <button 
              onClick={handleSearch}
              disabled={loading || !username.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors w-full sm:w-auto"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded text-red-200">
              {error}
            </div>
          )}
        </div>

        {userProfile && (
          <div className="space-y-6">
            {/* User Basic Info */}
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <img
                    src={`https://lichess1.org/user/${userProfile.username}/avatar/120`}
                    alt={`${userProfile.username}'s avatar`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-700 border-2 border-gray-600"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-700 border-2 border-gray-600 hidden items-center justify-center text-xl sm:text-2xl font-bold text-gray-400"
                  >
                    {userProfile.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                    <h3 className="text-2xl sm:text-3xl font-bold break-words">{userProfile.username}</h3>
                    {userProfile.title && (
                      <span className="px-3 py-1 bg-yellow-600 text-black text-sm font-bold rounded">
                        {userProfile.title}
                      </span>
                    )}
                    {userProfile.patron && (
                      <span className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded">
                        PATRON
                      </span>
                    )}
                    {userProfile.online && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        ONLINE
                      </span>
                    )}
                  </div>
                  
                  {userProfile.profile?.bio && (
                    <p className="text-gray-300 mb-4 text-base sm:text-lg break-words">{userProfile.profile.bio}</p>
                  )}
                </div>
              </div>
              
              {/* User Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{userProfile.count?.all || 0}</div>
                  <div className="text-sm text-gray-400">Total Games</div>
                </div>
                
                {userProfile.count?.win !== undefined && (
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{userProfile.count.win}</div>
                    <div className="text-sm text-gray-400">Games Won</div>
                  </div>
                )}
                
                {userProfile.count?.draw !== undefined && (
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{userProfile.count.draw}</div>
                    <div className="text-sm text-gray-400">Draws</div>
                  </div>
                )}
                
                {userProfile.count?.loss !== undefined && (
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">{userProfile.count.loss}</div>
                    <div className="text-sm text-gray-400">Games Lost</div>
                  </div>
                )}
                
                {userProfile.createdAt && (
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-purple-400">
                      {new Date(userProfile.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-400">Member Since</div>
                  </div>
                )}
                
                {userProfile.seenAt && (
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-indigo-400">
                      {new Date(userProfile.seenAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-400">Last Seen</div>
                  </div>
                )}
                
                {userProfile.playTime && (
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {Math.floor(userProfile.playTime.total / 3600)}h
                    </div>
                    <div className="text-sm text-gray-400">Play Time</div>
                  </div>
                )}
                
                {userProfile.followable !== undefined && (
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {userProfile.nbFollowing || 0}
                    </div>
                    <div className="text-sm text-gray-400">Following</div>
                  </div>
                )}
              </div>
            </div>

            {/* Ratings */}
            {userProfile.perfs && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span>🏆</span>
                  Ratings & Performance
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Object.entries(userProfile.perfs)
                    .filter(([key, perf]) => perf.games > 0) // Only show categories with games played
                    .map(([key, perf]) => {
                      const formatKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
                      
                      // Get rating color based on rating value
                      const getRatingColor = (rating) => {
                        if (rating >= 2400) return 'text-purple-400'
                        if (rating >= 2200) return 'text-pink-400'
                        if (rating >= 2000) return 'text-red-400'
                        if (rating >= 1800) return 'text-orange-400'
                        if (rating >= 1600) return 'text-yellow-400'
                        if (rating >= 1400) return 'text-green-400'
                        if (rating >= 1200) return 'text-blue-400'
                        return 'text-gray-400'
                      }
                      
                      const winRate = perf.games > 0 ? ((perf.games - (userProfile.count?.loss || 0)) / perf.games * 100) : 0
                      
                      return (
                        <div key={key} className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                          <div className="text-center">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">{formatKey}</h4>
                            <div className={`text-3xl font-bold mb-2 ${getRatingColor(perf.rating)}`}>
                              {perf.rating || '-'}
                            </div>
                            
                            {perf.rd && (
                              <div className="text-xs text-gray-500 mb-2">
                                ±{Math.round(perf.rd)}
                              </div>
                            )}
                            
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Games:</span>
                                <span className="font-medium">{perf.games}</span>
                              </div>
                              
                              {perf.prog !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Progress:</span>
                                  <span className={`font-medium ${perf.prog >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {perf.prog >= 0 ? '+' : ''}{perf.prog}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Progress bar for games played */}
                            <div className="mt-3 w-full bg-gray-600 rounded-full h-1.5">
                              <div 
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min((perf.games / 100) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
                
                {Object.keys(userProfile.perfs).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">🎯</div>
                    <p>No rated games played yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!userProfile && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-400">Enter a Lichess username to view profile</p>
          </div>
        )}
      </div>
    </div>
  )
}