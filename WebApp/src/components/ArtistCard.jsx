import React from 'react';
import './ArtistCard.css';

function ArtistCard({ artist, onEditClick }) {
  const { name, bio, email, profileImage } = artist;

  return (
    <div className="artist-card">
      <div className="artist-header">
        <div className="artist-image">
          {profileImage ? (
            <img src={profileImage} alt={`${name}'s profile`} />
          ) : (
            <div className="placeholder-image">{name.charAt(0)}</div>
          )}
        </div>
        <h3 className="artist-name">{name}</h3>
      </div>
      <p className="artist-bio">{bio || "No bio available"}</p>
      <div className="artist-email">{email}</div>
      <button 
        className="edit-button" 
        onClick={() => onEditClick(artist)}
      >
        Edit Artist Profile
      </button>
    </div>
  );
}

export default ArtistCard;