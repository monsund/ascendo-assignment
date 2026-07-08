"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { MoreVert, DragIndicator } from "@mui/icons-material";
import { Card as CardType } from "@/types/card";
import EditCardDialog from "@/dialogs/EditCardDialog";
import AssignUserDialog from "@/dialogs/AssignUserDialog";
import { deleteCard } from "@/services/cardApi";
import MoveCardDialog from "@/dialogs/MoveCardDialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardItemProps {
  card: CardType;
  boardId: string;
  onCardUpdated?: () => void;
}

export default function CardItem({
  card,
  boardId,
  onCardUpdated,
}: CardItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openMoveDialog, setOpenMoveDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id });  

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditSuccess = () => {
    setOpenEditDialog(false);
    onCardUpdated?.();
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);

    try {
      await deleteCard(card._id);
      setOpenDeleteDialog(false);
      onCardUpdated?.();
    } catch (error) {
      console.error("Failed to delete card:", error);
      setDeleting(false);
    }
  };

  const handleAssignClick = () => {
    setOpenAssignDialog(true);
    handleMenuClose();
  };

  const handleAssignClose = () => {
    setOpenAssignDialog(false);
  };

  const handleAssignSuccess = () => {
    setOpenAssignDialog(false);
    onCardUpdated?.();
  };

  const handleMoveClick = () => {
    setOpenMoveDialog(true);
    handleMenuClose();
  };

  const handleMoveClose = () => {
    setOpenMoveDialog(false);
  };
  return (
    <Card
      ref={setNodeRef}
      style={style}
      elevation={2}
      sx={{
        borderRadius: 2,
        height: 140,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.2s ease-in-out",
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 1000 : "auto",
        boxShadow: isDragging ? 6 : 2,
        "&:hover": {
          elevation: 4,
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            mb: 1,
          }}
        >
          <IconButton
            size="small"
            {...attributes}
            {...listeners}
            sx={{
              cursor: isDragging ? "grabbing" : "grab",
              flexShrink: 0,
              "&:active": {
                cursor: "grabbing",
              },
            }}
          >
            <Tooltip title="Drag to reorder">
              <DragIndicator fontSize="small" />
            </Tooltip>
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              flex: 1,
              wordBreak: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
            title={card.name}
          >
            {card.name}
          </Typography>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              flexShrink: 0,
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          <MenuItem onClick={handleAssignClick}>
            Assign User
          </MenuItem>
          <MenuItem onClick={handleMoveClick}>Move</MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
            Delete
          </MenuItem>
        </Menu>

        <Stack spacing={1} sx={{ overflow: "hidden", flex: 1 }}>
          {card.description && (
            <Tooltip title={card.description} placement="top">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {card.description}
              </Typography>
            </Tooltip>
          )}

          <Typography
            variant="caption"
            color={card.assignedUserId ? "text.secondary" : "error"}
            sx={{
              fontWeight: card.assignedUserId ? 400 : 500,
            }}
          >
            {card.assignedUserId
              ? `👤 ${card.assignedUserId.name}`
              : "Unassigned"}
          </Typography>
        </Stack>
      </CardContent>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Card</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete this card?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ position: "relative" }}
          >
            {deleting ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={20} color="inherit" />
                Deleting...
              </Box>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>


      <AssignUserDialog
        open={openAssignDialog}
        card={card}
        boardId={boardId}
        onClose={handleAssignClose}
        onSuccess={handleAssignSuccess}
      />

      <EditCardDialog
        open={openEditDialog}
        card={card}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
      />

      <MoveCardDialog
        open={openMoveDialog}
        card={card}
        boardId={boardId}
        onClose={handleMoveClose}
        onSuccess={() => {
          onCardUpdated?.();
          handleMoveClose();
        }}
      />
    </Card>
  );
}
