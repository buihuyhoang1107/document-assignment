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
  const { id } = useParams(); // Lấy folderId từ URL

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedFolderId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [selectedDoc, setSelectedDoc] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Chuyển thành chuỗi ngày giờ dễ đọc
  };
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/folders/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        return response.json();
      })
      .then((data: Document[]) => {
        setDocuments(data);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]); // Chỉ theo dõi id thay đổi

  const handleView = (docId: string) => {
    console.log(`View document with id: ${docId}`);
    // Thêm logic để hiển thị chi tiết tài liệu
  };

  

  //CREATE
  const handleDocumentCreated = () => {
    setOpenDeleteModal(false);
    fetch(`http://localhost:4000/api/folders/${id}`)
      .then((response) => response.json())
      .then((data: Document[]) => setDocuments(data));
  };
  const handleCreateDocumentClick = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateDocumentModal = () => {
    setOpenCreateModal(false);
  };

  //UPDATE
  const handleEdit = (doc: Document) => {
    console.log(`Edit document with id: ${doc}`);
    setSelectedDoc({ id: doc.id, content: doc.content });
    setOpenUpdateModal(true);
  };
  const handleDocumentUpdate = () => {
    setOpenDeleteModal(false);
    fetch(`http://localhost:4000/api/folders/${id}`)
      .then((response) => response.json())
      .then((data: Document[]) => setDocuments(data));
  };

  //DELETE
  const handleDocumentDeleted = () => {
    setOpenDeleteModal(false);
    fetch(`http://localhost:4000/api/folders/${id}`)
      .then((response) => response.json())
      .then((data: Document[]) => setDocuments(data));
  };

  const handleDelete = (docId: string) => {
    setSelectedDocumentId(docId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Documents for Folder: {id}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateDocumentClick}
      >
        Create New Document
      </Button>
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
                    <IconButton
                      onClick={() => handleView(doc.id)}
                      color="primary"
                    >
                      view
                    </IconButton>
                    <IconButton onClick={() => handleEdit(doc)} color="primary">
                      edit
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(doc.id)}
                      color="secondary"
                    >
                      delete
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CreateDocumentModal */}
      <CreateDocumentModal
        open={openCreateModal}
        folderId={id || ''}
        onClose={handleCloseCreateDocumentModal}
        onCreate={handleDocumentCreated}
      />
      {/* UpdateDocumentModal */}

      {selectedDoc && (
        <UpdateDocumentModal
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          documentId={selectedDoc.id}
          currentContent={selectedDoc.content}
          onUpdateSuccess={handleDocumentUpdate} // Gọi lại API sau khi cập nhật
        />
      )}

      {/* DeleteDocumentModal */}
      <DeleteDocumentModal
        open={openDeleteModal}
        documentId={selectedFolderId || ''}
        onClose={handleCloseDeleteModal}
        onDocumentDeleted={handleDocumentDeleted}
      />
    </div>
  );
};

export default GetDocumentsByFolder;
