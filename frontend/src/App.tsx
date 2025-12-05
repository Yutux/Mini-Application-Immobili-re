import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PropertyFormPage from './pages/PropertyFormPage';
import VisitsPage from './pages/VisitsPage';
import VisitFormPage from './pages/VisitFormPage';
import VisitRequestsPage from './pages/VisitRequestsPage';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Properties */}
          <Route path="/" element={<HomePage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/properties/new" element={<PropertyFormPage />} />
          <Route path="/properties/:id/edit" element={<PropertyFormPage />} />
          
          {/* Visits */}
          <Route path="/visits" element={<VisitsPage />} />
          <Route path="/visits/new" element={<VisitFormPage />} />
          <Route path="/visits/:id/edit" element={<VisitFormPage />} />
          
          {/* Visit Requests */}
          <Route path="/visit-requests" element={<VisitRequestsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;