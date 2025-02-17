import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Button,
  TextField,
  Autocomplete
} from '@mui/material';
import CreateDocumentModal from './CreateDocumentModal';
import DeleteDocumentModal from './DeleteDocumentModal';
import UpdateDocumentModal from './UpdateDocumentModal';

interface Document {
  id: string;
  folderId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const GetDocumentsByFolder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<{ type: 'create' | 'update' | 'delete' | null; doc?: Document }>({ type: null });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDocuments = () => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/folders/${id}`)
      .then((res) => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then((data) => {
        setDocuments(data);
        setFilteredDocuments(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(fetchDocuments, [id]);

  const formatTimestamp = (timestamp: number) => new Date(timestamp).toLocaleString();
  const handleOpenModal = (type: 'create' | 'update' | 'delete', doc?: Document) => setOpenModal({ type, doc });
  const handleCloseModal = () => setOpenModal({ type: null });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(documents.filter(doc =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.content.toLowerCase().includes(query.toLowerCase())
      ));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Documents for Folder: {id}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenModal('create')}>
        Create New Document
      </Button>
      <Autocomplete
        freeSolo
        options={documents.map(doc => doc.title)}
        inputValue={searchQuery}
        onInputChange={(_, newInputValue) => handleSearch(newInputValue)}
        renderInput={(params) => (
          <TextField {...params} label="Search Documents" variant="outlined" fullWidth margin="normal" />
        )}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>FolderId</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>UpdatedAt</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No documents found.</TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.folderId}</TableCell>
                  <TableCell>{doc.content}</TableCell>
                  <TableCell>{formatTimestamp(doc.createdAt)}</TableCell>
                  <TableCell>{formatTimestamp(doc.updatedAt)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => console.log(`View ${doc.id}`)} color="primary">
                      view
                    </IconButton>
                    <IconButton onClick={() => handleOpenModal('update', doc)} color="primary">
                      Edit
                    </IconButton>
                    <IconButton onClick={() => handleOpenModal('delete', doc)} color="secondary">
                      Delete
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {openModal.type === 'create' && <CreateDocumentModal open onClose={handleCloseModal} folderId={id || ''} onCreate={fetchDocuments} />}
      {openModal.type === 'update' && openModal.doc && (
        <UpdateDocumentModal
          open
          onClose={handleCloseModal}
          documentId={openModal.doc.id}
          currentContent={openModal.doc.content}
          onUpdateSuccess={fetchDocuments}
        />
      )}
      {openModal.type === 'delete' && openModal.doc && (
        <DeleteDocumentModal
          open
          documentId={openModal.doc.id}
          onClose={handleCloseModal}
          onDocumentDeleted={fetchDocuments}
        />
      )}
    </div>
  );
};

export default GetDocumentsByFolder;
