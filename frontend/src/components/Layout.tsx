import { Home, Plus, Calendar, Inbox } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Home size={24} className="text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ImmoApp</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/visits"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname.startsWith('/visits')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar size={20} />
                <span className="font-medium">Visites</span>
              </Link>

              <Link
                to="/visit-requests"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/visit-requests'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Inbox size={20} />
                <span className="font-medium">Demandes</span>
              </Link>

              {location.pathname === '/' && (
                <Link
                  to="/properties/new"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus size={20} />
                  Ajouter un bien
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2024 ImmoApp - Gestion Immobilière & Visites
          </p>
        </div>
      </footer>
    </div>
  );
}