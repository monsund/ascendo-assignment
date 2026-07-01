"use client";

import { useState, useEffect, useCallback, SyntheticEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import { assignUser } from "@/services/cardApi";
import { getBoardMembers } from "@/services/userApi";
import { Card } from "@/types/card";
import { User } from "@/types/user";

interface AssignUserDialogProps {
  open: boolean;
  card: Card;
  boardId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const UNASSIGNED_OPTION: User = {
  _id: "unassigned",
  name: "Unassigned",
  email: "",
  createdAt: "",
  updatedAt: "",
};

export default function AssignUserDialog({
  open,
  card,
  boardId,
  onClose,
  onSuccess,
}: AssignUserDialogProps) {
  const [members, setMembers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchBoardMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBoardMembers(boardId);
      const allMembers = [UNASSIGNED_OPTION, ...data];
      setMembers(allMembers);

      // Pre-select current assignee
      if (card.assignedUser) {
        const user =
          typeof card.assignedUser === "object" ? card.assignedUser : null;
        setSelectedUser(user || null);
      } else if (typeof card.assignedUserId === "object" && card.assignedUserId) {
        // Backend populates assignedUserId as an object
        setSelectedUser(card.assignedUserId as User);
      } else {
        setSelectedUser(UNASSIGNED_OPTION);
      }
    } catch (err) {
      setError("Failed to load board members");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [boardId, card.assignedUser, card.assignedUserId]);

  useEffect(() => {
    if (open) {
      const initializeMembers = async () => {
        await fetchBoardMembers();
      };
      void initializeMembers();
    }
  }, [open, fetchBoardMembers]);

  const handleClose = () => {
    if (!saving) {
      setError("");
      onClose();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const userId =
        selectedUser?._id === "unassigned" ? null : selectedUser?._id || null;
      await assignUser(card._id, userId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign user");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (_event: SyntheticEvent, value: User | null) => {
    setSelectedUser(value);
    if (error) setError("");
  };

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
      <DialogTitle sx={{ fontWeight: 600 }}>Assign User</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {error && (
            <Box
              sx={{
                p: 1.5,
                backgroundColor: "error.light",
                color: "error.main",
                borderRadius: 1,
              }}
            >
              {error}
            </Box>
          )}

          {loading ? (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Autocomplete
              options={members}
              value={selectedUser}
              onChange={handleChange}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option._id === value?._id
              }
              disabled={saving}
              renderInput={(params) => (
                <TextField {...params} label="Select User" />
              )}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || loading}
          sx={{ position: "relative" }}
        >
          {saving ? (
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
