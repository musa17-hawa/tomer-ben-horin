import { useState } from 'react'
import './App.css'
import ArtistListView from './components/ArtistListView'
import ArtistDetailView from './components/ArtistDetailView'
import LoginForm from './components/LoginForm'

function App() {
  const [currentView, setCurrentView] = useState('artists'); // 'artists', 'details', 'login'
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Function to switch between views
  const navigateTo = (view, artist = null) => {
    setCurrentView(view);
    if (artist) {
      setSelectedArtist(artist);
    }
  };

  // Handle artist edit click
  const handleEditArtist = (artist) => {
    setSelectedArtist(artist);
    navigateTo('details');
  };

  // Render the appropriate view
  const renderView = () => {
    switch (currentView) {
      case 'artists':
        return <ArtistListView onEditClick={handleEditArtist} />;
      case 'details':
        return <ArtistDetailView artist={selectedArtist} onBack={() => navigateTo('artists')} />;
      case 'login':
        return <LoginForm />;
      default:
        return <ArtistListView onEditClick={handleEditArtist} />;
    }
  };

  return (
    <div className="app-container">
      <nav className="app-navigation">
        <button 
          className={`nav-button ${currentView === 'artists' ? 'active' : ''}`}
          onClick={() => navigateTo('artists')}
        >
          Artists
        </button>
        <button 
          className={`nav-button ${currentView === 'login' ? 'active' : ''}`}
          onClick={() => navigateTo('login')}
        >
          Login
        </button>
      </nav>
      
      <main className="app-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App