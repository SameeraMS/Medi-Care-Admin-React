import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Star, Clock, Calendar } from 'lucide-react';
import { Hospital, Doctor, DocHospital } from '../types';
import Modal from '../components/Modal';
import { specialties } from '../data';
import axios from '../utils/axios';

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
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [dochospitals, setDochospitals] = useState<DocHospital[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    image: '',
    rating: 0,
    specialties: [] as { name: string; doctors: Doctor[] }[]
  });

  const [currentSpecialty, setCurrentSpecialty] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState<{ [key: string]: Doctor[] }>({});
  const [doctorSchedules, setDoctorSchedules] = useState<{ [key: string]: {
      days: string[];
      startTime: string;
      endTime: string;
      fee: number;
    }}>({});

  // Fetch hospitals, doctors, and dochospitals on component mount
  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
    fetchDochospitals();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchDochospitals = async () => {
    try {
      const response = await axios.get('/dochospitals');
      setDochospitals(response.data);
    } catch (error) {
      console.error('Error fetching dochospitals:', error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('/hospitals');
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const getHospitalSpecialties = (hospitalId: string) => {
    const hospitalDoctors = dochospitals.filter((dh) => dh.hospitalId._id === hospitalId);

    const specialtiesMap = new Map<string, Doctor[]>();

    hospitalDoctors.forEach((dh) => {
      if (!specialtiesMap.has(dh.category)) {
        specialtiesMap.set(dh.category, []);
      }

      const doctor = doctors.find((d) => d._id === dh.docId._id);
      if (doctor) {
        specialtiesMap.get(dh.category)?.push({
          ...doctor,
          hospitalFee: dh.fee,
          schedule: {
            days: dh.days,
            startTime: dh.timeStart,
            endTime: dh.timeEnd,
          },
        });
      }
    });

    return Array.from(specialtiesMap.entries()).map(([category, doctors]) => ({
      name: category,
      doctors,
    }));
  };

  const handleOpenModal = (hospital?: Hospital) => {
    if (hospital) {
      setEditingHospital(hospital);

      const specialties = getHospitalSpecialties(hospital._id);

      setFormData({
        name: hospital.name,
        location: hospital.location,
        image: hospital.image,
        rating: hospital.rating,
        specialties: specialties || []
      });

      const schedules: { [key: string]: any } = {};
      const selected: { [key: string]: Doctor[] } = {};

      specialties.forEach(specialty => {
        selected[specialty.name] = specialty.doctors;
        specialty.doctors.forEach(doctor => {
          schedules[doctor._id] = {
            days: doctor.schedule?.days || [],
            startTime: doctor.schedule?.startTime || '09:00',
            endTime: doctor.schedule?.endTime || '17:00',
            fee: doctor.hospitalFee || 0
          };
        });
      });

      setDoctorSchedules(schedules);
      setSelectedDoctors(selected);
    } else {
      setEditingHospital(null);
      setFormData({
        name: '',
        location: '',
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
    const schedule = doctorSchedules[doctor._id] || {
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
        updated[specialty] = updated[specialty].filter(d => d._id !== doctor._id);
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

  const handleScheduleChange = (doctorId: string, field: string, value: any) => {
    setDoctorSchedules(prev => ({
      ...prev,
      [doctorId]: {
        ...prev[doctorId],
        [field]: value
      }
    }));

    setSelectedDoctors(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(specialty => {
        updated[specialty] = updated[specialty].map(doctor =>
            doctor._id === doctorId
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

  const handleDayToggle = (doctorId: string, day: string) => {
    const schedule = doctorSchedules[doctorId] || {
      days: [],
      startTime: '09:00',
      endTime: '17:00',
      fee: 0
    };

    const newDays = schedule.days.includes(day)
        ? schedule.days.filter(d => d !== day)
        : [...schedule.days, day];

    handleScheduleChange(doctorId, 'days', newDays);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let hospitalId;
      if (editingHospital) {
        const response = await axios.put(`/hospitals/${editingHospital._id}`, formData);
        hospitalId = response.data._id;
      } else {
        const response = await axios.post('/hospitals', formData);
        hospitalId = response.data._id;

        console.log(formData.specialties)
        for (const specialty of formData.specialties) {
          for (const doctor of specialty.doctors) {
            const docHospitalData = {
              hospitalId: hospitalId,
              category: specialty.name,
              docId: doctor._id,
              fee: doctor.hospitalFee,
              days: doctor.schedule.days,
              timeStart: doctor.schedule.startTime,
              timeEnd: doctor.schedule.endTime
            };

            try {
              await axios.post('/dochospitals', docHospitalData);
            } catch (err) {
              console.error('Error saving doctor-hospital association:', err);
            }
          }
        }
      }

      fetchHospitals();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving hospital:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      try {
        await axios.delete(`/hospitals/${id}`);
        fetchHospitals();
      } catch (error) {
        console.error('Error deleting hospital:', error);
      }
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Plus className="w-4 h-4 mr-2"/>
            Add Hospital
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
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
          {filteredHospitals.map((hospital) => {
            const specialties = getHospitalSpecialties(hospital._id);

            return (
                <div key={hospital._id}
                     className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                            <MapPin className="w-4 h-4 mr-1"/>
                            <p className="text-sm">{hospital.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1"/>
                          <span className="text-sm font-medium">{hospital.rating}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties & Doctors</h4>
                        <div className="space-y-2">
                          {specialties.map((specialty) => (
                              <div key={specialty.name} className="border rounded-lg p-2">
                                <div className="font-medium text-sm text-blue-600">{specialty.name}</div>
                                <div className="mt-1 space-y-1">
                                  {specialty.doctors.map((doctor) => (
                                      <div key={doctor._id} className="text-sm">
                                        <div className="flex justify-between items-center text-gray-600">
                                          <span>{doctor.name}</span>
                                          <span className="text-gray-500">Fee: ${doctor.hospitalFee}</span>
                                        </div>
                                        <div className="mt-1 flex items-center text-gray-500 text-xs">
                                          <Calendar className="w-3 h-3 mr-1"/>
                                          <span>{doctor.schedule.days.join(', ')}</span>
                                          <Clock className="w-3 h-3 ml-2 mr-1"/>
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
                          <Edit2 className="w-4 h-4"/>
                        </button>
                        <button
                            onClick={() => handleDelete(hospital._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            );
          })}
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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
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
                              const isSelected = selectedDoctors[specialty.name]?.some(d => d._id === doctor._id);
                              const schedule = doctorSchedules[doctor._id] || {
                                days: [],
                                startTime: '09:00',
                                endTime: '17:00',
                                fee: 0
                              };

                              return (
                                  <div key={doctor._id} className="border rounded-lg p-4">
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
                                              Available Days
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                              {DAYS_OF_WEEK.map(day => (
                                                  <label key={day} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={(schedule.days || []).includes(day)}
                                                        onChange={() => handleDayToggle(doctor._id, day)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">{day}</span>
                                                  </label>
                                              ))}
                                            </div>
                                          </div>

                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Consultation Fee
                                            </label>
                                            <input
                                                type="number"
                                                value={schedule.fee}
                                                onChange={(e) => handleScheduleChange(doctor._id, 'fee', e.target.value)}
                                                className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Start Time
                                              </label>
                                              <input
                                                  type="time"
                                                  value={schedule.startTime}
                                                  onChange={(e) => handleScheduleChange(doctor._id, 'startTime', e.target.value)}
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
                                                  onChange={(e) => handleScheduleChange(doctor._id, 'endTime', e.target.value)}
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