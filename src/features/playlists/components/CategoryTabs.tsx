import React from 'react';

interface CategoryTab {
  id: string;
  label: string;
  image: string;
}

interface CategoryTabsProps {
  categories: CategoryTab[];
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
}) => {
  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-tab ${activeCategory === category.id ? 'category-tab--active' : ''}`}
          onClick={() => onCategoryClick?.(category.id)}
        >
          <div className="category-tab__image-wrapper">
            <img
              src={category.image}
              alt={category.label}
              className="category-tab__image"
            />
            <div className="category-tab__overlay" />
          </div>
          <span className="category-tab__label">{category.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
