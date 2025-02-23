import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, UserCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { User } from '../types';
import axios from '../utils/axios';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);

  useEffect(() => {
    axios.get('/users')
        .then(response => setUsers(response.data))
        .catch(console.error);
    axios.get('/appointments')
        .then(response => setAppointments(response.data))
        .catch(console.error);
  }, []);

  const toggleUserExpansion = (userId: string) => {
    setExpandedUsers(prev =>
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleOpenModal = (user?: User) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`/users/${userId}`)
          .then(() => {
            setUsers(users.filter(user => user.email !== userId));
            setAppointments(appointments.filter(apt => apt.userId.email !== userId));
          })
          .catch(console.error);
    }
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      axios.delete(`/appointments/${appointmentId}`)
          .then(() => setAppointments(appointments.filter(apt => apt._id !== appointmentId)))
          .catch(console.error);
    }
  };

  const handleUpdateUser = (user: User) => {
    if (window.confirm('Are you sure you want to update this user?')) {
      axios.put(`/users/${user.email}`)
          .then(() => {
            setUsers(users.map(u => (u.email === user.email ? user : u)));
            setIsModalOpen(false);
          })
          .catch(console.error);
    }
  };

  const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-gray-600">Manage system users and their appointments</p>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring focus:border-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filteredUsers.map(user => {
            const userAppointments = appointments.filter(apt => apt.userId.email === user.email);

            return (
                <div key={user._id} className="bg-white shadow-sm rounded-lg">
                  <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleUserExpansion(user._id)}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {expandedUsers.includes(user._id) ? <ChevronDown className="w-5 h-5 text-gray-400 mr-2" /> : <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />}
                        <UserCircle className="h-10 w-10 text-gray-400" />
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={e => { e.stopPropagation(); handleOpenModal(user); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDeleteUser(user.email); }} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedUsers.includes(user._id) && (
                      <div className="p-4 border-t bg-gray-100 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                          📅 Appointments
                        </h4>

                        {userAppointments.length > 0 ? (
                            userAppointments.map((apt) => (
                                <div key={apt._id}
                                     className="p-4 bg-white shadow-md rounded-lg mt-3 border border-gray-200">
                                  <div className="flex items-center justify-between">
                                      <div className="space-y-1">
                                          <p className="text-gray-700 font-medium">
                                              <span className="text-gray-500">👨‍⚕️ Doctor:</span> {apt.docId?.name}
                                          </p>
                                          <p className="text-gray-700 font-medium">
                                              <span className="text-gray-500">🩺 Category:</span> {apt.docId?.specialty}
                                          </p>
                                          <p className="text-gray-700 font-medium">
                                              <span className="text-gray-500">🏥 Hospital:</span> {apt.hospitalId?.name}
                                          </p>
                                          <p className="text-gray-700 font-medium">
                                              <span className="text-gray-500">📆 Date:</span> {apt.date?.split('T')[0]}
                                          </p>
                                          <p className="text-gray-700 font-medium">
                                              <span className="text-gray-500">⏰ Time:</span> {apt.time}
                                          </p>
                                          <p className="text-gray-700 font-medium">
                                              <span className="text-gray-500">💰 Fee:</span> LKR {apt.fee}
                                          </p>
                                      </div>

                                      <button
                                          onClick={() => handleDeleteAppointment(apt._id)}
                                          className="text-red-600 hover:text-red-800 transition duration-200 transform hover:scale-105"
                                    >
                                      ❌ Delete
                                    </button>
                                  </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No appointments found.</p>
                        )}
                      </div>
                  )}
                </div>
            );
          })}
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
                <form onSubmit={e => {
                  e.preventDefault();

                  if (editingUser) {
                    handleUpdateUser(editingUser);
                  }
                  // Handle form submission here
                  setIsModalOpen(false);
                }}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={editingUser ? editingUser.email : ''}
                        onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        disabled
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={editingUser ? editingUser.name : ''}
                        onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="text"
                        value={editingUser ? editingUser.phone : ''}
                        onChange={e => setEditingUser({...editingUser, phone: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}