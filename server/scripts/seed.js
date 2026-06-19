import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Profile from '../src/models/Profile.js';
import Job from '../src/models/Job.js';
import Referral from '../src/models/Referral.js';
import MentorshipSession from '../src/models/MentorshipSession.js';
import Message from '../src/models/Message.js';
import Event from '../src/models/Event.js';
import Notification from '../src/models/Notification.js';
import Company from '../src/models/Company.js';
import Community from '../src/models/Community.js';
import Post from '../src/models/Post.js';
import Forum from '../src/models/Forum.js';

dotenv.config();

const usersData = [
  {
    name: 'Admin Controller',
    email: 'admin@university.edu',
    password: 'password123',
    role: 'admin',
    isApproved: true,
    isMentor: false,
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'Jane Doe',
    email: 'jane.doe@google.com',
    password: 'password123',
    role: 'alumni',
    isApproved: true,
    isMentor: true,
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'John Smith',
    email: 'john.smith@meta.com',
    password: 'password123',
    role: 'alumni',
    isApproved: true,
    isMentor: true,
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'Alice Johnson',
    email: 'alice.j@netflix.com',
    password: 'password123',
    role: 'alumni',
    isApproved: true,
    isMentor: true,
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'David Lee',
    email: 'david.lee@stripe.com',
    password: 'password123',
    role: 'alumni',
    isApproved: true,
    isMentor: false,
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.j@student.edu',
    password: 'password123',
    role: 'student',
    isApproved: true,
    isMentor: false,
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'Ryan Patel',
    email: 'ryan.p@student.edu',
    password: 'password123',
    role: 'student',
    isApproved: true,
    isMentor: false,
    profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop'
  },
  {
    name: 'Aishu',
    email: 'penmetsa6907@gmail.com',
    password: 'password123',
    role: 'student',
    isApproved: true,
    isMentor: false,
    profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digital_alumni';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Profile.deleteMany();
    await Job.deleteMany();
    await Referral.deleteMany();
    await MentorshipSession.deleteMany();
    await Message.deleteMany();
    await Event.deleteMany();
    await Notification.deleteMany();
    console.log('Database collections cleared.');

    // Insert Users (presave hooks will encrypt passwords)
    const users = [];
    for (const u of usersData) {
      const createdUser = await User.create(u);
      users.push(createdUser);
    }
    console.log('Dummy users inserted successfully.');

    const admin = users[0];
    const jane = users[1];
    const john = users[2];
    const alice = users[3];
    const david = users[4];
    const sarah = users[5];
    const ryan = users[6];
    const aishu = users[7];

    const profiles = [
      {
        user: admin._id,
        bio: 'Chief System Administrator for the Aditya Educational Institutions NEXORA Platform.',
        department: 'Information Technology',
        institution: 'Aditya Engineering College',
        location: 'Kakinada, AP'
      },
      {
        user: jane._id,
        bio: 'Senior Software Engineer at Google. Passionate about Distributed Systems, React, Node.js, and helping young Aditya students kickstart their tech careers.',
        graduationYear: 2018,
        department: 'Computer Science & Engineering',
        institution: 'Aditya Engineering College',
        company: 'Google',
        industry: 'Technology',
        skills: ['React', 'Node.js', 'System Design', 'Kubernetes', 'Go'],
        location: 'Mountain View, CA',
        experience: [
          {
            company: 'Google',
            role: 'Senior Software Engineer',
            from: '2021-08',
            to: '',
            current: true,
            description: 'Leading a team of 5 engineers in Google Cloud Platform infrastructure development.'
          },
          {
            company: 'Amazon',
            role: 'Software Engineer II',
            from: '2018-06',
            to: '2021-07',
            current: false,
            description: 'Developed scalable microservices for Alexa Smart Home services.'
          }
        ],
        education: [
          {
            school: 'Aditya Engineering College',
            degree: 'Bachelor of Technology',
            fieldOfStudy: 'Computer Science',
            year: 2018
          }
        ],
        achievements: ['Outstanding Alumni Award 2024', 'Google Tech Leader 2023'],
        projects: [
          {
            title: 'CloudFlow Orchestrator',
            description: 'An open-source workflow pipeline running on top of Kubernetes.',
            link: 'https://github.com/example/cloudflow'
          }
        ],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/jane-doe-mock',
          github: 'https://github.com/jane-doe-mock',
          twitter: 'https://twitter.com/jane-doe-mock'
        },
        badges: ['Gold Mentor', 'Core Alumnus', 'Top Recruiter'],
        rating: 4.8,
        connections: [aishu._id]
      },
      {
        user: john._id,
        bio: 'Product Manager at Meta. Specializing in VR/AR products and user growth mechanics. Open to mentor and refer Aditya students.',
        graduationYear: 2019,
        department: 'Electronics & Communication',
        institution: 'Aditya College of Engineering & Technology',
        company: 'Meta',
        industry: 'Social Networking',
        skills: ['Product Management', 'A/B Testing', 'Growth Hacking', 'User Research', 'Data Analysis'],
        location: 'New York, NY',
        experience: [
          {
            company: 'Meta',
            role: 'Product Manager',
            from: '2020-11',
            to: '',
            current: true,
            description: 'Driving growth initiatives for Horizon Worlds VR headsets.'
          }
        ],
        education: [
          {
            school: 'Aditya College of Engineering & Technology',
            degree: 'B.Tech with Minor in Management',
            fieldOfStudy: 'Electronics',
            year: 2019
          }
        ],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/john-smith-mock',
          github: '',
          twitter: 'https://twitter.com/john-smith-mock'
        },
        badges: ['Star Mentor', 'Career Advisor'],
        rating: 4.9,
        connections: [aishu._id]
      },
      {
        user: alice._id,
        bio: 'Senior UI/UX Engineer at Netflix. I build cinematic user interfaces that scale to millions of users. Let\'s make Aditya web profiles beautiful.',
        graduationYear: 2017,
        department: 'Computer Science & Engineering',
        institution: 'Aditya Global Business School',
        company: 'Netflix',
        industry: 'Streaming / Media',
        skills: ['UX Design', 'Three.js', 'Framer Motion', 'TailwindCSS', 'TypeScript'],
        location: 'Los Angeles, CA',
        experience: [
          {
            company: 'Netflix',
            role: 'Senior UI/UX Engineer',
            from: '2020-03',
            to: '',
            current: true,
            description: 'Re-designed streaming landing page, boosting sign-up conversion by 12%.'
          }
        ],
        education: [
          {
            school: 'Aditya Global Business School',
            degree: 'B.Sc. in Computer Science',
            fieldOfStudy: 'Design & Engineering',
            year: 2017
          }
        ],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/alice-j-mock',
          github: 'https://github.com/alice-j-mock'
        },
        badges: ['Design Guru', 'Featured Alumnus'],
        rating: 4.7,
        connections: [aishu._id]
      },
      {
        user: david._id,
        bio: 'Tech Lead at Stripe. Working on international payments and developer experience toolings. I post active job referrals here for Aditya graduates.',
        graduationYear: 2016,
        department: 'Information Technology',
        institution: 'Aditya Degree College',
        company: 'Stripe',
        industry: 'FinTech',
        skills: ['REST APIs', 'NodeJS', 'Security', 'Ruby', 'Payment Systems'],
        location: 'Seattle, WA',
        experience: [
          {
            company: 'Stripe',
            role: 'Tech Lead',
            from: '2019-10',
            to: '',
            current: true,
            description: 'Building developer SDKs and developer onboarding interfaces.'
          }
        ],
        education: [
          {
            school: 'Aditya Degree College',
            degree: 'B.Tech in CSE',
            fieldOfStudy: 'Computer Science',
            year: 2016
          }
        ],
        badges: ['Fintech Master', 'Sponsor'],
        rating: 0
      },
      {
        user: sarah._id,
        bio: 'Final year CS undergrad at Aditya interested in Full Stack Development, React, and Open Source. Looking for mentorship and referral opportunities.',
        graduationYear: 2026,
        department: 'Computer Science',
        institution: 'Aditya Engineering College',
        company: 'Aditya Student',
        industry: 'Higher Education',
        skills: ['React', 'JavaScript', 'HTML/CSS', 'Python'],
        location: 'Surampalem, AP',
        experience: [],
        education: [
          {
            school: 'Aditya Engineering College',
            degree: 'Bachelor of Technology',
            fieldOfStudy: 'Computer Science',
            year: 2026
          }
        ],
        socialLinks: {
          github: 'https://github.com/sarah-j-mock'
        },
        badges: ['Active Student'],
        rating: 0
      },
      {
        user: ryan._id,
        bio: 'Junior student majoring in Electronics at Aditya. Interested in Embedded Systems and IoT. Eager to connect with alumni in hardware.',
        graduationYear: 2027,
        department: 'Electronics',
        institution: 'Aditya College of Engineering & Technology',
        company: 'Aditya Student',
        industry: 'Higher Education',
        skills: ['C++', 'Arduino', 'IoT', 'Embedded Systems'],
        location: 'Surampalem, AP',
        experience: [],
        education: [
          {
            school: 'Aditya College of Engineering & Technology',
            degree: 'Bachelor of Technology',
            fieldOfStudy: 'Electronics',
            year: 2027
          }
        ],
        badges: ['Ambitious Student'],
        rating: 0
      },
      {
        user: aishu._id,
        bio: 'Final-year Computer Science student at Aditya Engineering College. Passionate about frontend engineering, 3D graphics (Three.js/R3F), and building premium user experiences. Eager to connect with mentors at Google/Netflix/Meta.',
        graduationYear: 2026,
        department: 'Computer Science & Engineering',
        institution: 'Aditya Engineering College',
        company: 'Student Intern',
        industry: 'Higher Education',
        skills: ['React', 'JavaScript', 'HTML/CSS', 'Three.js', 'React Three Fiber', 'Node.js'],
        location: 'Surampalem, AP',
        experience: [
          {
            company: 'TechCorp',
            role: 'Frontend Development Intern',
            from: '2025-05',
            to: '2025-07',
            current: false,
            description: 'Assisted in building responsive analytics dashboards using React, Framer Motion, and TailwindCSS. Optimized component render times by 15%.'
          }
        ],
        education: [
          {
            school: 'Aditya Engineering College',
            degree: 'Bachelor of Technology',
            fieldOfStudy: 'Computer Science',
            year: 2026
          }
        ],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/aishu-demo',
          github: 'https://github.com/aishu-demo'
        },
        badges: ['Active Contributor', 'ThreeJS Enthusiast'],
        rating: 0,
        connections: [jane._id, john._id, alice._id]
      }
    ];

    // Bulk write profiles
    for (const p of profiles) {
      await Profile.create(p);
    }
    console.log('Profiles mapped successfully.');

    // Seed Jobs
    const jobs = [
      {
        postedBy: jane._id,
        title: 'Software Engineer I (Cloud Infra)',
        company: 'Google',
        logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=150&auto=format&fit=crop',
        description: 'Join the Google Cloud infrastructure team. You will be responsible for scaling APIs, monitoring services, and writing efficient Kubernetes plugins. Great entry point for fresh graduates.',
        salary: '$120,000 - $145,000',
        location: 'Mountain View, CA (Hybrid)',
        experienceRequired: '0-2 Years',
        isRemote: false,
        skillsRequired: ['Go', 'Kubernetes', 'REST APIs', 'Linux']
      },
      {
        postedBy: john._id,
        title: 'Associate Product Manager',
        company: 'Meta',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150&auto=format&fit=crop',
        description: 'Meta is looking for an Associate PM. You will drive UX research for Messenger features, run user engagement experiments, and coordinate across tech and marketing teams.',
        salary: '$110,000 - $130,000',
        location: 'New York, NY',
        experienceRequired: 'Entry Level',
        isRemote: false,
        skillsRequired: ['Product Analytics', 'SQL', 'A/B Testing']
      },
      {
        postedBy: alice._id,
        title: 'Frontend Developer (Framer & R3F)',
        company: 'Netflix',
        logo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=150&auto=format&fit=crop',
        description: 'Netflix UI/UX team is seeking a Frontend Developer to build interactive components. Expert React, CSS grid, and high-fidelity animations with Framer Motion or GSAP are required.',
        salary: '$130,000 - $160,000',
        location: 'Remote (US)',
        experienceRequired: '2+ Years',
        isRemote: true,
        skillsRequired: ['React', 'Framer Motion', 'TailwindCSS', 'Three.js']
      },
      {
        postedBy: david._id,
        title: 'Backend API Developer',
        company: 'Stripe',
        logo: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=150&auto=format&fit=crop',
        description: 'Stripe payment integration team is hiring backend developers. Focus will be on Node.js/TypeScript microservices, security protocols, API logging, and relational database speed audits.',
        salary: '$140,000 - $170,000',
        location: 'Seattle, WA',
        experienceRequired: '3+ Years',
        isRemote: false,
        skillsRequired: ['Node.js', 'PostgreSQL', 'Redis', 'API Security']
      }
    ];

    const createdJobs = [];
    for (const j of jobs) {
      const job = await Job.create(j);
      createdJobs.push(job);
    }
    console.log('Dummy jobs posted.');

    // Seed Referrals
    const referrals = [
      {
        job: createdJobs[0]._id, // Google SE
        candidate: aishu._id,
        alumni: jane._id,
        resumeUrl: 'mock-dashboard-cv',
        status: 'accepted',
        notes: 'Aishu has strong foundations in React and Node.js. High potential.'
      },
      {
        job: createdJobs[1]._id, // Meta APM
        candidate: aishu._id,
        alumni: john._id,
        resumeUrl: 'mock-dashboard-cv',
        status: 'pending',
        notes: 'Interested in the associate product manager track.'
      },
      {
        job: createdJobs[3]._id, // Stripe Backend
        candidate: aishu._id,
        alumni: david._id,
        resumeUrl: 'mock-dashboard-cv',
        status: 'pending',
        notes: 'Applying for Backend API developer.'
      }
    ];

    for (const ref of referrals) {
      await Referral.create(ref);
    }
    console.log('Dummy job referrals seeded.');

    // Seed Mentorship Sessions
    const sessions = [
      {
        mentor: jane._id,
        student: sarah._id,
        topic: 'Resume Review & Google Interview Strategy',
        date: '2026-06-20',
        time: '14:00',
        status: 'approved',
        meetingLink: 'https://meet.google.com/mock-meet-link',
        notes: 'Prepare 1 dynamic programming and 1 system design query.'
      },
      {
        mentor: john._id,
        student: sarah._id,
        topic: 'PM Career Path & MBA Guidance',
        date: '2026-06-15',
        time: '10:30',
        status: 'completed',
        meetingLink: 'https://meet.google.com/mock-meet-pm',
        notes: 'Good session talking about how product specs are compiled.',
        review: {
          rating: 5,
          text: 'John gave incredible, actionable tips on product interview prep!'
        },
        certificateUrl: '/certificates/cert-pm-session.pdf'
      },
      {
        mentor: alice._id,
        student: ryan._id,
        topic: 'Introduction to Creative Frontend Coding',
        date: '2026-06-25',
        time: '16:00',
        status: 'pending',
        notes: 'I want to learn how Three.js is configured inside React apps.'
      },
      // Aishu's Sessions
      {
        mentor: jane._id,
        student: aishu._id,
        topic: 'Google Resume Audit & System Design Strategy',
        date: '2026-06-20',
        time: '14:00',
        status: 'approved',
        meetingLink: 'https://meet.google.com/mock-meet-link',
        notes: 'Review the latest resume draft, discuss Google Cloud Platform API questions.'
      },
      {
        mentor: john._id,
        student: aishu._id,
        topic: 'PM Career Advice & Product Design Case Prep',
        date: '2026-06-22',
        time: '11:00',
        status: 'pending',
        notes: 'Would like to go over framework models for estimation cases.'
      },
      {
        mentor: alice._id,
        student: aishu._id,
        topic: 'Three.js & Canvas Integration in React',
        date: '2026-06-15',
        time: '16:00',
        status: 'completed',
        meetingLink: 'https://meet.google.com/mock-meet-pm',
        notes: 'Discussed how to declare mesh elements and use orbit controls helper hooks.',
        review: {
          rating: 5,
          text: 'Alice explained React Three Fiber components so clearly! Best session ever.'
        }
      }
    ];

    for (const s of sessions) {
      await MentorshipSession.create(s);
    }
    console.log('Dummy mentorship sessions scheduled.');

    // Seed Events
    const events = [
      {
        title: 'Annual Tech Hackathon 2026',
        description: 'Build premium web applications on the dark-theme aesthetic using React and Node. Prize pool includes iPads, developer tools licenses, and pre-placement interviews with our partner companies.',
        date: new Date('2026-07-10T09:00:00Z'),
        location: 'Main Campus Auditorium & Discord',
        category: 'Hackathon',
        organizer: admin._id,
        rsvps: [sarah._id, ryan._id, jane._id, aishu._id]
      },
      {
        title: 'Alumni Dinner & Networking Meetup',
        description: 'Meet and greet alumni from top tier product giants like Google, Netflix, Stripe, and Meta. Finger food and cocktails will be provided. Smart casual dress code.',
        date: new Date('2026-08-05T18:30:00Z'),
        location: 'Sheraton Heights Ballroom',
        category: 'Alumni Meetup',
        organizer: admin._id,
        rsvps: [sarah._id, john._id, jane._id, david._id, aishu._id]
      },
      {
        title: 'Next-Gen Frontend Web Design Workshop',
        description: 'Alice Johnson from Netflix reveals UI development tricks using Tailwind CSS, Framer Motion, and WebGL elements.',
        date: new Date('2026-06-28T15:00:00Z'),
        location: 'Virtual Zoom Stream',
        category: 'Workshop',
        organizer: alice._id,
        rsvps: [sarah._id, ryan._id, aishu._id]
      }
    ];

    for (const e of events) {
      await Event.create(e);
    }
    console.log('Dummy campus events created.');

    // Seed Messages
    const messages = [
      {
        sender: sarah._id,
        recipient: jane._id,
        text: 'Hi Jane, thank you for accepting my connect request! I booked a slot for tomorrow.',
        isRead: true,
        createdAt: new Date('2026-06-17T11:00:00Z')
      },
      {
        sender: jane._id,
        recipient: sarah._id,
        text: 'Hello Sarah! I saw the booking and approved it. Look forward to looking through your CV.',
        isRead: true,
        createdAt: new Date('2026-06-17T11:05:00Z')
      },
      {
        sender: sarah._id,
        recipient: jane._id,
        text: 'Awesome! I will upload my latest PDF resume to my profile tonight. See you tomorrow!',
        isRead: false,
        createdAt: new Date('2026-06-17T11:10:00Z')
      },
      // Conversation with Jane Doe (Aishu)
      {
        sender: aishu._id,
        recipient: jane._id,
        text: 'Hi Jane, I was hoping to get some feedback on my resume before applying for the Cloud Infra position at Google.',
        isRead: true,
        createdAt: new Date('2026-06-17T11:00:00Z')
      },
      {
        sender: jane._id,
        recipient: aishu._id,
        text: 'Hi Aishu! I\'d love to help. Let\'s schedule a session on the portal. Can you share the current draft here?',
        isRead: true,
        createdAt: new Date('2026-06-17T11:05:00Z')
      },
      {
        sender: aishu._id,
        recipient: jane._id,
        text: 'Thank you so much! I\'ve uploaded it to my profile and also scheduled a slot for tomorrow at 2 PM. Looking forward to it!',
        isRead: true,
        createdAt: new Date('2026-06-17T11:10:00Z')
      },
      {
        sender: jane._id,
        recipient: aishu._id,
        text: 'Perfect, I\'ve accepted it. Talk to you tomorrow!',
        isRead: true,
        createdAt: new Date('2026-06-17T11:15:00Z')
      },
      // Conversation with John Smith (Aishu)
      {
        sender: john._id,
        recipient: aishu._id,
        text: 'Hey Aishu! I saw your post in the forum about Meta PM interviews. Happy to connect and share some interview prep materials.',
        isRead: false,
        createdAt: new Date('2026-06-19T04:30:00Z') // Unread!
      },
      // Conversation with Alice Johnson (Aishu)
      {
        sender: aishu._id,
        recipient: alice._id,
        text: 'Hi Alice, your Netflix UI design talk was amazing! The Framer Motion animations you showed were so slick.',
        isRead: true,
        createdAt: new Date('2026-06-16T15:00:00Z')
      },
      {
        sender: alice._id,
        recipient: aishu._id,
        text: 'Thank you! I\'m glad you liked it. Keep practicing, the best way to learn is by building small interactive widgets.',
        isRead: true,
        createdAt: new Date('2026-06-16T15:20:00Z')
      },
      {
        sender: aishu._id,
        recipient: alice._id,
        text: 'Thanks! I\'m actually trying to build a 3D globe for my major project using React Three Fiber. Any tips?',
        isRead: true,
        createdAt: new Date('2026-06-17T09:00:00Z')
      },
      {
        sender: alice._id,
        recipient: aishu._id,
        text: 'Oh nice! Definitely check out the Drei package, it makes canvas setups a breeze. Let\'s connect on Zoom during our mentorship session.',
        isRead: true,
        createdAt: new Date('2026-06-17T09:15:00Z')
      },
      // Conversation with David Lee (Aishu)
      {
        sender: aishu._id,
        recipient: david._id,
        text: 'Hi David, I saw the Backend API Developer role at Stripe. Do you accept referrals for this position?',
        isRead: true,
        createdAt: new Date('2026-06-15T10:00:00Z')
      },
      {
        sender: david._id,
        recipient: aishu._id,
        text: 'Hello Aishu. Yes, I do! Send over your resume link and a brief summary of your Node.js experience, and I\'ll review it.',
        isRead: true,
        createdAt: new Date('2026-06-15T10:30:00Z')
      },
      {
        sender: aishu._id,
        recipient: david._id,
        text: 'Awesome, I\'ve requested a referral through the Nexora Job board and attached my resume. Thank you!',
        isRead: true,
        createdAt: new Date('2026-06-15T11:00:00Z')
      },
      {
        sender: david._id,
        recipient: aishu._id,
        text: 'Got it! I will review it and submit the referral on our internal portal.',
        isRead: true,
        createdAt: new Date('2026-06-15T12:00:00Z')
      }
    ];

    for (const m of messages) {
      await Message.create(m);
    }
    console.log('Initial chat logs exchanged.');

    // Seed Notifications
    const notifications = [
      {
        recipient: jane._id,
        sender: sarah._id,
        type: 'message',
        text: 'New message from Sarah Jenkins: "Awesome! I will upload my latest PDF resume..."',
        link: '/messages',
        isRead: false
      },
      {
        recipient: jane._id,
        sender: sarah._id,
        type: 'mentorship_request',
        text: 'Sarah Jenkins booked a mentorship session with you regarding "Resume Review & Google Interview Strategy".',
        link: '/dashboard',
        isRead: true
      },
      {
        recipient: sarah._id,
        sender: jane._id,
        type: 'mentorship_status',
        text: 'Mentorship session on "Resume Review & Google Interview Strategy" has been updated to "approved".',
        link: '/dashboard',
        isRead: false
      },
      // Aishu's Notifications
      {
        recipient: aishu._id,
        sender: jane._id,
        type: 'mentorship_status',
        text: 'Mentorship session on "Google Resume Audit & System Design Strategy" has been updated to "approved".',
        link: '/dashboard',
        isRead: false
      },
      {
        recipient: aishu._id,
        sender: john._id,
        type: 'message',
        text: 'New message from John Smith: "Hey Aishu! I saw your post..."',
        link: '/messages',
        isRead: false
      },
      {
        recipient: aishu._id,
        sender: jane._id,
        type: 'referral_status',
        text: 'Your referral request for "Software Engineer I (Cloud Infra)" at Google has been accepted.',
        link: '/dashboard',
        isRead: false
      }
    ];

    for (const n of notifications) {
      await Notification.create(n);
    }
    console.log('Initial notification feeds set.');

    // Seed Companies
    await Company.deleteMany();
    const googleCo = await Company.create({
      name: 'Google',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=150&auto=format&fit=crop',
      industry: 'Technology',
      description: 'Organizing the world\'s information and making it universally accessible.',
      website: 'https://google.com',
      location: 'Mountain View, CA',
      recruiters: [jane._id]
    });
    const netflixCo = await Company.create({
      name: 'Netflix',
      logo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=150&auto=format&fit=crop',
      industry: 'Media',
      description: 'Cinematic streaming service hosting award-winning content.',
      website: 'https://netflix.com',
      location: 'Los Angeles, CA',
      recruiters: [alice._id]
    });
    console.log('Dummy companies profiles seeded.');

    // Seed Communities
    await Community.deleteMany();
    await Community.create({
      name: 'Aditya Web Devs',
      description: 'Interest group sharing tips about React, NextJS, Node, and WebGL developers.',
      category: 'Interest',
      creator: admin._id,
      members: [admin._id, sarah._id, ryan._id, jane._id, alice._id, aishu._id]
    });
    await Community.create({
      name: 'Silicon Valley Aditya Hub',
      description: 'Regional group connecting Aditya alumni working in USA West Coast startups.',
      category: 'Regional',
      creator: jane._id,
      members: [jane._id, john._id, alice._id, david._id]
    });
    console.log('Dummy communities channels seeded.');

    // Seed Feed Posts
    await Post.deleteMany();
    await Post.create({
      author: jane._id,
      text: 'Google is launching a new placement drive for Aditya graduates this winter! Keep your portfolios ready and focus on data structures and system design basics.',
      poll: {
        question: 'Which track are you most interested in?',
        options: [
          { text: 'Frontend Software Engineer', votes: [sarah._id, aishu._id] },
          { text: 'Backend API Developer', votes: [ryan._id] },
          { text: 'Cloud Infrastructure Architect', votes: [] }
        ]
      },
      tags: ['Google', 'Placement', 'Hiring'],
      createdAt: new Date('2026-06-18T09:00:00Z')
    });

    await Post.create({
      author: alice._id,
      text: 'Just completed mapping our new cinematic UI sliders for the streaming dashboard at Netflix. Framer Motion is absolute magic for micro-interactions!',
      likes: [jane._id, sarah._id, aishu._id],
      tags: ['CreativeCoding', 'UX'],
      createdAt: new Date('2026-06-18T14:20:00Z')
    });

    await Post.create({
      author: john._id,
      text: 'Had a great mentoring session with Sarah Jenkins yesterday discussing PM paths. Aditya has some incredible talent coming up! If you are interested in VR/AR or growth product management, feel free to reach out.',
      likes: [jane._id, sarah._id, aishu._id],
      comments: [
        { author: sarah._id, text: 'Thank you for the session, John! It was super helpful.', createdAt: new Date('2026-06-19T02:00:00Z') },
        { author: aishu._id, text: 'I\'d love to connect for a session as well, John!', createdAt: new Date('2026-06-19T02:30:00Z') }
      ],
      tags: ['Mentorship', 'Meta', 'ProductManagement'],
      createdAt: new Date('2026-06-19T01:10:00Z')
    });

    await Post.create({
      author: david._id,
      text: 'Just opened up a referral request pipeline on NEXORA for our Backend API Developer role. Looking for students with strong Node.js, SQL, and API security fundamentals. Apply directly through the Jobs portal!',
      likes: [jane._id, alice._id, aishu._id],
      comments: [
        { author: ryan._id, text: 'Applying right now, David!', createdAt: new Date('2026-06-19T03:15:00Z') },
        { author: aishu._id, text: 'Thank you for sharing, David! Sent over my referral application.', createdAt: new Date('2026-06-19T03:45:00Z') }
      ],
      tags: ['Hiring', 'Stripe', 'Backend'],
      createdAt: new Date('2026-06-19T02:50:00Z')
    });

    await Post.create({
      author: aishu._id,
      text: 'Super excited to launch my first interactive 3D portfolio! Massive thanks to @Alice Johnson for the pointers on React Three Fiber (R3F) and custom Drei components. Check out the demo in my projects tab.',
      likes: [alice._id, ryan._id, sarah._id, jane._id],
      comments: [
        { author: alice._id, text: 'This looks absolutely premium, Aishu! Love the smooth orbit controls and glowing node gradients. Keep it up!', createdAt: new Date('2026-06-19T05:30:00Z') },
        { author: ryan._id, text: 'Wow, this is amazing! Did you write custom shaders for the network globe?', createdAt: new Date('2026-06-19T06:00:00Z') },
        { author: aishu._id, text: 'Yes Ryan, used custom fragment shaders for the pulsing nodes!', createdAt: new Date('2026-06-19T06:15:00Z') }
      ],
      tags: ['Threejs', 'CreativeCoding', 'Portfolio'],
      createdAt: new Date('2026-06-19T05:10:00Z')
    });

    await Post.create({
      author: sarah._id,
      text: 'Just wrapped up an intense mock interview session with @Jane Doe. Extremely helpful feedback on resume formatting and coding under pressure. Strongly recommend booking slots with our alumni mentors!',
      likes: [jane._id, ryan._id, aishu._id],
      comments: [
        { author: jane._id, text: 'You did great, Sarah! Keep practicing dynamic programming patterns, and you\'ll ace it.', createdAt: new Date('2026-06-19T07:30:00Z') }
      ],
      tags: ['Mentorship', 'MockInterview', 'Google'],
      createdAt: new Date('2026-06-19T07:00:00Z')
    });
    console.log('Dummy social feed posts populated.');

    // Seed Forum Questions
    await Forum.deleteMany();
    await Forum.create({
      title: 'How to prepare for Meta PM interviews?',
      body: 'I\'m currently in my final year and looking to apply for the Associate Product Manager track. What resources do you suggest for case studies prep?',
      author: sarah._id,
      tags: ['ProductManagement', 'CareerAdvice'],
      answers: [
        {
          author: john._id,
          text: 'I suggest focusing on product design sense and strategic metric frameworks. Decode and Conquer is an excellent starting point!',
          likes: [sarah._id],
          isPinned: true
        }
      ]
    });
    await Forum.create({
      title: 'Best way to learn Three.js in React?',
      body: 'I want to build a glowing 3D network nodes globe for my final year major project. Should I use raw Threejs canvas or R3F?',
      author: ryan._id,
      tags: ['ReactThreeFiber', '3DWebGL'],
      answers: [
        {
          author: alice._id,
          text: 'Definitely go with React Three Fiber (R3F) and Drei helper libraries. They let you declare 3D meshes as components, making state bindings simple.',
          likes: [ryan._id]
        }
      ]
    });
    console.log('Dummy forum Q&A discussions seeded.');

    // Assign XP and Levels to users
    await User.findByIdAndUpdate(admin._id, { xp: 80, level: 1 });
    await User.findByIdAndUpdate(jane._id, { xp: 320, level: 4 });
    await User.findByIdAndUpdate(john._id, { xp: 240, level: 3 });
    await User.findByIdAndUpdate(alice._id, { xp: 180, level: 2 });
    await User.findByIdAndUpdate(david._id, { xp: 90, level: 1 });
    await User.findByIdAndUpdate(sarah._id, { xp: 110, level: 2 });
    await User.findByIdAndUpdate(ryan._id, { xp: 50, level: 1 });
    await User.findByIdAndUpdate(aishu._id, { xp: 165, level: 2 });
    console.log('Gamification XP points assigned to demo accounts.');

    console.log('Database Seeding successfully completed!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
