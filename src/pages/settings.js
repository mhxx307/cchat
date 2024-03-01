import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BsPencil } from 'react-icons/bs'; // Importing Pencil icon from react-icons
import userService from '../services/userService';
import { toast } from 'react-toastify';

function Settings() {
    const { userVerified, setUserVerified } = useAuth();
    const [username, setUsername] = useState(userVerified.username);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
        userVerified.profilePic || '',
    );
    const [loading, setLoading] = useState(false);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file size is within the limit
            if (file.size <= MAX_FILE_SIZE) {
                setAvatar(file);
                setAvatarPreview(URL.createObjectURL(file));
            } else {
                // File size exceeds the limit, show an error message or take appropriate action
                alert('File size exceeds the limit of 2MB');
                // Optionally, you can clear the file input
                e.target.value = null;
            }
        }
    };

    const handleSaveAvatar = async () => {
        // Implement logic to save avatar
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault(); // Prevent form submission
        // Implement logic to save changes
        console.log('Changes saved:', { username, avatar });
        setLoading(true); // Set loading to true when saving changes
        try {
            // Implement logic to save changes
            await userService.updateUserById(userVerified._id, {
                username,
            });
        } catch (error) {
            console.error('Error occurred while saving changes:', error);
            // Handle error
            toast.error('Error occurred while saving changes');
        } finally {
            const updatedUser = { ...userVerified, username };
            setUserVerified(updatedUser);
            setLoading(false); // Set loading to false when save process completes
            toast.success('Profile updated successfully');
        }
    };

    return (
        <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md">
            <h1 className="mb-6 text-3xl font-semibold">Profile</h1>

            <div className="mb-4">
                <label
                    className="mb-2 block text-sm font-medium text-gray-700"
                    htmlFor="avatar"
                >
                    Avatar
                </label>
                <div className={'flex'}>
                    <label
                        htmlFor="avatar"
                        className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-gray-300 transition duration-300 hover:bg-gray-400"
                    >
                        <div className="flex items-center">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar Preview"
                                    className="mr-2 h-full w-full"
                                />
                            ) : (
                                // use dicebear avatars as fallback
                                <img
                                    src={`https://avatars.dicebear.com/api/avataaars/${username}.svg`}
                                    alt="Avatar Preview"
                                    className="mr-2 h-full w-full"
                                />
                            )}
                        </div>

                        <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />

                        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-gray-200 opacity-0 transition duration-300 hover:opacity-50">
                            <button
                                type="button"
                                onClick={() => {
                                    setAvatar(null);
                                    setAvatarPreview(
                                        userVerified.profilePic || '',
                                    );
                                }}
                            >
                                <BsPencil
                                    className="text-gray-800 transition duration-300 hover:text-gray-600"
                                    size={20}
                                    title="Edit Avatar"
                                />
                            </button>
                        </div>
                    </label>

                    {/* save & cancel */}
                    {avatar && (
                        <div className="mt-2 flex items-center justify-center">
                            <button
                                onClick={handleSaveAvatar}
                                className="mx-2 text-xs text-blue-500 hover:underline focus:outline-none"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => {
                                    setAvatar(null);
                                    setAvatarPreview(
                                        userVerified.profilePic || '',
                                    );
                                }}
                                className="text-xs text-red-500 hover:underline focus:outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <p className="mt-2 text-xs text-gray-500">
                    JPG, JPEG, PNG, GIF. Max size of 2MB
                </p>
            </div>

            <form onSubmit={handleSaveChanges}>
                {/* Profile Settings */}
                <div className="mb-8">
                    <div className="mb-4">
                        <label
                            className="mb-2 block text-sm font-medium text-gray-700"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your username"
                        />
                    </div>
                </div>

                {/* Save Changes Button */}
                <button
                    type={loading ? 'button' : 'submit'}
                    className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white transition duration-300 hover:bg-blue-600"
                >
                    {loading ? (
                        // Show spinner when loading
                        <svg
                            aria-hidden="true"
                            class="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </form>
        </div>
    );
}

export default Settings;
