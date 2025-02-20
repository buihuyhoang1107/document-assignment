import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
} from '@mui/material';

interface DeleteFolderModalProps {
  open: boolean;
  onClose: () => void;
  folderId: string;
  onFolderDeleted: (sbMSG: string) => void;
}

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  open,
  onClose,
  folderId,
  onFolderDeleted,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:4000/api/folders/${folderId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete folder');
      }

      onFolderDeleted('Folder delete successfully!');
      onClose();
    } catch (error: any) {
      setError(error.message);
      onFolderDeleted(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Folder</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete this folder?
        </Typography>
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="primary" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFolderModal;
