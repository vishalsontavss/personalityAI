
export type UserRole = 'patient' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  image: string;
  bio: string;
  rating?: number;
};

export type Appointment = {
  id: string;
  patientName: string;
  email: string;
  serviceId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  clinicalHistory?: string;
};

export type LogEntry = {
  id: string;
  appointmentId: string;
  patientName: string;
  type: 'Status Change' | 'Clinical History Added' | 'Doctor Updated';
  timestamp: string;
  adminName: string;
  details: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
};

export type AppConfig = {
  brandColor: string;
  secondaryColor: string;
  fontFamily: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
};
