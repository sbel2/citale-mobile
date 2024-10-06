'use client';

import { useState } from 'react';
import { signUpUser } from 'app/actions/auth';  // Call the auth action

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);  // Track success state

  const handleSignUp = async () => {
    // Reset error and success states before handling sign-up
    setError(null);
    setSuccess(false);

    try {
      await signUpUser({ email, password });
      setSuccess(true);  // Set success to true when sign-up is completed
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

      {/* Display success message if sign-up is successful */}
      {success && (
        <p className="text-green-600 text-sm mb-4">Sign-up successful! Please check your email to confirm your account.</p>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Display error message if passwords don't match */}
        {password !== confirmPassword && confirmPassword.length > 0 && (
          <p className="text-red-600 text-sm">Passwords do not match</p>
        )}

        {/* Sign-up button */}
        <button
          onClick={handleSignUp}
          disabled={password !== confirmPassword}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md ${
            password !== confirmPassword ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200`}
        >
          Sign Up
        </button>

        {/* Display error message if sign-up fails */}
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default SignUpForm;
