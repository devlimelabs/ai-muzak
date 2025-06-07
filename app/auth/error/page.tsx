'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error === 'Configuration' && 'There is a problem with the server configuration.'}
            {error === 'AccessDenied' && 'You do not have permission to sign in.'}
            {error === 'Verification' && 'The verification token has expired or has already been used.'}
            {!['Configuration', 'AccessDenied', 'Verification'].includes(error || '') && 'An error occurred during authentication.'}
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}