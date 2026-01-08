
import { Service, Doctor, Article, AppConfig } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Clinical Assessment',
    description: 'Comprehensive evaluation using AI-driven diagnostics for diagnostic clarity.',
    price: '₹15,000',
    icon: 'Brain'
  },
  {
    id: 's2',
    name: 'Cognitive Behavioral Therapy',
    description: 'Evidence-based therapy focusing on changing destructive thought patterns.',
    price: '₹4,500/session',
    icon: 'MessageSquare'
  },
  {
    id: 's3',
    name: 'Family Counseling',
    description: 'Specialized support for families navigating personality disorder diagnoses.',
    price: '₹6,000/session',
    icon: 'Users'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Ramakant Gadiwan',
    specialty: 'Psychological Health Care Counselling & Hypnotherapy Centre (Certified UK & USA)',
    image: 'https://picsum.photos/seed/drgadiwan/400/400',
    bio: 'Lead specialist in advanced personality diagnostics and therapeutic hypnotherapy. Internationally certified expert bridging clinical practice and technological innovation.',
    rating: 5.0
  },
  {
    id: 'd2',
    name: 'Dr. Sarah Mitchell',
    specialty: 'Lead Psychiatrist & AI Specialist',
    image: 'https://picsum.photos/seed/doc1/400/400',
    bio: 'Pioneer in utilizing machine learning for early detection of Cluster B disorders.',
    rating: 4.8
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'Understanding Borderline Personality Disorder',
    excerpt: 'Identifying early signs and effective management strategies for BPD.',
    content: 'Long form content goes here...',
    date: 'Oct 12, 2023',
    category: 'Education',
    image: 'https://picsum.photos/seed/art1/800/400'
  },
  {
    id: 'a2',
    title: 'The Role of AI in Mental Health',
    excerpt: 'How data-driven insights are revolutionizing clinical psychiatry.',
    content: 'Long form content goes here...',
    date: 'Nov 05, 2023',
    category: 'Technology',
    image: 'https://picsum.photos/seed/art2/800/400'
  }
];

export const DEFAULT_CONFIG: AppConfig = {
  brandColor: '#0f172a',
  secondaryColor: '#3b82f6',
  fontFamily: 'Inter',
  socialLinks: {
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  }
};
