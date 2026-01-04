import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Activity {
  id: number;
  title: string;
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="recent-activity">
      <div className="recent-activity__header">
        <h2 className="recent-activity__title">Recent Activity</h2>
      </div>
      <div className="recent-activity__list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-item__indicator" />
            <div className="activity-item__content">
              <div className="activity-item__title">{activity.title}</div>
              <div className="activity-item__description">{activity.description}</div>
              <div className="activity-item__time">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: vi })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
