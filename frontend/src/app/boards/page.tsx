"use client";

import { useEffect, useState, useCallback } from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import BoardCard from "@/components/BoardCard";
import CreateBoardDialog from "@/dialogs/CreateBoardDialog";
import { getBoards } from "@/services/boardApi";
import { Board } from "@/types/board";

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const fetchBoards = useCallback(async () => {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const initializeBoards = async () => {
      await fetchBoards();
    };
    initializeBoards();
  }, [fetchBoards]);

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Create Board
        </Button>
      </div>

      <Grid container spacing={3}>
        {boards?.map((board) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={board._id}>
            <BoardCard board={board} onBoardUpdated={fetchBoards} />
          </Grid>
        ))}
      </Grid>

      {boards.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No boards found. Create one to get started!
          </Typography>
        </Box>
      )}

      <CreateBoardDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={fetchBoards}
      />
      </Container>
    </Box>
  );
}
