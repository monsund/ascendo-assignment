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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { createBoard } from "@/services/boardApi";
import { getUsers } from "@/services/userApi";
import { User } from "@/types/user";

interface CreateBoardDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBoardDialog({
  open,
  onClose,
  onSuccess,
}: CreateBoardDialogProps) {
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      if (open && users.length === 0) {
        await fetchUsers();
      }
    };
    loadUsers();
  }, [open, users.length]);

  const handleClose = () => {
    if (!loading) {
      setName("");
      setPrivacy("PUBLIC");
      setSelectedMembers([]);
      setError("");
      onClose();
    }
  };

  const handleCreate = async () => {
    // Validation
    if (!name.trim()) {
      setError("Board name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the createBoard API with members (deduplicated)
      const memberIds = [...new Set(selectedMembers.map((u) => u._id))];
      await createBoard(name, privacy, memberIds);
      // After successful creation:
      setName("");
      setPrivacy("PUBLIC");
      setSelectedMembers([]);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !name.trim() || loading;

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
      <DialogTitle sx={{ fontWeight: 600 }}>Create New Board</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            autoFocus
            label="Board Name"
            placeholder="Enter board name"
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
            error={!!error}
            helperText={error}
          />

          <FormControl fullWidth disabled={loading}>
            <InputLabel>Privacy</InputLabel>
            <Select
              value={privacy}
              label="Privacy"
              onChange={(e) =>
                setPrivacy(e.target.value as "PUBLIC" | "PRIVATE")
              }
            >
              <MenuItem value="PUBLIC">PUBLIC</MenuItem>
              <MenuItem value="PRIVATE">PRIVATE</MenuItem>
            </Select>
          </FormControl>

          {loadingUsers ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={selectedMembers}
              onChange={(_, newValue) => setSelectedMembers(newValue)}
              disabled={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Members"
                  placeholder="Select board members (optional)"
                />
              )}
            />
          )}
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
