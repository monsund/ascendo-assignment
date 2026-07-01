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
import { createCard } from "@/services/cardApi";

interface CreateCardDialogProps {
  open: boolean;
  listId: string;
  boardId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCardDialog({
  open,
  listId,
  boardId,
  onClose,
  onSuccess,
}: CreateCardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setDescription("");
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
      // Call the createCard API
      await createCard(boardId, listId, title, description);
      // After successful creation:
      setTitle("");
      setDescription("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create card"
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
      <DialogTitle sx={{ fontWeight: 600 }}>Create New Card</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            autoFocus
            label="Card Title"
            placeholder="Enter card title"
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            error={!!error}
            helperText={error}
            disabled={loading}
            variant="outlined"
          />

          <TextField
            label="Description"
            placeholder="Enter card description (optional)"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            variant="outlined"
          />
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
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
