import React from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: number) => void;
}

export default function DoctorCard({ doctor, onEdit, onDelete }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="relative">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="absolute top-2 right-2 space-x-2">
          <button
            onClick={() => onEdit(doctor)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(doctor.id)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{doctor.name}</h3>
      <p className="text-gray-600 mb-2">{doctor.specialty}</p>
      <div className="flex items-center mb-2">
        <Star className="w-4 h-4 text-yellow-400 mr-1" />
        <span>{doctor.rating}</span>
        <span className="mx-2">•</span>
        <span>{doctor.experience} years exp.</span>
      </div>
      <p className="text-gray-800 font-semibold">
        ${doctor.consultationFee} / consultation
      </p>
    </div>
  );
}