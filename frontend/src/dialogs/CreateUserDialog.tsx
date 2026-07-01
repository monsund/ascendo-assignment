"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { createUser } from "@/services/userApi";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserDialog({
  open,
  onClose,
  onSuccess,
}: CreateUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (!loading) {
      setName("");
      setEmail("");
      setError("");
      onClose();
    }
  };

  const handleCreate = async () => {
    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the createUser API
      await createUser(name, email);
      // After successful creation:
      setName("");
      setEmail("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !name.trim() || !email.trim() || loading;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Create New User</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            autoFocus
            label="Name"
            placeholder="Enter user name"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isSubmitDisabled) {
                handleCreate();
              }
            }}
            disabled={loading}
            error={!!error && !email.trim()}
            variant="outlined"
          />

          <TextField
            label="Email"
            placeholder="Enter email address"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isSubmitDisabled) {
                handleCreate();
              }
            }}
            disabled={loading}
            error={!!error && !name.trim()}
            variant="outlined"
          />

          {error && (
            <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={isSubmitDisabled}
          sx={{ position: "relative" }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress size={20} color="inherit" />
              Creating...
            </Box>
          ) : (
            "Create User"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
