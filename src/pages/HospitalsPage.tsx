import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Star, Clock, Calendar } from 'lucide-react';
import { Hospital, Doctor, HospitalDoctor, HospitalSpecialty } from '../types';
import Modal from '../components/Modal';
import { specialties } from '../data';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([
    {
      id: 1,
      name: "Central Medical Center",
      address: "123 Healthcare Ave, Medical District",
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=300&h=300",
      rating: 4.8,
      specialties: [
        {
          name: "Cardiology",
          doctors: [
            {
              id: 101,
              name: "Dr. Sarah Johnson",
              specialty: "Cardiology",
              image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
              experience: 12,
              rating: 4.8,
              hospitalFee: 2000,
              schedule: {
                days: ['Monday', 'Wednesday', 'Friday'],
                startTime: '09:00',
                endTime: '17:00'
              }
            }
          ]
        }
      ]
    }
  ]);

  const [doctors] = useState<Doctor[]>([
    {
      id: 101,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
      experience: 12,
      rating: 4.8
    },
    {
      id: 102,
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
      experience: 15,
      rating: 4.9
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    image: '',
    rating: 0,
    specialties: [] as HospitalSpecialty[]
  });

  const [currentSpecialty, setCurrentSpecialty] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState<{[key: string]: HospitalDoctor[]}>({});
  const [doctorSchedules, setDoctorSchedules] = useState<{[key: number]: {
      days: string[];
      startTime: string;
      endTime: string;
      fee: number;
    }}>({});

  const handleOpenModal = (hospital?: Hospital) => {
    if (hospital) {
      setEditingHospital(hospital);
      setFormData({
        name: hospital.name,
        address: hospital.address,
        image: hospital.image,
        rating: hospital.rating,
        specialties: hospital.specialties
      });
      const schedules: {[key: number]: any} = {};
      hospital.specialties.forEach(specialty => {
        specialty.doctors.forEach(doctor => {
          schedules[doctor.id] = {
            days: doctor.schedule.days,
            startTime: doctor.schedule.startTime,
            endTime: doctor.schedule.endTime,
            fee: doctor.hospitalFee
          };
        });
      });
      setDoctorSchedules(schedules);
      const selected: {[key: string]: HospitalDoctor[]} = {};
      hospital.specialties.forEach(specialty => {
        selected[specialty.name] = specialty.doctors;
      });
      setSelectedDoctors(selected);
    } else {
      setEditingHospital(null);
      setFormData({
        name: '',
        address: '',
        image: '',
        rating: 0,
        specialties: []
      });
      setDoctorSchedules({});
      setSelectedDoctors({});
    }
    setIsModalOpen(true);
  };

  const handleAddSpecialty = () => {
    if (!currentSpecialty) return;

    const existingDoctors = selectedDoctors[currentSpecialty] || [];
    setFormData(prev => ({
      ...prev,
      specialties: [
        ...prev.specialties,
        {
          name: currentSpecialty,
          doctors: existingDoctors
        }
      ]
    }));
    setCurrentSpecialty('');
  };

  const handleRemoveSpecialty = (specialtyName: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s.name !== specialtyName)
    }));
    const newSelectedDoctors = { ...selectedDoctors };
    delete newSelectedDoctors[specialtyName];
    setSelectedDoctors(newSelectedDoctors);
  };

  const handleDoctorSelection = (specialty: string, doctor: Doctor, checked: boolean) => {
    const schedule = doctorSchedules[doctor.id] || {
      days: [],
      startTime: '09:00',
      endTime: '17:00',
      fee: 0
    };

    setSelectedDoctors(prev => {
      const updated = { ...prev };
      if (!updated[specialty]) {
        updated[specialty] = [];
      }

      if (checked) {
        updated[specialty] = [
          ...updated[specialty],
          {
            ...doctor,
            hospitalFee: schedule.fee,
            schedule: {
              days: schedule.days,
              startTime: schedule.startTime,
              endTime: schedule.endTime
            }
          }
        ];
      } else {
        updated[specialty] = updated[specialty].filter(d => d.id !== doctor.id);
      }

      return updated;
    });

    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.map(s =>
          s.name === specialty
              ? { ...s, doctors: selectedDoctors[specialty] || [] }
              : s
      )
    }));
  };

  const handleScheduleChange = (doctorId: number, field: string, value: any) => {
    setDoctorSchedules(prev => ({
      ...prev,
      [doctorId]: {
        ...prev[doctorId],
        [field]: value
      }
    }));

    // Update the schedule in selectedDoctors
    setSelectedDoctors(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(specialty => {
        updated[specialty] = updated[specialty].map(doctor =>
            doctor.id === doctorId
                ? {
                  ...doctor,
                  hospitalFee: field === 'fee' ? value : doctor.hospitalFee,
                  schedule: field === 'fee'
                      ? doctor.schedule
                      : {
                        ...doctor.schedule,
                        [field]: value
                      }
                }
                : doctor
        );
      });
      return updated;
    });
  };

  const handleDayToggle = (doctorId: number, day: string) => {
    const currentSchedule = doctorSchedules[doctorId] || {
      days: [],
      startTime: '09:00',
      endTime: '17:00',
      fee: 0
    };

    const newDays = currentSchedule.days.includes(day)
        ? currentSchedule.days.filter(d => d !== day)
        : [...currentSchedule.days, day];

    handleScheduleChange(doctorId, 'days', newDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHospital) {
      setHospitals(hospitals.map(h =>
          h.id === editingHospital.id
              ? { ...editingHospital, ...formData }
              : h
      ));
    } else {
      const newHospital: Hospital = {
        id: Date.now(),
        ...formData
      };
      setHospitals([...hospitals, newHospital]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      setHospitals(hospitals.filter(hospital => hospital.id !== id));
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hospitals</h1>
            <p className="mt-1 text-gray-600">Manage healthcare facilities</p>
          </div>
          <button
              onClick={() => handleOpenModal()}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Hospital
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {filteredHospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-full md:w-48 h-48 object-cover"
                  />
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                        <div className="flex items-center mt-1 text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <p className="text-sm">{hospital.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{hospital.rating}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties & Doctors</h4>
                      <div className="space-y-2">
                        {hospital.specialties.map((specialty) => (
                            <div key={specialty.name} className="border rounded-lg p-2">
                              <div className="font-medium text-sm text-blue-600">{specialty.name}</div>
                              <div className="mt-1 space-y-1">
                                {specialty.doctors.map((doctor) => (
                                    <div key={doctor.id} className="text-sm">
                                      <div className="flex justify-between items-center text-gray-600">
                                        <span>{doctor.name}</span>
                                        <span className="text-gray-500">Fee: ${doctor.hospitalFee}</span>
                                      </div>
                                      <div className="mt-1 flex items-center text-gray-500 text-xs">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span>{doctor.schedule.days.join(', ')}</span>
                                        <Clock className="w-3 h-3 ml-2 mr-1" />
                                        <span>{doctor.schedule.startTime} - {doctor.schedule.endTime}</span>
                                      </div>
                                    </div>
                                ))}
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                          onClick={() => handleOpenModal(hospital)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                          onClick={() => handleDelete(hospital.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Specialties and Doctors</h4>

              <div className="flex gap-2 mb-4">
                <select
                    value={currentSpecialty}
                    onChange={(e) => setCurrentSpecialty(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Specialty</option>
                  {specialties
                      .filter(s => !formData.specialties.find(fs => fs.name === s))
                      .map((specialty) => (
                          <option key={specialty} value={specialty}>
                            {specialty}
                          </option>
                      ))}
                </select>
                <button
                    type="button"
                    onClick={handleAddSpecialty}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              <div className="space-y-4">
                {formData.specialties.map((specialty) => (
                    <div key={specialty.name} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-gray-900">{specialty.name}</h5>
                        <button
                            type="button"
                            onClick={() => handleRemoveSpecialty(specialty.name)}
                            className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        {doctors
                            .filter(doctor => doctor.specialty === specialty.name)
                            .map((doctor) => {
                              const isSelected = selectedDoctors[specialty.name]?.some(d => d.id === doctor.id);
                              const schedule = doctorSchedules[doctor.id] || {
                                days: [],
                                startTime: '09:00',
                                endTime: '17:00',
                                fee: 0
                              };

                              return (
                                  <div key={doctor.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => handleDoctorSelection(specialty.name, doctor, e.target.checked)}
                                            className="mr-2"
                                        />
                                        <span className="font-medium">{doctor.name}</span>
                                      </div>
                                    </div>

                                    {isSelected && (
                                        <div className="space-y-4 pl-6">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Consultation Fee
                                            </label>
                                            <input
                                                type="number"
                                                value={schedule.fee}
                                                onChange={(e) => handleScheduleChange(doctor.id, 'fee', Number(e.target.value))}
                                                className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Available Days
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                              {DAYS_OF_WEEK.map(day => (
                                                  <label key={day} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={schedule.days.includes(day)}
                                                        onChange={() => handleDayToggle(doctor.id, day)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">{day}</span>
                                                  </label>
                                              ))}
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Start Time
                                              </label>
                                              <input
                                                  type="time"
                                                  value={schedule.startTime}
                                                  onChange={(e) => handleScheduleChange(doctor.id, 'startTime', e.target.value)}
                                                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                End Time
                                              </label>
                                              <input
                                                  type="time"
                                                  value={schedule.endTime}
                                                  onChange={(e) => handleScheduleChange(doctor.id, 'endTime', e.target.value)}
                                                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                    )}
                                  </div>
                              );
                            })}
                      </div>
                    </div>
                ))}
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              >
                {editingHospital ? 'Update Hospital' : 'Add Hospital'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
  );
}