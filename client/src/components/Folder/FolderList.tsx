import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateFolderModal from './CreateFolderModal';
import DeleteFolderModal from './DeleteFolderModal';

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  onFolderSelect: (folderId: string) => void;
}

const FolderList: React.FC<FolderListProps> = ({ onFolderSelect }) => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const handleFolderClick = (id: string) => {
    onFolderSelect(id);
    navigate(`/folder/${id}`);
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/folders')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch folders');
        }
        return response.json();
      })
      .then((data: Folder[]) => {
        setFolders(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  //CREATE
  const handleFolderCreated = () => {
    setOpenCreateModal(false);
    fetch('http://localhost:4000/api/folders')
      .then((response) => response.json())
      .then((data: Folder[]) => setFolders(data));
  };

  const handleCreateFolderClick = () => {
    setOpenCreateModal(true);
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
  };

  //DELETE
  const handleFolderDeleted = () => {
    setOpenDeleteModal(false);
    fetch('http://localhost:4000/api/folders')
      .then((response) => response.json())
      .then((data: Folder[]) => setFolders(data));
  };

  const handleDeleteFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
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
        <Grid container spacing={3}>
          {folders.map((folder) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
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
                onClick={() => handleFolderClick(folder.id)}
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
            </Grid>
          ))}
        </Grid>
      )}

      {/* CreateFolderModal */}
      <CreateFolderModal
        open={openCreateModal}
        onClose={handleCloseModal}
        onFolderCreated={handleFolderCreated}
      />

      {/* DeleteFolderModal */}
      <DeleteFolderModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        folderId={selectedFolderId || ''}
        onFolderDeleted={handleFolderDeleted}
      />
    </Container>
  );
};

export default FolderList;
