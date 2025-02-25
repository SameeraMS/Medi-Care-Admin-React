import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Doctor } from '../types';
import Modal from '../components/Modal';
import { specialties } from '../data';
import axios from '../utils/axios';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    experience: 0,
    rating: 0,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleOpenModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        specialty: doctor.specialty,
        image: doctor.image,
        experience: doctor.experience,
        rating: doctor.rating,
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        specialty: specialties[0],
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
        experience: 0,
        rating: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await axios.put(`/doctors/${editingDoctor._id}`, formData);
      } else {
        await axios.post('/doctors', formData);
      }
      setIsModalOpen(false);
      fetchDoctors(); // Refresh doctors list
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await axios.delete(`/doctors/${id}`);
        setDoctors(doctors.filter((doctor) => doctor._id !== id));
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const filteredDoctors = doctors.filter(
      (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
            <p className="mt-1 text-gray-600">Manage your medical professionals</p>
          </div>
          <button
              onClick={() => handleOpenModal()}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Doctor
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialty}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>{doctor.experience} years experience</span>
                    <span className="mx-2">•</span>
                    <span>Rating: {doctor.rating}</span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={() => handleOpenModal(doctor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(doctor._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialty</label>
              <select value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input type="number" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">{editingDoctor ? 'Update Doctor' : 'Add Doctor'}</button>
          </form>
        </Modal>
      </div>
  );
}
