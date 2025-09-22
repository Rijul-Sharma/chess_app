'use client'

import { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'
import { getLeaderboard } from '../../lib/lichess-api'

export default function LeaderboardsPage() {
  const [selectedVariant, setSelectedVariant] = useState('rapid')
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const variants = [
    { key: 'rapid', label: 'Rapid' },
    { key: 'bullet', label: 'Bullet' },
    { key: 'blitz', label: 'Blitz' },
    { key: 'classical', label: 'Classical' }
  ]

  const fetchLeaderboard = async (perfType) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getLeaderboard(perfType, 50) // Get top 50 players
      setLeaderboardData(data.users || [])
    } catch (err) {
      setError('Failed to fetch leaderboard data. Please try again.')
      console.error('Leaderboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard(selectedVariant)
  }, [selectedVariant])

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant)
  }

  const handleRefresh = () => {
    fetchLeaderboard(selectedVariant)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-4xl font-bold mb-8">Leaderboards</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Time Control</h2>
          <div className="flex gap-2 flex-wrap">
            {variants.map((variant) => (
              <button
                key={variant.key}
                onClick={() => handleVariantChange(variant.key)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedVariant === variant.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {variant.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-lg">Loading leaderboard...</span>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
              <h3 className="text-lg font-semibold capitalize">
                🏆 Top {selectedVariant} Players
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Games
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {leaderboardData.length > 0 ? (
                    leaderboardData.map((player, index) => {
                      const rank = index + 1
                      const perf = player.perfs?.[selectedVariant]
                      
                      // Get rank color based on position
                      const getRankColor = (rank) => {
                        if (rank === 1) return 'text-yellow-400 font-bold'
                        if (rank === 2) return 'text-gray-300 font-bold'
                        if (rank === 3) return 'text-amber-600 font-bold'
                        if (rank <= 10) return 'text-blue-400 font-semibold'
                        return 'text-gray-400'
                      }
                      
                      // Get rating color based on value
                      const getRatingColor = (rating) => {
                        if (rating >= 2700) return 'text-purple-400'
                        if (rating >= 2500) return 'text-pink-400'
                        if (rating >= 2400) return 'text-red-400'
                        if (rating >= 2300) return 'text-orange-400'
                        if (rating >= 2200) return 'text-yellow-400'
                        if (rating >= 2100) return 'text-green-400'
                        return 'text-blue-400'
                      }
                      
                      return (
                        <tr key={player.id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`text-lg ${getRankColor(rank)}`}>
                                #{rank}
                              </span>
                              {rank <= 3 && (
                                <span className="text-lg">
                                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                                </span>
                              )}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://lichess1.org/user/${player.username}/avatar/32`}
                                alt={`${player.username}'s avatar`}
                                className="w-8 h-8 rounded-full bg-gray-600"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextElementSibling.style.display = 'flex'
                                }}
                              />
                              <div 
                                className="w-8 h-8 rounded-full bg-gray-600 hidden items-center justify-center text-xs font-bold"
                              >
                                {player.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{player.username}</div>
                                {player.online && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                                    Online
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {player.title ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-600 text-black">
                                {player.title}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-lg font-bold ${getRatingColor(perf?.rating)}`}>
                              {perf?.rating || '-'}
                            </div>
                            {perf?.rd && (
                              <div className="text-xs text-gray-500">±{Math.round(perf.rd)}</div>
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {perf?.games || '-'}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {perf?.prog !== undefined ? (
                              <span className={`font-medium ${perf.prog >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {perf.prog >= 0 ? '+' : ''}{perf.prog}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    !loading && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                          <div className="text-4xl mb-2">📊</div>
                          <p>No leaderboard data available</p>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            
            {leaderboardData.length > 0 && (
              <div className="bg-gray-700 px-6 py-4 border-t border-gray-600">
                <p className="text-sm text-gray-400 text-center">
                  Showing top {leaderboardData.length} players in {selectedVariant}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}