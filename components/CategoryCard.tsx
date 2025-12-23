
import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  icon: string;
  color: string;
  onSelect: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, icon, color, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(category)}
      className={`relative group overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center gap-4 ${color} text-white`}
    >
      <div className="text-5xl group-hover:scale-125 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-center">{category}</h3>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );
};

export default CategoryCard;
