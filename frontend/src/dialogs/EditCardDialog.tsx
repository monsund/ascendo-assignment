"use client";

import { useState, useEffect } from "react";
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
import { updateCard } from "@/services/cardApi";
import { Card } from "@/types/card";

interface EditCardDialogProps {
  open: boolean;
  card: Card;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCardDialog({
  open,
  card,
  onClose,
  onSuccess,
}: EditCardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-populate form when dialog opens
  
  useEffect(() => {
    if (open && card) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(card.name);
      setDescription(card.description || "");
      setError("");
    }
  }, [open, card]);

  const handleClose = () => {
    if (!loading) {
      setError("");
      onClose();
    }
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the updateCard API
      await updateCard(card._id, title, description);
      // After successful update:
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update card");
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
      <DialogTitle sx={{ fontWeight: 600 }}>Edit Card</DialogTitle>

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
            "Save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
