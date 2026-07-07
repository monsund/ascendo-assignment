"use client";

import { useState, useEffect, useCallback } from "react";
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
  Alert,
} from "@mui/material";
import { moveCard } from "@/services/cardApi";
import { getListsByBoard } from "@/services/listApi";
import { Card } from "@/types/card";
import { List } from "@/types/list";

interface MoveCardDialogProps {
  open: boolean;
  card: Card;
  boardId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MoveCardDialog({
  open,
  card,
  boardId,
  onClose,
  onSuccess,
}: MoveCardDialogProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchBoardLists = useCallback(async () => {
    setLoading(true);
    setError("");
    setSelectedList(null);

    try {
      const data = await getListsByBoard(boardId);
      setLists(data);
    } catch (err) {
      setError("Failed to load lists");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    if (open) {
      const initializeLists = async () => {
        await fetchBoardLists();
      };
      void initializeLists();
    }
  }, [open, fetchBoardLists]);

  const handleClose = () => {
    if (!saving) {
      setError("");
      onClose();
    }
  };

  const handleMove = async () => {
    if (!selectedList) {
      setError("Please select a list");
      return;
    }

    // Check if the selected list is the same as the current list
    const currentListId =
      typeof card.listId === "string" ? card.listId : card.listId._id;
    if (selectedList._id === currentListId) {
      setError("Card is already in this list");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await moveCard(card._id, selectedList._id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move card");
    } finally {
      setSaving(false);
    }
  };

  const isSubmitDisabled =
    !selectedList ||
    loading ||
    saving ||
    (() => {
      const currentListId =
        typeof card.listId === "string" ? card.listId : card.listId._id;
      return selectedList?._id === currentListId;
    })();

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
      <DialogTitle sx={{ fontWeight: 600 }}>Move Card</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <>
              {error && <Alert severity="error">{error}</Alert>}
              <Autocomplete
                disabled={loading || saving}
                options={lists}
                getOptionLabel={(option) => option.title}
                value={selectedList}
                onChange={(_, newValue) => setSelectedList(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select List"
                    placeholder="Choose a destination list"
                    disabled={loading || saving}
                  />
                )}
                noOptionsText="No lists available"
              />
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleMove}
          variant="contained"
          disabled={isSubmitDisabled}
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
              Moving...
            </Box>
          ) : (
            "Move"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
