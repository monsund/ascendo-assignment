"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import { Board } from "@/types/board";
import { getBoardById } from "@/services/boardApi";
import { List } from "@/types/list";
import { getListsByBoard, deleteList } from "@/services/listApi";
import { getCardsByBoard, reorderCards } from "@/services/cardApi";
import { Card as CardType } from "@/types/card";
import CardItem from "@/components/CardItem";
import CreateCardDialog from "@/dialogs/CreateCardDialog";
import CreateListDialog from "@/dialogs/CreateListDialog";
import EditListDialog from "@/dialogs/EditListDialog";
import {
  Typography,
  Container,
  Button,
  Box,
  Stack,
  Divider,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function BoardDetailsPage() {
  const { id } = useParams();

  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [openDialogListId, setOpenDialogListId] = useState<string | null>(null);
  const [openCreateListDialog, setOpenCreateListDialog] = useState(false);
  const [openEditListDialog, setOpenEditListDialog] = useState(false);
  const [editingList, setEditingList] = useState<List | null>(null);
  const [listMenuAnchor, setListMenuAnchor] = useState<HTMLElement | null>(null);
  const [listMenuListId, setListMenuListId] = useState<string | null>(null);
  const [openDeleteListDialog, setOpenDeleteListDialog] = useState(false);
  const [deletingListId, setDeletingListId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchCards = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getCardsByBoard(id as string);
      setCards(data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const fetchLists = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getListsByBoard(id as string);
      setLists(data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  // List menu handlers
  const handleListMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    listId: string
  ) => {
    setListMenuAnchor(event.currentTarget);
    setListMenuListId(listId);
  };

  const handleListMenuClose = () => {
    setListMenuAnchor(null);
    setListMenuListId(null);
  };

  const handleEditList = (list: List) => {
    setEditingList(list);
    setOpenEditListDialog(true);
    handleListMenuClose();
  };

  const handleDeleteListClick = (list: List) => {
    setDeletingListId(list._id);
    setOpenDeleteListDialog(true);
    handleListMenuClose();
  };

  const handleDeleteListCancel = () => {
    setOpenDeleteListDialog(false);
    setDeletingListId(null);
    setDeleteError("");
  };

  const handleDeleteListConfirm = async () => {
    if (!deletingListId) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await deleteList(deletingListId);
      // Remove the deleted list from state
      setLists((prevLists) =>
        prevLists.filter((l) => l._id !== deletingListId)
      );
      // Also remove cards from that list
      setCards((prevCards) =>
        prevCards.filter((card) => {
          const cardListId =
            typeof card.listId === "string" ? card.listId : card.listId._id;
          return cardListId !== deletingListId;
        })
      );
      handleDeleteListCancel();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete list"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchBoard = async () => {
      try {
        const data = await getBoardById(id as string);
        setBoard(data);
      } catch (error) {
        console.error(error);
      }
    };

    const initializeBoard = async () => {
      try {
        setLoading(true);
        await Promise.all([
            fetchBoard(),
            fetchLists(),
            fetchCards(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    initializeBoard();
  }, [id, fetchCards, fetchLists]);

  const getCardsByList = (listId: string) => {
    return cards.filter((card) => {
      const id = typeof card.listId === "string" ? card.listId : card.listId._id;
      return id === listId;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeCardId = active.id as string;
    const overCardId = over.id as string;

    const activeCard = cards.find((c) => c._id === activeCardId);
    const overCard = cards.find((c) => c._id === overCardId);

    if (!activeCard || !overCard) return;

    const activeListId = typeof activeCard.listId === "string" ? activeCard.listId : activeCard.listId._id;
    const overListId = typeof overCard.listId === "string" ? overCard.listId : overCard.listId._id;

    // Only reorder within the same list
    if (activeListId !== overListId) return;

    const listIdStr = activeListId as string;

    const listCards = cards.filter((card) => {
      const listId =
        typeof card.listId === "string"
          ? card.listId
          : card.listId._id;

      return listId === listIdStr;
    });

    const activeIndex = listCards.findIndex((c) => c._id === activeCardId);
    const overIndex = listCards.findIndex((c) => c._id === overCardId);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return;

    const previousCards = [...cards];

    const reorderedListCards = [...listCards];
    const [removed] = reorderedListCards.splice(activeIndex, 1);
    reorderedListCards.splice(overIndex, 0, removed);

    const otherCards = cards.filter((card) => {
      const listId =
        typeof card.listId === "string"
          ? card.listId
          : card.listId._id;

      return listId !== listIdStr;
    });

    // Merge reordered list back into full cards array
    const newCards = [...otherCards, ...reorderedListCards];
    setCards(newCards);

    const payload = reorderedListCards.map((card, index) => ({
      id: card._id,
      position: index + 1,
    }));

    try {
      await reorderCards(listIdStr, payload);
    } catch (error) {
      console.error("Failed to reorder cards:", error);
      setCards(previousCards);
    }
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
        <Container maxWidth="sm">
          <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ color: "#000" }}>
              Loading board...
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Note: We are using a free tier server, so it may take a moment to load.
            </Typography>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#000" }}>
              {board?.name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateListDialog(true)}
              size="small"
            >
              Add List
            </Button>
          </Box>

          <Typography sx={{ mb: 1, color: "#000" }}>
            Privacy: {board?.privacy}
          </Typography>

          <Typography sx={{ mb: 4, color: "#000" }}>
            Members: {board?.members.length}
          </Typography>
        </Container>

        <Box sx={{ overflow: "auto", py: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              px: 2,
              minHeight: "calc(100vh - 300px)",
              minWidth: "min-content",
            }}
          >
            {lists.map((list) => {
              const listCards = getCardsByList(list._id);
              return (
                <Paper
                  key={list._id}
                  elevation={1}
                  sx={{
                    width: 340,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {/* List Header */}
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#000" }}>
                        {list.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleListMenuOpen(e, list._id)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => setOpenDialogListId(list._id)}
                    >
                      Add Card
                    </Button>
                  </Box>

                  <Divider />

                  {/* Cards Container */}
                  <Stack
                    spacing={1}
                    sx={{
                      flex: 1,
                      p: 2,
                      overflowY: "auto",
                      minHeight: 200,
                    }}
                  >
                    <SortableContext
                      items={listCards.map((c) => c._id)}
                      strategy={verticalListSortingStrategy}
                    >
                    {listCards.length === 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flex: 1,
                          minHeight: 200,
                        }}
                      >
                        <Typography
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          No cards yet
                        </Typography>
                      </Box>
                    ) : (
                      listCards.map((card) => (
                        <CardItem
                          key={card._id}
                          card={card}
                          boardId={id as string}
                          onCardUpdated={fetchCards}
                        />
                      ))
                    )}
                    </SortableContext>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Box>

        {openDialogListId && (
          <CreateCardDialog
            open={!!openDialogListId}
            listId={openDialogListId}
            boardId={id as string}
            onClose={() => setOpenDialogListId(null)}
            onSuccess={fetchCards}
          />
        )}

        <CreateListDialog
          open={openCreateListDialog}
          boardId={id as string}
          onClose={() => setOpenCreateListDialog(false)}
          onSuccess={fetchLists}
        />

        {/* List Menu */}
        <Menu
          anchorEl={listMenuAnchor}
          open={!!listMenuAnchor}
          onClose={handleListMenuClose}
        >
          <MenuItem
            onClick={() => {
              const list = lists.find((l) => l._id === listMenuListId);
              if (list) {
                handleEditList(list);
              }
            }}
          >
            Edit List
          </MenuItem>
          <MenuItem
            onClick={() => {
              const list = lists.find((l) => l._id === listMenuListId);
              if (list) {
                handleDeleteListClick(list);
              }
            }}
            sx={{ color: "error.main" }}
          >
            Delete List
          </MenuItem>
        </Menu>

        {/* Edit List Dialog */}
        {editingList && (
          <EditListDialog
            open={openEditListDialog}
            list={editingList}
            onClose={() => {
              setOpenEditListDialog(false);
              setEditingList(null);
            }}
            onSuccess={fetchLists}
          />
        )}

        {/* Delete List Confirmation Dialog */}
        <Dialog
          open={openDeleteListDialog}
          onClose={handleDeleteListCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Delete List</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {deleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            )}
            <Typography>
              Are you sure you want to delete this list? All cards in this list
              will also be deleted.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleDeleteListCancel} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteListConfirm}
              variant="contained"
              color="error"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DndContext>
  );
}
