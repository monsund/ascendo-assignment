"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { createCard } from "@/services/cardApi";

interface CreateCardDialogProps {
  open: boolean;
  listId: string;
  boardId: string;
  onClose: () => void;
  onCardCreated: () => void;
}

export default function CreateCardDialog({
  open,
  listId,
  boardId,
  onClose,
  onCardCreated,
}: CreateCardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createCard(boardId, listId, title, description);
      setTitle("");
      setDescription("");
      onCardCreated();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create card"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Card</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Card Title"
            placeholder="Enter card title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!error && !title.trim()}
            disabled={loading}
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
          />
          {error && (
            <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={loading || !title.trim()}
        >
          {loading ? "Creating..." : "Create Card"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
