import React, { useState, useEffect } from "react";
import api from "../API/api"; // Import the axios instance

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/api/users");
        const sortedData = data.sort((a, b) =>
          a.employeeId.localeCompare(b.employeeId)
        );
        setUsers(sortedData);
      } catch (err) {
        setError("Error fetching users");
        console.error("Error:", err);
      }
    };
    fetchUsers();
  }, []);

  // Function to handle the edit action
  const handleEdit = (userId) => {
    const newName = prompt("Enter the new name:");
    if (newName) {
      api
        .put(`/users/${userId}`, { firstName: newName })
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, firstName: newName } : user
            )
          );
        })
        .catch((err) => {
          console.error("Error updating user:", err);
          alert("Failed to update user.");
        });
    }
  };

  // Function to handle password reset
  const handlePasswordReset = (userId) => {
    const newPassword = prompt("Enter the new password:");
    if (newPassword) {
      api
        .put(
          `/users/${userId}/reset-password`,
          { password: newPassword } // Make sure the password is being sent correctly
        )
        .then(() => {
          alert("Password reset successfully!");
        })
        .catch((err) => {
          console.error("Error resetting password:", err);
          alert("Failed to reset password.");
        });
    }
  };

  // Function to handle status toggle
  const handleStatusToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    api
      .put(`/users/${userId}/status`, {
        status: newStatus,
      })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, status: newStatus } : user
          )
        );
        alert(`User status updated to ${newStatus}`);
      })
      .catch((err) => {
        console.error("Error updating user status:", err);
        alert("Failed to update user status.");
      });
  };

  // Function to handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management-container">
      <h2>User Management</h2>

      {/* Error Message */}
      {error && <p className="error-msg">{error}</p>}

      {/* Search Box */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or employee ID"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Users Table */}
      <div className="user-table">
        <h3>All Users</h3>
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.employeeId}</td>
                <td>{user.firstName}</td>
                <td>{user.status === "active" ? "Active" : "Inactive"}</td>
                <td>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEdit(user._id)}>Edit</button>
                    <button onClick={() => handlePasswordReset(user._id)}>
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleStatusToggle(user._id, user.status)}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
