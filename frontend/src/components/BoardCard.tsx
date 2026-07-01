import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Board } from "@/types/board";
import Link from "next/link";
import EditBoardDialog from "@/dialogs/EditBoardDialog";
import { deleteBoard } from "@/services/boardApi";

interface BoardCardProps {
  board: Board;
  onBoardUpdated?: () => void;
}

export default function BoardCard({ board, onBoardUpdated }: BoardCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEditClick = () => {
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError("");

    try {
      await deleteBoard(board._id);
      handleDeleteCancel();
      onBoardUpdated?.();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete board"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          height: "100%",
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
              spacing={1}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                📋 {board.name}
              </Typography>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ mt: -1 }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Chip
              label={board.privacy}
              color={board.privacy === "PUBLIC" ? "success" : "default"}
              size="small"
              sx={{ width: "fit-content" }}
            />

            <Typography variant="body2" color="text.secondary">
              Members: {board.members.length}
            </Typography>

            <Button
              component={Link}
              href={`/boards/${board._id}`}
              variant="contained"
              fullWidth
            >
              View Board
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit Board</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          Delete Board
        </MenuItem>
      </Menu>

      {/* Edit Board Dialog */}
      <EditBoardDialog
        open={openEditDialog}
        board={board}
        onClose={handleEditClose}
        onSuccess={() => {
          onBoardUpdated?.();
          handleEditClose();
        }}
      />

      {/* Delete Board Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Board</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete this board? All lists and cards in
            this board will also be deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}