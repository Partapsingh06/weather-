import React from 'react';
import { History, X } from 'lucide-react';

export default function SearchHistory({ history, onSelect, onRemove }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="history-section z-index-up">
      <div className="history-title">
        <History size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
        Recent:
      </div>
      <div className="history-list">
        {history.map((city) => (
          <span
            key={city}
            className="history-pill"
            onClick={() => onSelect(city)}
          >
            {city}
            <button
              type="button"
              className="history-pill-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(city);
              }}
              title={`Remove ${city}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
