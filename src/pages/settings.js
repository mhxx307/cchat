import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BsPencil } from 'react-icons/bs'; // Importing Pencil icon from react-icons
import userService from '../services/userService';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

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
                profilePic: avatar,
                email: userVerified.email,
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
                    className={`w-full rounded-lg bg-blue-500 py-3 font-semibold text-white transition duration-300 hover:bg-blue-600 ${
                        loading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                    {loading ? (
                        // Show spinner when loading
                        <Loading />
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </form>
        </div>
    );
}

export default Settings;
