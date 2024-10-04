import { Link } from 'react-router-dom';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { HiSun, HiMoon, HiBell } from 'react-icons/hi';
import { FaUserFriends } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';
import { useTheme } from '../hooks/useTheme'; // Import useTheme
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import notificationService from '~/services/notificationService';
import socket from '~/configs/socket';
import userService from '~/services/userService';
import Modal from 'react-responsive-modal';
import { useTranslation } from 'react-i18next';

function ChatHeader() {
    const { isDarkMode, toggleDarkMode, themeStyles } = useTheme(); // Access theme styles
    const { setUserVerified, userVerified } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [openNotification, setOpenNotification] = useState(false);
    const [openFriendList, setOpenFriendList] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [friendId, setFriendId] = useState(null);

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const openModal = () => {
        setIsDeleteModalOpen(true);
    };

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await notificationService.getNotifications(
                userVerified._id,
            );
            if (response) {
                setNotifications(response);
            }
        };

        if (userVerified) {
            fetchNotifications();
        }
    }, [userVerified]);

    // Socket listeners
    useEffect(() => {
        socket.on('received-friend-request', async (response) => {
            const updatedUser = await userService.getUserById(userVerified._id);
            setUserVerified(updatedUser);
        });

        socket.on('accepted-friend-request', async (response) => {
            const updatedUser = await userService.getUserById(userVerified._id);
            setUserVerified(updatedUser);
        });

        socket.on('unfriended', async (response) => {
            const updatedUser = await userService.getUserById(userVerified._id);
            setUserVerified(updatedUser);
        });

        return () => {
            socket.off('received-friend-request');
            socket.off('accepted-friend-request');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const handleLogout = () => {
        setUserVerified(null);
    };

    const handleOpenNotification = () => {
        setOpenNotification(!openNotification);
    };

    const handleAcceptFriendRequest = async (requester) => {
        try {
            const response = await userService.acceptFriendRequest({
                requesterId: requester._id,
                userId: userVerified._id,
            });

            const userUpdated = await userService.getUserById(userVerified._id);
            setUserVerified(userUpdated);

            socket.emit('accept-friend-request', response);
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectFriendRequest = async (requester) => {
        try {
            const response = await userService.rejectedFriendRequest({
                requesterId: requester._id,
                userId: userVerified._id,
            });

            const userUpdated = await userService.getUserById(userVerified._id);
            setUserVerified(userUpdated);

            socket.emit('accept-friend-request', response);
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const handleUnfriend = async () => {
        try {
            if (!friendId) return;

            const response = await userService.unfriend({
                userId: userVerified._id,
                friendId: friendId,
            });

            const userUpdated = await userService.getUserById(userVerified._id);
            setUserVerified(userUpdated);

            socket.emit('unfriend', response);
        } catch (error) {
            console.error('Error unfriending:', error);
        } finally {
            setIsDeleteModalOpen(false);
            setFriendId(null);
        }
    };

    return (
        <header
            className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 shadow-md`}
            style={{
                backgroundColor: themeStyles.background,
                color: themeStyles.text,
            }} // Apply theme styles
        >
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    <Link to="/">{t('title')}</Link>
                </h1>
                <nav>
                    <ul className="flex items-center space-x-6">
                        <button
                            type="button"
                            onClick={() => changeLanguage('vi')}
                            className="text-lg hover:text-blue-500"
                        >
                            vi
                        </button>
                        <button
                            type="button"
                            onClick={() => changeLanguage('en')}
                            className="text-lg hover:text-blue-500"
                        >
                            en
                        </button>

                        <li className="cursor-pointer" onClick={toggleDarkMode}>
                            {isDarkMode ? (
                                <HiSun className="inline-block" size={24} />
                            ) : (
                                <HiMoon className="inline-block" size={24} />
                            )}
                        </li>

                        <li className="cursor-pointer">
                            <Link to="/settings">
                                <CiSettings size={24} />
                            </Link>
                        </li>

                        <li className="relative">
                            <span
                                onClick={handleOpenNotification}
                                className="cursor-pointer"
                            >
                                <HiBell size={24} />
                                {notifications.length > 0 && (
                                    <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white">
                                        {notifications.length}
                                    </span>
                                )}
                            </span>
                            {openNotification && (
                                <div
                                    className={`absolute right-0 top-12 w-80 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} max-h-96 overflow-y-auto border border-gray-300 p-4 shadow-lg`}
                                >
                                    <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
                                        {t('notifications')}
                                    </h2>
                                    <ul>
                                        {notifications.map((notification) => (
                                            <li
                                                key={notification._id}
                                                className="mb-2 cursor-pointer rounded p-2 hover:bg-gray-200 hover:text-blue-500"
                                            >
                                                <p>{notification.message}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Friend list and friend request list */}
                        <li className="relative">
                            <span
                                className="cursor-pointer"
                                onClick={() =>
                                    setOpenFriendList(!openFriendList)
                                }
                            >
                                <FaUserFriends size={24} />
                                {userVerified.friendRequestsReceived.length >
                                    0 && (
                                    <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white">
                                        {
                                            userVerified.friendRequestsReceived
                                                .length
                                        }
                                    </span>
                                )}
                            </span>
                            {openFriendList && (
                                <div
                                    className={`absolute right-0 top-12 w-80 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border border-gray-300 p-4 shadow-lg`}
                                >
                                    <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
                                        {t('friend_requests')}
                                    </h2>
                                    <ul>
                                        {userVerified.friendRequestsReceived.map(
                                            (request) => (
                                                <li
                                                    key={request._id}
                                                    className="mb-2 flex items-center justify-between rounded p-2 hover:bg-gray-200 hover:text-blue-500"
                                                >
                                                    <p>{request.username}</p>
                                                    <div className="space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleAcceptFriendRequest(
                                                                    request,
                                                                )
                                                            }
                                                            className="rounded-md bg-green-500 px-2 py-1 text-white duration-75 hover:bg-green-600"
                                                        >
                                                            {t('accept')}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleRejectFriendRequest(
                                                                    request,
                                                                )
                                                            }
                                                            className="rounded-md bg-red-500 px-2 py-1 text-white duration-75 hover:bg-red-600"
                                                        >
                                                            {t('reject')}
                                                        </button>
                                                    </div>
                                                </li>
                                            ),
                                        )}
                                    </ul>

                                    <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
                                        {t('friends')}
                                    </h2>
                                    <ul>
                                        {userVerified.friends.map((friend) => (
                                            <li
                                                key={friend._id}
                                                className="mb-2 flex items-center justify-between rounded p-2 hover:bg-gray-200 hover:text-blue-500"
                                            >
                                                <p>{friend.username}</p>
                                                <button
                                                    onClick={() => {
                                                        openModal();
                                                        setFriendId(friend._id);
                                                    }}
                                                    className="rounded-md bg-red-500 px-2 py-1 text-white duration-75 hover:bg-red-600"
                                                >
                                                    {t('unfriend')}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>

                        <li className="cursor-pointer" onClick={handleLogout}>
                            <RiLogoutBoxRLine
                                className="inline-block"
                                size={24}
                            />
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Modal confirm delete */}
            <Modal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                center
            >
                <div className="p-4">
                    <h2>{t('remove_person_confirmation')}</h2>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="rounded-md bg-gray-300 p-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleUnfriend()}
                            className="rounded-md bg-red-500 p-2 text-white"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </header>
    );
}

export default ChatHeader;
