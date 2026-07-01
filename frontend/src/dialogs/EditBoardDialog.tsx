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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { updateBoard } from "@/services/boardApi";
import { getUsers } from "@/services/userApi";
import { Board } from "@/types/board";
import { User } from "@/types/user";

interface EditBoardDialogProps {
  open: boolean;
  board: Board;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBoardDialog({
  open,
  board,
  onClose,
  onSuccess,
}: EditBoardDialogProps) {
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Pre-populate form when dialog opens
  useEffect(() => {
    const loadData = async () => {
      if (open && board) {
        setName(board.name);
        setPrivacy(board.privacy as "PUBLIC" | "PRIVATE");
        setError("");
        
        // Load users if not already loaded
        if (users.length === 0) {
          await fetchUsers();
        }
      }
    };
    if (open && board) {
      loadData();
    }
  }, [open, board, users.length, fetchUsers]);

  // Pre-populate members after users are loaded
  useEffect(() => {
    const updateMembers = async () => {
      if (users.length > 0 && board && board.members && Array.isArray(board.members)) {
        // Map member IDs to User objects (deduplicate)
        const uniqueMemberIds = [...new Set(board.members)];
        const memberUsers = uniqueMemberIds
          .map((memberId) => users.find((u) => u._id === memberId))
          .filter((user): user is User => user !== undefined);
        setSelectedMembers(memberUsers);
      } else if (!board || !board.members || board.members.length === 0) {
        setSelectedMembers([]);
      }
    };
    updateMembers();
  }, [users, board]);

  const handleClose = () => {
    if (!loading) {
      setError("");
      onClose();
    }
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      setError("Board name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the updateBoard API with members (deduplicated)
      const memberIds = [...new Set(selectedMembers.map((u) => u._id))];
      await updateBoard(board._id, name, privacy, memberIds);
      // After successful update:
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update board");
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
      <DialogTitle sx={{ fontWeight: 600 }}>Edit Board</DialogTitle>

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
                handleSave();
              }
            }}
            error={!!error}
            helperText={error}
            disabled={loading}
            variant="outlined"
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
