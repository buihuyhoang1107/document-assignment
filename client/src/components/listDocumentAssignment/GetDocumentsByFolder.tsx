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
} from '@mui/material';
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
  const [error, setError] = useState<string | null>(null);
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp); // Tạo đối tượng Date từ timestamp
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

  const handleEdit = (docId: string) => {
    console.log(`Edit document with id: ${docId}`);
    // Thêm logic để chỉnh sửa tài liệu
  };

  const handleDelete = (docId: string) => {
    console.log(`Delete document with id: ${docId}`);
    // Thêm logic để xóa tài liệu
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>FolderId</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>UpdatedAt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={1}>No documents found.</TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.folderId}</TableCell>
                  <TableCell>{doc.content}</TableCell>
                  <TableCell>{formatTimestamp(doc.createdAt)}</TableCell>
                  <TableCell>{formatTimestamp(doc.updatedAt)}</TableCell>
                  <TableCell>
                    {/* View Button */}
                    <IconButton
                      onClick={() => handleView(doc.id)}
                      color="primary"
                    >
                      {/* <VisibilityIcon /> */}
                      view
                    </IconButton>
                    {/* Edit Button */}
                    <IconButton
                      onClick={() => handleEdit(doc.id)}
                      color="primary"
                    >
                      {/* <EditIcon /> */}
                      edit
                    </IconButton>
                    {/* Delete Button */}
                    <IconButton
                      onClick={() => handleDelete(doc.id)}
                      color="secondary"
                    >
                      {/* <DeleteIcon /> */}
                      delete
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GetDocumentsByFolder;
