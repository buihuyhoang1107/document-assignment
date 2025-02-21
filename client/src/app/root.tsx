import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FolderList from '../components/Folder/FolderList';
import GetDocumentsByFolder from '../components/listDocumentAssignment/GetDocumentsByFolder';

export function App() {

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<FolderList />}
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
