import React from 'react';
import { Category } from '../types';
import DoctorCard from './DoctorCard';
import * as Icons from 'lucide-react';

interface CategorySectionProps {
  category: Category;
  onEditDoctor: (doctor: any) => void;
  onDeleteDoctor: (id: number) => void;
}

export default function CategorySection({ category, onEditDoctor, onDeleteDoctor }: CategorySectionProps) {
  const IconComponent = (Icons as any)[category.icon] || Icons.Medical;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <IconComponent className="w-6 h-6 mr-2 text-blue-600" />
        <h2 className="text-2xl font-semibold">{category.name}</h2>
      </div>
      <p className="text-gray-600 mb-4">{category.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onEdit={onEditDoctor}
            onDelete={onDeleteDoctor}
          />
        ))}
      </div>
    </div>
  );
}