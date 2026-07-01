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
import { createList } from "@/services/listApi";

interface CreateListDialogProps {
  open: boolean;
  boardId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateListDialog({
  open,
  boardId,
  onClose,
  onSuccess,
}: CreateListDialogProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setError("");
      onClose();
    }
  };

  const handleCreate = async () => {
    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the createList API
      await createList(boardId, title);
      // After successful creation:
      setTitle("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create list"
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !title.trim() || loading;

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
      <DialogTitle sx={{ fontWeight: 600 }}>Create New List</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            autoFocus
            label="List Title"
            placeholder="Enter list title"
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isSubmitDisabled) {
                handleCreate();
              }
            }}
            disabled={loading}
            error={!!error}
            helperText={error}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ pt: 2, px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={isSubmitDisabled}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {loading && <CircularProgress size={20} />}
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
