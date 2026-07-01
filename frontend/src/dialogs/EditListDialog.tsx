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
import { updateList } from "@/services/listApi";
import { List } from "@/types/list";

interface EditListDialogProps {
  open: boolean;
  list: List;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditListDialog({
  open,
  list,
  onClose,
  onSuccess,
}: EditListDialogProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-populate form when dialog opens
  useEffect(() => {
    if (open && list) {
      setTitle(list.title);
      setError("");
    }
  }, [open, list]);

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
      // Call the updateList API
      await updateList(list._id, title);
      // After successful update:
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update list");
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
      <DialogTitle sx={{ fontWeight: 600 }}>Edit List</DialogTitle>

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
                handleSave();
              }
            }}
            error={!!error}
            helperText={error}
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
