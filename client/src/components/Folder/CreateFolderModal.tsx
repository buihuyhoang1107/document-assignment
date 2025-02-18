import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';

const CreateFolderModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onFolderCreated: () => void;
}> = ({ open, onClose, onFolderCreated }) => {
  const [folderName, setFolderName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  };
 
  const handleSubmit = async () => {
    if (!folderName) {
      setError('Folder name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: folderName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create folder');
      }

      onFolderCreated(); // Notify the parent component to refresh folder list
      onClose(); // Close modal
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a New Folder</DialogTitle>
      <DialogContent>
        <TextField
          label="Folder Name"
          fullWidth
          value={folderName}
          onChange={handleInputChange}
          margin="normal"
          variant="outlined"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); 
              handleSubmit();
            }
          }}
        />

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
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? (
            <CircularProgress size={24} color="primary" />
          ) : (
            'Create Folder'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderModal;
