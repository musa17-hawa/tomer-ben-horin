import React, { useState } from 'react';

const mockArtists = [
  { name: 'אמן 1', exhibitions: 4 },
  { name: 'אמן 2', exhibitions: 2 },
  { name: 'אמן 3', exhibitions: 5 },
  { name: 'אמן 4', exhibitions: 1 },
  { name: 'אמן 5', exhibitions: 3 },
];

function ArtistsPage() {
  const [search, setSearch] = useState('');
  const filteredArtists = mockArtists.filter(artist => artist.name.includes(search));
  return (
    <div className="dashboard-root">
      <div className="dashboard-actions">
        <input
          className="dashboard-search"
          type="text"
          placeholder="חפש לפי שם אמן"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="dashboard-cards">
        {filteredArtists.map((artist, idx) => (
          <div key={idx} className="card-root" style={{ minWidth: 220, maxWidth: 260, margin: 8 }}>
            <div className="card-header">
              <span className="card-title">{artist.name}</span>
              <span className="card-count">{artist.exhibitions} תערוכות</span>
            </div>
            <button className="card-btn edit">עריכה</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtistsPage; 