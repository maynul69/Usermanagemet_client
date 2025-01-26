import { useEffect, useState } from "react";
import { FaTrash, FaUnlockKeyhole } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO, format } from "date-fns";


const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get("http://localhost:5000/users", {
          headers: { Authorization: token },
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users.");
      }
    };
    fetchUsers();
  }, []);

  // Handle checkbox selection
  const toggleUserSelection = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  // Log out the user and redirect to the login page
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token to log out
    navigate("/login"); // Redirect to the login page
  };

  // Update users and check if all are blocked or deleted
  const updateUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    const activeUsers = updatedUsers.filter((user) => user.status !== "blocked");
    if (activeUsers.length === 0) {
      handleLogout();
    }
  };

  // Block selected users
  const blockUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/users/block",
        { ids: selectedUserIds },
        { headers: { Authorization: token } }
      );
      updateUsers(
        users.map((user) =>
          selectedUserIds.includes(user.id) ? { ...user, status: "blocked" } : user
        )
      );
      setSelectedUserIds([]);
    } catch {
      setError("Failed to block users.");
    }
  };

  // Unblock selected users
  const unblockUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/users/unblock",
        { ids: selectedUserIds },
        { headers: { Authorization: token } }
      );
      updateUsers(
        users.map((user) =>
          selectedUserIds.includes(user.id) ? { ...user, status: "active" } : user
        )
      );
      setSelectedUserIds([]);
    } catch {
      setError("Failed to unblock users.");
    }
  };

  // Delete selected users
  const deleteUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/users", {
        data: { ids: selectedUserIds },
        headers: { Authorization: token },
      });
      updateUsers(users.filter((user) => !selectedUserIds.includes(user.id)));
      setSelectedUserIds([]);
    } catch {
      setError("Failed to delete users.");
    }
  };

  return (
    <div className="p-4 bg-gray-50">
      {/* Error Message */}
      {error && <div className="mb-4 text-red-500">{error}</div>}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={blockUsers}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Block
          </button>
          <button
            onClick={unblockUsers}
            className="px-6 py-3 text-white bg-green-500 rounded-md hover:bg-green-600"
            title="Unblock"
          >
            <FaUnlockKeyhole />
          </button>
          <button
            onClick={deleteUsers}
            className="px-6 py-3 text-white bg-red-500 rounded-md hover:bg-red-600"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  onChange={(e) =>
                    setSelectedUserIds(
                      e.target.checked ? users.map((user) => user.id) : []
                    )
                  }
                  checked={selectedUserIds.length === users.length && users.length > 0}
                />
              </th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Last Login</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    onChange={() => toggleUserSelection(user.id)}
                    checked={selectedUserIds.includes(user.id)}
                  />
                </td>
                <td className="p-3 border-b">{user.name}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b">
  {`${formatDistanceToNow(parseISO(user.last_login), { addSuffix: true })}, ${format(parseISO(user.last_login), "dd-MM-yy")}`}
</td>
                <td className="p-3 border-b">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
