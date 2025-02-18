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
  Autocomplete,
  Grid2,
  Container,
  Box,
} from '@mui/material';
import CreateDocumentModal from './CreateDocumentModal';
import DeleteDocumentModal from './DeleteDocumentModal';
import UpdateDocumentModal from './UpdateDocumentModal';
import ViewDocumentModal from './ViewDocumentModal';

interface Document {
  id: string;
  folderId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}
interface DocumentWithTimestamp extends Omit<Document, 'timestamp'> {
  timestamp: number;
}

const GetDocumentsByFolder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [viewHistory, setViewHistory] = useState<DocumentWithTimestamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentWithTimestamp | null>(null);
  const [openModal, setOpenModal] = useState<{
    type: 'create' | 'update' | 'delete' | null;
    doc?: Document;
  }>({ type: null });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch documents and view history
  const fetchDocuments = () => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/folders/${id}`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject('Failed to fetch documents')
      )
      .then((data) => {
        setDocuments(data);
        setFilteredDocuments(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const fetchViewHistory = () => {
    fetch('http://localhost:4000/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          // Lọc bỏ tài liệu trùng
          const uniqueHistory = [
            ...new Map(data.map((item) => [item.id, item])).values(),
          ];

          setViewHistory(uniqueHistory);
        } else {
          console.error('Dữ liệu lịch sử không hợp lệ');
        }
      })
      .catch((err) => {
        console.error('Không thể lấy lịch sử từ API:', err);
      });
  };

  //SaveViewHistory
  const saveViewHistory = (doc: Document) => {
    const newHistory = {
      id: doc.id,
      title: doc.title,
    };

    fetch('http://localhost:4000/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newHistory),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'added') {
          fetchViewHistory();
        }
      })
      .catch((err) => {
        console.error('Không thể lưu lịch sử:', err);
      });
  };

  useEffect(() => {
    fetchDocuments();
    fetchViewHistory();
  }, [id]);

  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp).toLocaleString();

  const handleOpenModal = (
    type: 'create' | 'update' | 'delete',
    doc?: Document
  ) => {
    setOpenModal({ type, doc });
  };

  const handleCloseModal = () => setOpenModal({ type: null });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(
        documents.filter(
          (doc) =>
            doc.title.toLowerCase().includes(query.toLowerCase()) ||
            doc.content.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleViewDocument = (doc: Document) => {
    saveViewHistory(doc);
    setSelectedDocument({ ...doc, timestamp: Date.now() });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container maxWidth='xl'>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Documents for Folder: {id}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal('create')}
        >
          Create New Document
        </Button>
      </Box>

      <Autocomplete
        freeSolo
        options={documents.map((doc) => doc.title)}
        inputValue={searchQuery}
        onInputChange={(_, newInputValue) => handleSearch(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Documents"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />
      <Grid2 container spacing={3}>
        {/* Document */}
        {/* <Grid2 item xs={12} sm={6} width='-webkit-fill-available'>
        size={2}  */}
        <Grid2 item xs={12} sm={6} size={8}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              p: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
                overflowY: 'auto',
                borderRadius: 2,
              }}
            >
              <Table stickyHeader aria-label="sticky table">
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Loading
                      </TableCell>
                    </TableRow>
                  ) : filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No documents found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>{doc.folderId}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {doc.content}
                        </TableCell>
                        <TableCell>{formatTimestamp(doc.createdAt)}</TableCell>
                        <TableCell>{formatTimestamp(doc.updatedAt)}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleViewDocument(doc)}
                            color="primary"
                            size="small"
                          >
                            Detail
                          </IconButton>
                          <IconButton
                            onClick={() => handleOpenModal('update', doc)}
                            color="primary"
                            size="small"
                          >
                            Edit
                          </IconButton>
                          <IconButton
                            onClick={() => handleOpenModal('delete', doc)}
                            color="secondary"
                            size="small"
                          >
                            Delete
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid2>

        {/* History Viewed Documents */}
        <Grid2 item xs={12} sm={6} size={4}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              p: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              History Viewed Documents
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
                overflowY: 'auto',
                borderRadius: 2,
              }}
            >
               <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        loading
                      </TableCell>
                    </TableRow>
                  ) : viewHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No recent documents viewed.
                      </TableCell>
                    </TableRow>
                  ) : (
                    viewHistory.map((history) => (
                      <TableRow
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        key={history.id}
                        onClick={() => handleViewDocument(history)}
                      >
                        <TableCell  sx={{
                            maxWidth: 150,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>{history.title}</TableCell>
                        <TableCell>
                          {formatTimestamp(history.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid2>
      </Grid2>

      {/* Modals */}
      {openModal.type === 'create' && (
        <CreateDocumentModal
          open
          onClose={handleCloseModal}
          folderId={id || ''}
          onCreate={fetchDocuments}
        />
      )}
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

      <ViewDocumentModal
        open={Boolean(selectedDocument)}
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </Container>
  );
};

export default GetDocumentsByFolder;
