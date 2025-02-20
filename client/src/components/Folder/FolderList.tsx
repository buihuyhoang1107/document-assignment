import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid2,
  IconButton,
  Snackbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateFolderModal from './CreateFolderModal';
import DeleteFolderModal from './DeleteFolderModal';

interface Folder {
  id: string;
  name: string;
}

const FolderList: React.FC = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const fetchFolders = useCallback(() => {
    setLoading(true);
    fetch('http://localhost:4000/api/folders')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch folders');
        return response.json();
      })
      .then((data: Folder[]) => setFolders(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDocumentAction = (sbMSG: string) => {
    fetchFolders();
    setSnackbarMessage(sbMSG);
    setSnackbarOpen(true);
    handleCloseModal();
  };

  const handleCreateFolderClick = () => setOpenCreateModal(true);

  const handleDeleteFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId);
    setOpenDeleteModal(true);
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);
  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Folder List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateFolderClick}
        >
          Create Folder
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          Error: {error}
        </Typography>
      ) : (
        <Grid2 container spacing={3}>
          {folders.map((folder) => (
            <Grid2 item xs={12} sm={6} md={4} lg={3} key={folder.id}>
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  transition: '0.3s',
                  '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/folder/${folder.id}`, {state: {folder}})}
              >
                <Box display="flex" alignItems="center">
                  <Typography variant="h6">{folder.name}</Typography>
                </Box>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolderClick(folder.id);
                  }}
                  color="error"
                >
                  Delete
                </IconButton>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}

      <CreateFolderModal
        open={openCreateModal}
        onClose={handleCloseModal}
        onFolderCreated={handleDocumentAction}
      />

      <DeleteFolderModal
        open={openDeleteModal}
        onClose={handleCloseModal}
        folderId={selectedFolderId || ''}
        onFolderDeleted={handleDocumentAction}
      />
      
      {/* Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FolderList;
