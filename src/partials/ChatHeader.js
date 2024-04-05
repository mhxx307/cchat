import { Link } from 'react-router-dom';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { HiSun, HiMoon, HiBell } from 'react-icons/hi';
import { FaUserFriends } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import notificationService from '~/services/notificationService';
import socket from '~/configs/socket';
import userService from '~/services/userService';

function ChatHeader() {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { setUserVerified, userVerified } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [openNotification, setOpenNotification] = useState(false);
    const [openFriendList, setOpenFriendList] = useState(false);
    console.log('User verified:', userVerified);

    // console.log('Notifications:', notifications);

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

    // socket listen
    useEffect(() => {
        socket.on('received-friend-request', async (response) => {
            console.log('Received friend request:', response);
            const updatedUser = await userService.getUserById(userVerified._id);
            setUserVerified(updatedUser);
        });

        socket.on('accepted-friend-request', async (response) => {
            console.log('Accepted friend request:', response);
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
        console.log('Accept friend request');
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

    const handleRejectFriendRequest = () => {
        console.log('Reject friend request');
    };

    return (
        <header
            className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-4`}
        >
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    <Link to="/">Website Name</Link>
                </h1>
                <nav>
                    <ul className="flex items-center space-x-4">
                        <li className="cursor-pointer" onClick={toggleDarkMode}>
                            {isDarkMode ? (
                                <HiSun className="inline-block" size={24} />
                            ) : (
                                <HiMoon className="inline-block" size={24} />
                            )}
                        </li>

                        <li className="cursor-pointer">
                            <Link to="/settings/profile">
                                <CiSettings size={24} />
                            </Link>
                        </li>

                        <li>
                            <span
                                className="relative"
                                onClick={handleOpenNotification}
                            >
                                <HiBell size={24} />
                                {notifications?.length > 0 && (
                                    <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-white">
                                        {notifications?.length}
                                    </span>
                                )}
                            </span>
                            {openNotification && (
                                <div className="absolute right-0 top-12 w-80 rounded-lg bg-white p-4 shadow-lg">
                                    <h2 className="mb-4 text-xl font-semibold">
                                        Notifications
                                    </h2>
                                    <ul>
                                        {notifications.map((notification) => (
                                            <li
                                                key={notification._id}
                                                className="mb-2"
                                            >
                                                <p>{notification.message}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* friend list and friend request list */}
                        <li>
                            <span
                                className="relative"
                                onClick={() =>
                                    setOpenFriendList(!openFriendList)
                                }
                            >
                                <FaUserFriends size={24} />
                                {userVerified.friendRequestsReceived?.length >
                                    0 && (
                                    <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-white">
                                        {
                                            userVerified.friendRequestsReceived
                                                ?.length
                                        }
                                    </span>
                                )}

                                {openFriendList && (
                                    <div className="absolute right-0 top-12 w-80 rounded-lg bg-white p-4 shadow-lg">
                                        <h2 className="mb-4 text-xl font-semibold">
                                            Friend Requests
                                        </h2>
                                        <ul>
                                            {userVerified.friendRequestsReceived.map(
                                                (request) => (
                                                    <li
                                                        key={request._id}
                                                        className="mb-2 flex items-center justify-between"
                                                    >
                                                        <p>
                                                            {request.username}
                                                        </p>
                                                        <div className="space-x-4">
                                                            <button
                                                                onClick={() =>
                                                                    handleAcceptFriendRequest(
                                                                        request,
                                                                    )
                                                                }
                                                                className="mr-2 rounded-md bg-green-500 px-2 py-1 text-white  duration-75 hover:bg-green-600"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={
                                                                    handleRejectFriendRequest
                                                                }
                                                                className="rounded-md bg-red-500 px-2 py-1 text-white  duration-75 hover:bg-red-600"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </li>
                                                ),
                                            )}
                                        </ul>

                                        <h2 className="mb-4 text-xl font-semibold">
                                            Friends
                                        </h2>
                                        <ul>
                                            {userVerified.friends.map(
                                                (friend) => (
                                                    <li
                                                        key={friend._id}
                                                        className="mb-2"
                                                    >
                                                        <p>{friend.username}</p>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </span>
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
        </header>
    );
}

export default ChatHeader;
