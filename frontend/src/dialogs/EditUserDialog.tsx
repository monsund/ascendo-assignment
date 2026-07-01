"use client";

import { useState, useEffect, useCallback } from "react";
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
import { updateUser } from "@/services/userApi";
import { User } from "@/types/user";

interface EditUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserDialog({
  open,
  user,
  onClose,
  onSuccess,
}: EditUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-populate form when dialog opens
  useEffect(() => {
    if (open && user) {
      setName(user.name);
      setEmail(user.email);
      setError("");
    }
  }, [open, user]);

  const handleClose = () => {
    if (!loading) {
      setError("");
      onClose();
    }
  };

  const handleSave = async () => {
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

    if (!user) {
      setError("User data not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the updateUser API
      await updateUser(user._id, name, email);
      // After successful update:
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
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
      <DialogTitle sx={{ fontWeight: 600 }}>Edit User</DialogTitle>

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
                handleSave();
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
                handleSave();
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
          onClick={handleSave}
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
              Saving...
            </Box>
          ) : (
            "Save User"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
