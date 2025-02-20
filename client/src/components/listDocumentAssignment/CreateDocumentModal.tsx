import React, { useState } from 'react';
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

interface CreateDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onAddSuccess: (sbMSG: string) => void;
  folderId: string;
}

const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({
  open,
  onClose,
  onAddSuccess,
  folderId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, folderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create document');
      }
      onAddSuccess('Document add successfully!');
      onClose();
    } catch (error: any) {
      setError(error.message);
      onAddSuccess(error.message);
    } finally {
      setLoading(false);
    }
    setTitle('');
    setContent('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          width: 500,
          margin: 'auto',
          mt: '10%',
        }}
      >
        <Typography variant="h6" mb={2}>
          Create New Document
        </Typography>
        <TextField
          label="Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Content"
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Document'
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateDocumentModal;
