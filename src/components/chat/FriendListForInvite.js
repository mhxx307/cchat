import React from 'react';
import FallbackAvatar from '../shared/FallbackAvatar';

function FriendListForInvite({
    friendList,
    searchTermDebounce,
    searchResults,
    selectedUsers,
    toggleUserSelection,
    removeSelectedUser,
}) {
    return (
        <>
            {/* friend list or search result */}

            <h3>Friend list</h3>

            <div className="mb-4 min-h-40 overflow-y-auto">
                {searchTermDebounce.trim() === ''
                    ? friendList.map((user) => (
                          <div
                              key={user._id}
                              className="flex cursor-pointer items-center justify-between rounded-md bg-gray-100 px-4 py-2 hover:bg-gray-200"
                              onClick={() => toggleUserSelection(user)}
                          >
                              <div className="flex items-center">
                                  {user.profilePic ? (
                                      <img
                                          src={user.profilePic}
                                          alt={user.username}
                                          className="h-8 w-8 rounded-full"
                                      />
                                  ) : (
                                      <FallbackAvatar name={user.username} />
                                  )}

                                  <span className="ml-2">{user.username}</span>
                              </div>
                              {selectedUsers.some((u) => u._id === user._id) ? (
                                  <span className="text-blue-500">
                                      Selected
                                  </span>
                              ) : null}
                          </div>
                      ))
                    : searchResults.map((user) => (
                          <div
                              key={user._id}
                              className="flex cursor-pointer items-center justify-between rounded-md bg-gray-100 px-4 py-2 hover:bg-gray-200"
                              onClick={() => toggleUserSelection(user)}
                          >
                              <div className="flex items-center">
                                  {user.profilePic ? (
                                      <img
                                          src={user.profilePic}
                                          alt={user.username}
                                          className="h-8 w-8 rounded-full"
                                      />
                                  ) : (
                                      <FallbackAvatar name={user.username} />
                                  )}

                                  <span className="ml-2">{user.username}</span>
                              </div>
                              {selectedUsers.some((u) => u._id === user._id) ? (
                                  <span className="text-blue-500">
                                      Selected
                                  </span>
                              ) : null}
                          </div>
                      ))}
            </div>

            {/* Selected users */}
            <div className="mb-4">
                {selectedUsers.map((user) => (
                    <div
                        key={user._id}
                        className="mb-2 flex items-center justify-between rounded-md bg-blue-100 px-4 py-2"
                    >
                        <div className="flex items-center">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt={user.username}
                                    className="h-8 w-8 rounded-full"
                                />
                            ) : (
                                <FallbackAvatar name={user.username} />
                            )}

                            <span className="ml-2">{user.username}</span>
                        </div>
                        <button
                            className="text-red-500"
                            onClick={() => removeSelectedUser(user._id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default FriendListForInvite;
