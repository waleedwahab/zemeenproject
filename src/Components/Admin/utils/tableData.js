import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";

import { Stack } from "@mui/system";
import { db } from "../../../Auth/firebase";

function UserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetchedUsers);
    };
    fetchUsers();
  }, []);

  const handleEdit = async (user) => {
    try {
      const userRef = doc(db, "rent", user.id);
      await updateDoc(userRef, user);
      alert("User data updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating user data.");
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const userRef = doc(db, "rent", user.id);
        await deleteDoc(userRef);
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        alert("User deleted successfully!");
      } catch (error) {
        console.error(error);
        alert("Error deleting user.");
      }
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>ID</th>
            <th>Img URL</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Rent</th>
            <th>Sell</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.id}</td>
              <td>{user.imgURL}</td>
              <td>{user.phoneNo}</td>
              <td>{user.role}</td>
              <td>{user.rent}</td>
              <td>{user.sell}</td>
              <td>
                <td>
                  <Stack
                    direction="row"
                    spacing={0}
                    sx={{ marginTop: "-15px" }}
                  >
                    <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                    >
                      <DeleteIcon
                        style={{ color: "#E53472" }}
                        onClick={() => handleDelete(user)}
                      />
                    </IconButton>

                    <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                    >
                      <EditIcon
                        style={{ color: "#2A84EB" }}
                        onClick={() => handleEdit(user)}
                      />
                    </IconButton>
                  </Stack>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
