import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography } from '@mui/material';

interface DeleteDocumentModalProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
  onDocumentDeleted: () => void;
}

const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({
  open,
  onClose,
  documentId,
  onDocumentDeleted,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete document');
      }

      onDocumentDeleted(); // Notify parent component to refresh document list
      onClose(); 
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Folder</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete this document?
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

export default DeleteDocumentModal;
