import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, UserCircle, Calendar, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';
import { User, Appointment } from '../types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      password: "********",
      role: 'user'
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234 567 8901",
      password: "********",
      role: 'user'
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      userId: 1,
      doctorId: 101,
      doctorName: "Dr. Sarah Johnson",
      hospitalId: 1,
      hospitalName: "Central Medical Center",
      date: "2024-03-15",
      time: "10:00",
      status: "scheduled",
      type: "consultation",
      fee: 1500
    },
    {
      id: 2,
      userId: 1,
      doctorId: 102,
      doctorName: "Dr. Michael Chen",
      hospitalId: 1,
      hospitalName: "Central Medical Center",
      date: "2024-03-20",
      time: "14:30",
      status: "completed",
      type: "follow-up",
      fee: 1000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<number[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState<'scheduled' | 'completed'>('scheduled');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [appointmentFormData, setAppointmentFormData] = useState({
    date: '',
    time: '',
    status: 'scheduled',
    type: 'consultation'
  });

  const toggleUserExpansion = (userId: number) => {
    setExpandedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenAppointmentModal = (userId: number, appointment?: Appointment) => {
    setSelectedUserId(userId);
    if (appointment) {
      setEditingAppointment(appointment);
      setAppointmentFormData({
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        type: appointment.type
      });
    } else {
      setEditingAppointment(null);
      setAppointmentFormData({
        date: '',
        time: '',
        status: 'scheduled',
        type: 'consultation'
      });
    }
    setIsAppointmentModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...editingUser, ...formData }
          : u
      ));
    } else {
      const newUser: User = {
        id: Date.now(),
        ...formData,
        role: 'user'
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAppointment) {
      setAppointments(appointments.map(a => 
        a.id === editingAppointment.id
          ? { ...editingAppointment, ...appointmentFormData }
          : a
      ));
    }
    setIsAppointmentModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      setAppointments(appointments.filter(apt => apt.userId !== id));
    }
  };

  const handleDeleteAppointment = (appointmentId: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserAppointments = (userId: number) => {
    return appointments.filter(apt => 
      apt.userId === userId && 
      apt.status === appointmentFilter
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-gray-600">Manage system users and their appointments</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleUserExpansion(user.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {expandedUsers.includes(user.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <UserCircle className="h-10 w-10 text-gray-400" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <div className="text-sm text-gray-500">
                      <p>{user.email}</p>
                      <p>{user.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(user);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {expandedUsers.includes(user.id) && (
              <div className="border-t">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Appointments</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setAppointmentFilter('scheduled')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          appointmentFilter === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Scheduled
                      </button>
                      <button
                        onClick={() => setAppointmentFilter('completed')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          appointmentFilter === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {getUserAppointments(user.id).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <div className="flex items-center text-gray-900">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{appointment.date}</span>
                            <Clock className="w-4 h-4 ml-4 mr-2" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium">{appointment.doctorName}</p>
                            <p className="text-sm text-gray-500">{appointment.hospitalName}</p>
                          </div>
                          <div className="mt-1 flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">{appointment.type}</span>
                            <span className="ml-2 text-sm font-medium">${appointment.fee}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenAppointmentModal(user.id, appointment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {getUserAppointments(user.id).length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        No {appointmentFilter} appointments found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        title={editingAppointment ? 'Edit Appointment' : 'Add Appointment'}
      >
        <form onSubmit={handleAppointmentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={appointmentFormData.date}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={appointmentFormData.time}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, time: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={appointmentFormData.status}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, status: e.target.value as 'scheduled' | 'completed' | 'cancelled' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={appointmentFormData.type}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, type: e.target.value as 'consultation' | 'follow-up' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              {editingAppointment ? 'Update Appointment' : 'Add Appointment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}