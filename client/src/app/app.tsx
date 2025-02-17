import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FolderList from '../components/Folder/FolderList';
import { useState } from 'react';
import GetDocumentsByFolder from '../components/listDocumentAssignment/GetDocumentsByFolder';

export function App() {

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const handleFolderSelect = (id: string) => {
    setSelectedFolderId(id); 
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<FolderList onFolderSelect={handleFolderSelect} />}
        />
        <Route
          path="/folder/:id"
          element={<GetDocumentsByFolder />}
        />
      </Routes>
    </Router>
  );
}

export default App;
