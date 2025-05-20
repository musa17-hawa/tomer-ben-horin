import React, { useState, useEffect } from 'react';
import { getAllArtists, searchArtistsByName } from '../services/artistService';
import ArtistCard from './ArtistCard';
import './ArtistListView.css';

function ArtistListView() {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const artistsPerPage = 6;

  // Fetch artists from Firebase
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        console.log("Fetching artists...");
        
        // Get artists from Firebase
        const artistsData = await getAllArtists();
        console.log("Received artist data:", artistsData);
        
        if (artistsData && artistsData.length > 0) {
          console.log("Setting real artists data");
          setArtists(artistsData);
          setFilteredArtists(artistsData);
          setError(null);
        } else {
          console.log("No artists found in Firebase");
          setError("No artists found in the database");
          // Don't use dummy data - this will help diagnose the issue
          setArtists([]);
          setFilteredArtists([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching artists:', err);
        setError(`Failed to load artists: ${err.message}`);
        setLoading(false);
        setArtists([]);
        setFilteredArtists([]);
      }
    };

    fetchArtists();
  }, []);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!artists || artists.length === 0) {
        return; // Don't search if no artists
      }
      
      if (searchTerm.trim() === '') {
        setFilteredArtists(artists);
      } else {
        try {
          // Try to search using the service
          const searchResults = await searchArtistsByName(searchTerm);
          setFilteredArtists(searchResults);
        } catch (err) {
          console.error('Error searching artists:', err);
          // Fall back to client-side filtering
          const filtered = artists.filter(artist => 
            artist.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredArtists(filtered);
        }
      }
      setCurrentPage(1);
    };

    performSearch();
  }, [searchTerm, artists]);

  // Calculate pagination
  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = filteredArtists.slice(indexOfFirstArtist, indexOfLastArtist);
  const totalPages = Math.ceil(filteredArtists.length / artistsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle edit click
  const handleEditClick = (artist) => {
    // Navigate to ArtistDetailView
    console.log('Edit clicked for artist:', artist.id);
    // In a real application, this would navigate to the edit page
    // For example: history.push(`/artist/${artist.id}`);
    alert(`Edit clicked for artist: ${artist.name}`);
  };

  // Handle search button click
  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // The search is already handled by the useEffect above
  };

  return (
    <div className="artist-list-container">
      <h1 className="artist-management-title">Artist Management</h1>
      
      <div className="search-container">
        <div className="search-bar-wrapper">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search artists by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <p>Loading artists...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <p>Please check Firebase database configuration and make sure 'users' collection exists with artist data.</p>
        </div>
      ) : (
        <>
          <div className="artists-grid">
            {currentArtists.length > 0 ? (
              currentArtists.map(artist => (
                <ArtistCard 
                  key={artist.id} 
                  artist={artist} 
                  onEditClick={handleEditClick} 
                />
              ))
            ) : (
              <div className="no-results">
                <p>No artists found matching your search.</p>
              </div>
            )}
          </div>
          
          {filteredArtists.length > artistsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ArtistListView;