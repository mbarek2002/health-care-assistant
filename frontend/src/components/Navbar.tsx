import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, MessageSquare, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <h1 className="text-xl font-semibold text-foreground">HealthMate AI</h1>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/chat')}
              variant={location.pathname === '/chat' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
            <Button
              onClick={() => navigate('/documents')}
              variant={location.pathname === '/documents' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </Button>
            <Button
              onClick={() => navigate('/sleep-prediction')}
              variant={location.pathname === '/sleep-prediction' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">sleep discord prediction</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
