import { Navigate, Route, Routes } from 'react-router-dom';

import { AdminCmsPage } from '@/pages/admin-cms-page';
import { HomePage } from '@/pages/home-page';

function App() {
  const editorEnabled = import.meta.env.DEV;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={editorEnabled ? <AdminCmsPage /> : <Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to={editorEnabled ? '/admin' : '/'} replace />} />
      <Route path="/__dev_login" element={<Navigate to={editorEnabled ? '/admin' : '/'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
