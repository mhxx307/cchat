import React, { useState } from 'react';
import userService from '../services/userService';
import { useAuth } from '~/hooks/useAuth';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const { userVerified } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') setCurrentPassword(value);
    else if (name === 'newPassword') setNewPassword(value);
    else if (name === 'confirmNewPassword') setConfirmNewPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all fields');
    } else if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match');
    } else {
      try {
        // Call API to change password
        // You can get this from your authentication system
        const result = await userService.changePassword(userVerified._id, {
          oldPassword: currentPassword,
          newPassword: newPassword,
        });
        console.log(result); // You can handle success response here
        setError('');
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } catch (error) {
        // Handle error from API call
        setError('Error changing password');
        console.error(error);
      }
    }
    console.log('Change password', currentPassword, newPassword, confirmNewPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Change Password</h2>
        </div>
        <div  className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="currentPassword" className="sr-only">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Current Password"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="sr-only">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmNewPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm New Password"
              />
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div>
            <button onClick={handleSubmit}
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
