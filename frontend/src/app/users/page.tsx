"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsers, deleteUser } from "@/services/userApi";
import { User } from "@/types/user";
import CreateUserDialog from "@/dialogs/CreateUserDialog";
import EditUserDialog from "@/dialogs/EditUserDialog";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeUsers = async () => {
      await fetchUsers();
    };
    initializeUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteError("");
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await deleteUser(userToDelete._id);
      // After successful deletion:
      setOpenDeleteDialog(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete user"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    if (!deleteLoading) {
      setOpenDeleteDialog(false);
      setUserToDelete(null);
      setDeleteError("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Create User
        </Button>
      </Box>

      {/* Users Table */}
      {users.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="textSecondary">No users found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(user)}
                      title="Edit user"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user)}
                      title="Delete user"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create User Dialog */}
      <CreateUserDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          setOpenCreateDialog(false);
          fetchUsers();
        }}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        open={openEditDialog}
        user={selectedUser}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          setOpenEditDialog(false);
          setSelectedUser(null);
          fetchUsers();
        }}
      />

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {deleteError && (
            <Box sx={{ color: "error.main", mb: 2, fontSize: "0.875rem" }}>
              {deleteError}
            </Box>
          )}
          <Typography>
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCancelDelete} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            sx={{ position: "relative" }}
          >
            {deleteLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Deleting...
              </Box>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
