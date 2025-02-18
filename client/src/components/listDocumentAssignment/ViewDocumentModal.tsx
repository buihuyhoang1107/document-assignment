import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { DocumentWithTimestamp } from './type';

interface ViewDocumentModalProps {
  open: boolean;
  document: DocumentWithTimestamp | null;
  onClose: () => void;
}

const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({
  open,
  document,
  onClose,
}) => {
  if (!document) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="document-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          bgcolor: 'background.default',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" id="document-title" gutterBottom>
          Title: {document.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          Content: {document.content}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2 }}
        >
          Created: {new Date(document.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last Updated: {new Date(document.updatedAt).toLocaleString()}
        </Typography>
        <Box sx={{ textAlign: 'right', mt: 3 }}>
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewDocumentModal;
