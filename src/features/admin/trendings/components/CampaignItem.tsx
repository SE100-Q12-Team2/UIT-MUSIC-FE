import React from 'react';

interface CampaignItemProps {
  id: number;
  name: string;
  impressions: string;
  clicks: string;
  status: string;
  statusClass: string;
  onEdit: () => void;
  onDelete?: () => void;
}

export const CampaignItem: React.FC<CampaignItemProps> = ({
  name,
  impressions,
  clicks,
  status,
  statusClass,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="campaign-item">
      <div className="campaign-item__info">
        <h3 className="campaign-item__name">{name}</h3>
        <div className="campaign-item__stats">
          <span className="campaign-item__impressions">{impressions}</span>
          <span className="campaign-item__separator">•</span>
          <span className="campaign-item__clicks">{clicks}</span>
        </div>
      </div>
      <div className="campaign-item__actions">
        <span className={`campaign-item__status ${statusClass}`}>
          {status}
        </span>
        <button className="campaign-item__edit-btn" onClick={onEdit}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        {onDelete && (
          <button className="campaign-item__delete-btn" onClick={onDelete}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
