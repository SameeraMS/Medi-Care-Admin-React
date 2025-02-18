export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  password: string;
  role: 'admin' | 'doctor' | 'user';
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  experience: number;
  rating: number;
}

export interface Hospital {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
}

export interface DocHospital {
  id: number;
  hospitalId: string;
  category: string;
  docId: string;
  fee: number;
  days: string[];
  timeStart: string;
  timeEnd: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
  doctors: Doctor[];
}

export interface Appointment {
  id: number;
  userId: number;
  doctorId: number;
  doctorName: string;
  hospitalId: number;
  hospitalName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up';
  fee: number;
}