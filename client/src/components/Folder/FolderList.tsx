import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateFolderModal from './CreateFolderModal';
import DeleteFolderModal from './DeleteFolderModal';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from '@mui/material';
interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  onFolderSelect: (folderId: string) => void;
}

const FolderList: React.FC<FolderListProps> = ({ onFolderSelect }) => {
  const navigate = useNavigate(); // Để chuyển hướng
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

  if (loading) {
    return <div>Loading folders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
    <div>
      <h2>Folder List</h2>
      <List>
        {folders.map((folder) => (
          <ListItem key={folder.id}>
            <ListItemText
              primary={folder.name}
              onClick={() => handleFolderClick(folder.id)}
            />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteFolderClick(folder.id)}
              >
                delete
              </IconButton>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateFolderClick}
      >
        Create New Folder
      </Button>

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
    </div>
  );
};

export default FolderList;
