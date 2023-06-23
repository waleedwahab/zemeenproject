import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";

import { Stack } from "@mui/system";
import {
  collectionGroup,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../Auth/firebase";

function SellTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collectionGroup(db, "sell"));
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
            <th>City</th>
            <th>Type</th>
            <th>Bathroom</th>
            <th>Bedroom</th>
            <th>Phone Number</th>
            <th>Area</th>
            <th>Description</th>
            <th>Price</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.city}</td>
              <td>{user.type}</td>
              <td>{user.bathroom}</td>
              <td>{user.bedroom}</td>
              <td>{user.number}</td>
              <td>{user.area}</td>
              <td>{user.description}</td>
              <td>{user.price}</td>
              <td>{user.title}</td>
              <td>
                <Stack direction="row" spacing={0} sx={{ marginTop: "-15px" }}>
                  <IconButton color="primary" aria-label="add to shopping cart">
                    <DeleteIcon
                      style={{ color: "#E53472" }}
                      onClick={() => handleDelete(user)}
                    />
                  </IconButton>

                  <IconButton color="primary" aria-label="add to shopping cart">
                    <EditIcon
                      style={{ color: "#2A84EB" }}
                      onClick={() => handleEdit(user)}
                    />
                  </IconButton>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SellTable;
