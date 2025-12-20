import React from 'react';
import { Play } from 'lucide-react';

export interface FeaturedItem {
  id: number;
  title: string;
  artist: string;
  coverImage: string;
}

interface FeaturedCardProps {
  item: FeaturedItem;
  onClick?: (item: FeaturedItem) => void;
  onPlay?: (item: FeaturedItem) => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  item,
  onClick,
  onPlay,
}) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(item);
  };

  return (
    <div className="featured-card" onClick={() => onClick?.(item)}>
      <div className="featured-card__image-wrapper">
        <img
          src={item.coverImage}
          alt={item.title}
          className="featured-card__image"
        />
      </div>
      <div className="featured-card__info">
        <h3 className="featured-card__title">{item.title}</h3>
        <span className="featured-card__artist">{item.artist}</span>
      </div>
      <button className="featured-card__play" onClick={handlePlayClick}>
        <Play size={24} fill="#000" stroke="#000" />
      </button>
    </div>
  );
};

export default FeaturedCard;
