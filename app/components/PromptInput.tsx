'use client'

import { useState } from 'react'

interface PromptInputProps {
  onSubmit: (prompt: string) => void
  isLoading?: boolean
}

const moodExamples = [
  "I just got a promotion and want to celebrate!",
  "Need focus music for deep work",
  "Feeling nostalgic about college days",
  "Going through a breakup",
  "Getting pumped for my workout",
  "Relaxing after a long week"
]

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedExample, setSelectedExample] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt)
      setPrompt('')
      setSelectedExample(null)
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
    setSelectedExample(example)
  }

  const characterLimit = 500
  const characterCount = prompt.length
  const isNearLimit = characterCount > characterLimit * 0.8

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="card p-6">
            <label htmlFor="mood-input" className="block text-sm font-medium text-gray-300 mb-3">
              What's your vibe? Tell us how you're feeling
            </label>
            
            <div className="relative">
              <textarea
                id="mood-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="I'm feeling energetic and ready to conquer the world..."
                className="w-full px-6 py-4 bg-muzak-warm-gray/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all duration-200 resize-none text-body-lg leading-relaxed"
                rows={4}
                disabled={isLoading}
                maxLength={characterLimit}
              />
              
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <div className={`text-xs transition-colors ${
                  isNearLimit ? 'text-muzak-coral' : 'text-gray-500'
                }`}>
                  {characterCount}/{characterLimit}
                </div>
                
                <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading || characterCount > characterLimit}
                  className="btn-primary disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2 text-sm px-5 py-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Generate Playlist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Example prompts */}
        <div className="space-y-3">
          <p className="text-sm text-gray-400 font-medium">
            Need inspiration? Try one of these:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {moodExamples.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className={`text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 border ${
                  selectedExample === example
                    ? 'bg-spotify-green/10 border-spotify-green/50 text-spotify-green'
                    : 'bg-muzak-warm-gray/30 border-gray-700/50 text-gray-300 hover:bg-muzak-warm-gray/50 hover:border-gray-600/50 hover:text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="inline-block mr-2 opacity-60">💭</span>
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* AI assistance hint */}
      <div className="mt-6 flex items-start gap-3 p-4 bg-muzak-electric-blue/5 border border-muzak-electric-blue/20 rounded-xl">
        <div className="w-6 h-6 bg-muzak-electric-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-muzak-electric-blue" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="font-medium text-white">Pro tip:</span> The more specific you are about your mood, situation, or activity, the better we can tailor your playlist. Include details like your energy level, time of day, or what you're doing.
          </p>
        </div>
      </div>
    </div>
  )
}