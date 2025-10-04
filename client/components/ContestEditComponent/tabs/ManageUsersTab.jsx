"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ButtonComponent/Button";
import { MdAdd, MdDelete, MdSearch, MdPersonAdd } from "react-icons/md";
import userModule from "@/api/user/user";

export default function ManageUsersTab({
  contestData,
  setContestData,
  showNotification,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    room_no: "",
    pc_no: "",
    allowed_contest: contestData.contest.id,
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch contest users on component mount
  useEffect(() => {
    fetchContestUsers();
  }, [contestData.contest.id]);

  const fetchContestUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await userModule.getContestUsers(
        contestData.contest.id
      );

      if (error) {
        showNotification(error, "error");
      } else if (data) {
        // Map the API response to match our component's expected format
        const mappedUsers = Array.isArray(data)
          ? data.map((user) => ({
              id: user.userId,
              username: user.username,
              full_name: user.full_name,
            }))
          : [];
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !newUser.full_name.trim() ||
      !newUser.username.trim() ||
      !newUser.email.trim() ||
      !newUser.password.trim()
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      setLoading(true);

      // Prepare user data
      const userData = {
        full_name: newUser.full_name,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        room_no: newUser.room_no || null,
        pc_no: newUser.pc_no ? parseInt(newUser.pc_no) : null,
        allowed_contest: contestData.contest.id,
      };

      const { data, error } = await userModule.Register(userData);

      if (error) {
        showNotification(error, "error");
      } else if (data) {
        // Reset form
        setNewUser({
          full_name: "",
          username: "",
          email: "",
          password: "",
          room_no: "",
          pc_no: "",
          allowed_contest: contestData.contest.id,
        });
        setShowAddUser(false);
        showNotification("User registered successfully!", "success");

        // Refresh users list
        await fetchContestUsers();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      showNotification("Failed to register user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      setLoading(true);

      // TODO: Implement remove user API call when available
      // For now, just remove from local state
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      showNotification("User removed successfully!", "success");
    } catch (error) {
      console.error("Error removing user:", error);
      showNotification("Failed to remove user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name &&
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white border-b pb-2 border-zinc-700">
        Manage Contest Users
      </h2>

      {/* Add User Section */}
      <div className="bg-zinc-700/30 rounded-lg p-6 border border-zinc-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Register Users</h3>
          <Button
            name="Add User"
            icon={<MdAdd />}
            onClick={() => setShowAddUser(!showAddUser)}
            disabled={loading}
          />
        </div>

        {showAddUser && (
          <form
            onSubmit={handleAddUser}
            className="space-y-4 border-t border-zinc-600 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={newUser.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter full name"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter username"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter email address"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter password"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="room_no"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Room No (Optional)
                </label>
                <input
                  type="text"
                  id="room_no"
                  name="room_no"
                  value={newUser.room_no}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter room number"
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="pc_no"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  PC No (Optional)
                </label>
                <input
                  type="number"
                  id="pc_no"
                  name="pc_no"
                  value={newUser.pc_no}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter PC number"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-500 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                name={loading ? "Registering..." : "Register User"}
                type="submit"
                disabled={loading}
              />
            </div>
          </form>
        )}
      </div>

      {/* Users List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">
            Registered Users ({users.length})
          </h3>

          {/* Search */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <MdSearch className="absolute left-3 top-2.5 text-zinc-400" />
          </div>
        </div>

        {loading && !showAddUser ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-zinc-300">Loading users...</span>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="bg-zinc-800/70 rounded-lg overflow-hidden shadow-lg border border-zinc-700/50">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-zinc-800/30 divide-y divide-zinc-700/50">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id || `user-${index}`}
                    className="hover:bg-zinc-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {(user.full_name || user.username)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-zinc-100">
                            {user.full_name || user.username}
                          </div>
                          <div className="text-xs text-zinc-400">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-100">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                        disabled={loading}
                      >
                        <MdDelete />
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-center">
            <MdPersonAdd className="mx-auto h-12 w-12 text-zinc-400" />
            <h3 className="mt-2 text-sm font-medium text-zinc-300">
              No users found
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {searchTerm
                ? "No users match your search."
                : "No users registered for this contest yet."}
            </p>
            {!searchTerm && (
              <div className="mt-4">
                <Button
                  name="Register First User"
                  icon={<MdAdd />}
                  onClick={() => setShowAddUser(true)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
