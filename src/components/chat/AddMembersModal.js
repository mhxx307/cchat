import { useState, useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';
import useDebounce from '~/hooks/useDebounce';
import userService from '~/services/userService';

const AddMembersModal = () => {
    const { userVerified } = useAuth();
    const [searchTermUser, setSearchTermUser] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const searchTermUserDebounce = useDebounce(searchTermUser, 500);

    useEffect(() => {
        // Fetch users when searchTermUser changes
        const fetchUsers = async () => {
            if (searchTermUserDebounce.trim() !== '') {
                try {
                    const result = await userService.getUsersBySearchTerms(
                        searchTermUserDebounce,
                    );
                    // Remove the current user from the search results
                    const filteredResult = result.filter(
                        (user) => user._id !== userVerified._id,
                    );
                    setSearchResults(filteredResult);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            } else {
                setSearchResults([]);
            }
        };

        fetchUsers();
    }, [searchTermUserDebounce, userVerified._id]);

    const handleAddMember = (member) => {
        setSelectedMembers([...selectedMembers, member]);
        // Clear the search input
        setSearchTermUser('');
    };

    const handleRemoveMember = (member) => {
        setSelectedMembers(
            selectedMembers.filter((selected) => selected.id !== member.id),
        );
    };

    return (
        <div className="items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-4">
                <input
                    type="text"
                    placeholder="Search members"
                    className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2"
                    value={searchTermUser}
                    onChange={(e) => setSearchTermUser(e.target.value)}
                />
                <div className="mb-4 max-h-48 overflow-y-auto">
                    {searchResults.map((user) => (
                        <div
                            key={user._id}
                            className="flex cursor-pointer items-center justify-between px-2 py-2 hover:bg-gray-100"
                            onClick={() => handleAddMember(user)}
                        >
                            <span>{user.username}</span>
                            <span>+</span>
                        </div>
                    ))}
                </div>
                <div className="mb-4">
                    <h2>Selected Members:</h2>
                    {selectedMembers.map((member) => (
                        <div
                            key={member._id}
                            className="mb-2 flex items-center justify-between rounded-lg bg-gray-100 px-2 py-2"
                        >
                            <span>{member.username}</span>
                            <button
                                onClick={() => handleRemoveMember(member)}
                                className="text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white"
                    onClick={() => console.log(selectedMembers)}
                >
                    Add Members
                </button>
            </div>
        </div>
    );
};

export default AddMembersModal;
