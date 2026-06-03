import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-container z-index-up">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search city (e.g. London, Tokyo, Paris)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <Search className="search-icon-left" size={20} />
      </div>
      <button type="submit" className="search-button" disabled={loading}>
        <MapPin size={18} />
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
