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

export interface DoctorSchedule {
  days: string[];
  startTime: string;
  endTime: string;
}

export interface HospitalDoctor extends Doctor {
  hospitalFee: number;
  schedule: DoctorSchedule;
}

export interface HospitalSpecialty {
  name: string;
  doctors: HospitalDoctor[];
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  image: string;
  rating: number;
  specialties: HospitalSpecialty[];
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