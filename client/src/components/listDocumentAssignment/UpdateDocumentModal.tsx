import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

interface UpdateDocumentModalProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
  currentContent: string;
  onUpdateSuccess: (sbMSG: string) => void;
}

const UpdateDocumentModal: React.FC<UpdateDocumentModalProps> = ({
  open,
  onClose,
  documentId,
  currentContent,
  onUpdateSuccess,
}) => {
  const [content, setContent] = useState(currentContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/documents/${documentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Update failed');

      onUpdateSuccess('Document update successfully!');
      onClose(); 
    } catch (err: any) {
      setError(err.message);
      onUpdateSuccess(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} disableEnforceFocus>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Update Document
        </Typography>
        <TextField
          label="Content"
          multiline
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={!!error}
          helperText={error}
          minRows={6}
          maxRows={15}
        />
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateDocumentModal;
