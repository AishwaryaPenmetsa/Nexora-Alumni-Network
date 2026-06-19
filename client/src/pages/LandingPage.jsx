import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NetworkGlobe from '../components/NetworkGlobe';
import FloatingParticles from '../components/FloatingParticles';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  Award, 
  ArrowRight, 
  Star, 
  Mail, 
  Linkedin, 
  Twitter, 
  ChevronDown, 
  Cpu, 
  Building,
  CheckCircle,
  Sparkles,
  Search,
  TrendingUp
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '20K+', label: 'Global Alumni Network', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { value: '500+', label: 'Active Industry Mentors', icon: GraduationCap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { value: '1,200+', label: 'Successful Referrals', icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { value: '98%', label: 'Career Placement Success', icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Search Directory',
      desc: 'Filter alumni by company (Google, Meta, Stripe), graduation cohort, industry, or specific tech stack keywords.',
      icon: Search,
      color: 'from-indigo-500/20 to-purple-500/5 border-indigo-500/30'
    },
    {
      num: '02',
      title: 'Book Mock Sessions',
      desc: 'Access alumni calendars to reserve resume reviews, mock interviews, or 1-on-1 industry career path guidance.',
      icon: GraduationCap,
      color: 'from-cyan-500/20 to-indigo-500/5 border-cyan-500/30'
    },
    {
      num: '03',
      title: 'Secure Referral Slots',
      desc: 'Apply directly for job boards curated by alumni and request recommendations to bypass recruiter screen filters.',
      icon: Briefcase,
      color: 'from-violet-500/20 to-purple-500/5 border-violet-500/30'
    },
    {
      num: '04',
      title: 'Earn Level Progress',
      desc: 'Exchange Q&A on forum topics, like feed items, and answer queries to earn XP and showcase gamified standings.',
      icon: Award,
      color: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30'
    }
  ];

  const featuredMentors = [
    {
      name: 'Jane Doe',
      company: 'Google',
      role: 'Senior Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
      bio: 'Aditya Alumni \'18. Tech lead at Google Cloud. Expert in system design and React/Go microservices.',
      skills: ['System Design', 'Kubernetes', 'Go', 'React'],
      rating: 4.8
    },
    {
      name: 'John Smith',
      company: 'Meta',
      role: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
      bio: 'Aditya Alumni \'19. Specializing in AR/VR products and Growth experiments. Mentored 40+ students.',
      skills: ['A/B Testing', 'Product Analytics', 'SQL'],
      rating: 4.9
    },
    {
      name: 'Alice Johnson',
      company: 'Netflix',
      role: 'Senior UI/UX Engineer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop',
      bio: 'Aditya Alumni \'17. Creative UI developer at Netflix. Specializing in WebGL, framer-motion, and high-fidelity graphics.',
      skills: ['Three.js', 'Framer Motion', 'TailwindCSS'],
      rating: 4.7
    }
  ];

  const jobOpportunities = [
    { title: 'Software Engineer I (Cloud Infra)', company: 'Google', location: 'Mountain View, CA', salary: '$120K - $145K', tags: ['Go', 'Kubernetes'] },
    { title: 'Associate Product Manager', company: 'Meta', location: 'New York, NY', salary: '$110K - $130K', tags: ['Product Strategy', 'SQL'] },
    { title: 'Frontend Developer (Framer & R3F)', company: 'Netflix', location: 'Remote (US)', salary: '$130K - $160K', tags: ['React', 'WebGL'] },
    { title: 'Backend API Developer', company: 'Stripe', location: 'Seattle, WA', salary: '$140K - $170K', tags: ['Node.js', 'PostgreSQL'] }
  ];

  const testimonials = [
    {
      text: "The mentorship portal changed my career. I booked a session with a Staff Engineer from Google who reviewed my CV and referred me. I start next month!",
      name: "Sarah Jenkins",
      role: "Student -> SWE at Google",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
    },
    {
      text: "Being able to give back to the university that built me has been incredibly rewarding. Recommending students is simple, fast, and secure.",
      name: "Jane Doe",
      role: "Alumni (Senior SWE at Google)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop"
    }
  ];

  const faqs = [
    { 
      q: "How does the registration approval process work?", 
      a: "Students and admin accounts are pre-approved to browse workspace portals. Alumni registrations are validated to preserve directory safety." 
    },
    { 
      q: "How does the AI Resume Analyzer function?", 
      a: "Upload your profile document, and our local system computes ATS scores, highlights key strengths, and flags priority missing skills." 
    },
    { 
      q: "Can I exchange direct messages?", 
      a: "Yes. NEXORA comes with a Discord-like messaging interface to query chats, filter notifications, and exchange instant updates." 
    }
  ];

  return (
    <div className="relative min-h-screen bg-darkBg text-white pt-16 overflow-hidden">
      {/* Floating Canvas Particles */}
      <FloatingParticles />

      {/* Cinematic Full Screen Photo Background with Zoom (Ken Burns) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop" 
          alt="University Graduation Scenery Background" 
          className="absolute inset-0 w-full h-full object-cover origin-center animate-ken-burns scale-105"
        />
        {/* Dark Blue/Purple gradient overlay & depth blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/75 via-[#06081e]/90 to-[#050816] backdrop-blur-[2px]" />
      </div>

      {/* Aurora Ambient Lighting Glows */}
      <div className="absolute top-24 left-[15%] w-[550px] h-[550px] bg-primary/10 rounded-full filter blur-[150px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-24 right-[15%] w-[600px] h-[600px] bg-secondary/10 rounded-full filter blur-[150px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '14s' }} />
      <div className="absolute inset-0 grid-bg opacity-20 z-0 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Headline & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col gap-6 text-left"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-primary/20 self-start shadow-glass">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            Empowering Aditya University Networks
          </span>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white m-0 font-space uppercase">
            Connect. Mentor.<br />
            <span className="text-gradient">Elevate Together.</span>
          </h1>

          <p className="text-gray-305 text-base md:text-lg font-light leading-relaxed max-w-2xl font-sans">
            NEXORA is a cinematic professional ecosystem bridging Aditya engineering students and accomplished alumni. Schedule 1-on-1 mentorship, secure exclusive job referrals, and exchange questions on forums.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="px-8 py-4.5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold hover:brightness-110 shadow-glass-glow shadow-primary/30 transition-all flex items-center gap-2.5 group cursor-pointer border-0"
            >
              {user ? "Enter Dashboard" : "Get Started Now"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to={user ? "/directory" : "/login"}
              className="px-8 py-4.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition font-bold"
            >
              Explore Alumni Directory
            </Link>
          </div>
        </motion.div>

        {/* Right floating 3D globe with interactive nodes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center items-center h-[400px] lg:h-[480px]"
        >
          <NetworkGlobe />

          {/* Floating Avatar Badges */}
          <div className="absolute top-10 left-16 w-12 h-12 rounded-2xl border border-primary/40 p-0.5 bg-darkBg/60 backdrop-blur shadow-2xl animate-float">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop" className="w-full h-full rounded-xl object-cover" alt="Alumni avatar" />
          </div>
          <div className="absolute bottom-16 right-12 w-14 h-14 rounded-2xl border border-secondary/40 p-0.5 bg-darkBg/60 backdrop-blur shadow-2xl animate-float-slow">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop" className="w-full h-full rounded-xl object-cover" alt="Alumni avatar" />
          </div>
          <div className="absolute top-[60%] left-6 w-11 h-11 rounded-2xl border border-accent/40 p-0.5 bg-darkBg/60 backdrop-blur shadow-2xl animate-float-fast">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop" className="w-full h-full rounded-xl object-cover" alt="Alumni avatar" />
          </div>
        </motion.div>
      </section>

      {/* STATISTICS PANEL */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 border-y border-white/5 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 backdrop-blur-md">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center justify-center text-center">
                <div className={`p-3.5 rounded-2xl ${stat.bg} border border-white/5 mb-3.5 shadow-inner text-indigo-400`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white m-0 font-space tracking-tight">{stat.value}</h3>
                <span className="text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-widest">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW NEXORA WORKS SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-bold font-mono text-cyan-400 tracking-widest uppercase bg-cyan-950/30 px-3.5 py-1.5 rounded-full border border-cyan-500/20 shadow-glass">
            Workflow Overview
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4 font-space">
            How NEXORA Drives Success
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed font-sans">
            A seamless, gamified approach to networking. Learn, connect, apply for jobs, and build career credentials with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <GlassCard key={index} className={`flex flex-col gap-4 text-left card-gradient-border p-6 rounded-3xl`} hoverGlow>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-2xl font-black font-mono text-indigo-400/40">{step.num}</span>
                  <div className="p-2 rounded-xl bg-white/5 text-indigo-400 border border-white/10">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-white m-0 font-space mt-1">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-light font-sans">{step.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* FEATURED ALUMNI / MENTORS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 text-left">
          <div>
            <span className="text-xs font-bold font-mono text-indigo-400 tracking-widest uppercase bg-indigo-950/20 px-3 py-1 rounded-full border border-indigo-500/10">
              Verified Professionals
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-0 font-space uppercase">
              Learn From Top Tech Mentors
            </h2>
            <p className="text-gray-405 text-sm font-light mt-2 max-w-xl font-sans">
              Schedule meetings with verified graduates working inside major global tech startups.
            </p>
          </div>
          <Link to="/directory" className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 font-mono mt-4 md:mt-0 font-bold">
            Browse Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {featuredMentors.map((mentor, index) => (
            <GlassCard key={index} className="p-6 rounded-3xl flex flex-col justify-between h-96 border-white/5" hoverGlow>
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-2xl object-cover border border-white/10" />
                  <div>
                    <h4 className="text-sm font-extrabold text-white m-0 font-space">{mentor.name}</h4>
                    <span className="text-[10px] text-indigo-400 font-mono font-medium block mt-0.5">{mentor.company} &bull; {mentor.role}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-light font-sans mb-4">"{mentor.bio}"</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {mentor.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[9px] font-mono text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase">MENTOR RATING</span>
                <span className="flex items-center gap-1 text-xs text-amber-400 font-bold font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {mentor.rating}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* JOBS & AI CAREER HUB PREVIEWS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-white/5">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Job Board Preview */}
          <div className="lg:col-span-6 text-left flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold font-mono text-indigo-400 tracking-widest uppercase bg-indigo-950/20 px-3 py-1 rounded-full border border-indigo-500/10">
                Opportunities Hub
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 font-space uppercase">
                Active Alumni Referral Postings
              </h2>
              <p className="text-gray-400 text-sm font-light mt-2 max-w-xl font-sans leading-relaxed">
                Unlock exclusive roles that aren't listed anywhere else. Directly apply and ask the posting alumni for a recommendation in their company.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 bg-white/2 border border-white/5 p-4 rounded-3xl">
              {jobOpportunities.map((job, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-2xl border border-white/5 bg-darkBg/30 hover:bg-white/5 transition duration-300">
                  <div>
                    <h4 className="text-xs font-bold text-white m-0 font-space">{job.title}</h4>
                    <span className="text-[9px] text-gray-500 font-mono mt-1 block">{job.company} &bull; {job.location} &bull; {job.salary}</span>
                  </div>
                  <span className="text-[8px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-primary/20 px-2 py-0.5 rounded-full uppercase">
                    Referral Open
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: AI Career Hub Preview */}
          <div className="lg:col-span-6 text-left flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold font-mono text-cyan-400 tracking-widest uppercase bg-cyan-950/30 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
                AI Career Hub
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 font-space uppercase">
                AI Powered Resume Compatibility
              </h2>
              <p className="text-gray-400 text-sm font-light mt-2 max-w-xl font-sans leading-relaxed">
                Scan your resume dynamically inside the platform. NEXORA analyzes key differences, rates your ATS capability matching index, and recommends skills training pathways.
              </p>
            </div>

            {/* Mock AI Score Circle Widget */}
            <GlassCard className="p-6 rounded-3xl flex items-center justify-between border-white/5 max-w-md mx-auto lg:mx-0 w-full" hoverGlow>
              <div className="flex flex-col justify-between h-36">
                <div>
                  <h4 className="text-xs font-bold font-mono text-indigo-300 uppercase">Parsed Score Metrics</h4>
                  <span className="text-sm font-extrabold text-white mt-2 block font-space">84% Match Score</span>
                </div>
                <span className="text-[9px] font-mono text-gray-505 leading-relaxed font-light">Missing Keywords:<br /><span className="text-indigo-400">#Docker #NodeJS #OAuth2</span></span>
              </div>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="38" className="stroke-white/5 fill-transparent" strokeWidth="6" />
                  <circle cx="56" cy="56" r="38" className="stroke-cyan-400 fill-transparent" strokeWidth="6" strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * 0.16} />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-white block font-mono">84</span>
                  <span className="text-[8px] text-gray-500 font-mono">ATS INDEX</span>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white font-space uppercase">Alumni Transformations</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((test, index) => (
            <GlassCard key={index} className="text-left flex flex-col justify-between hover:border-secondary/20 p-6 rounded-3xl border-white/5" hoverGlow>
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-gray-300 text-sm font-light italic leading-relaxed mb-6 font-sans">"{test.text}"</p>
              <div className="flex items-center gap-3">
                <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                <div>
                  <h4 className="text-xs font-semibold text-white m-0 font-space">{test.name}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">{test.role}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-left">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-space uppercase">Frequently Asked Questions</h2>
        </div>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="border border-white/5 rounded-2xl bg-white/2 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white bg-transparent border-0 cursor-pointer focus:outline-none"
                >
                  <span className="font-space">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-xs text-gray-400 font-light leading-relaxed font-sans"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* UNIVERSITY COLLABORATION / LOGOS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/5 text-center">
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6 font-semibold">Our Alumni Work At</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-35 grayscale contrast-200">
          <span className="font-bold text-lg md:text-xl font-mono text-white">GOOGLE</span>
          <span className="font-bold text-lg md:text-xl font-mono text-white">META</span>
          <span className="font-bold text-lg md:text-xl font-mono text-white">NETFLIX</span>
          <span className="font-bold text-lg md:text-xl font-mono text-white">STRIPE</span>
          <span className="font-bold text-lg md:text-xl font-mono text-white">MICROSOFT</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-black/40 border-t border-white/5 py-16 px-6 md:px-12 text-left">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white shadow-glass">
                N
              </div>
              <span className="font-bold text-white tracking-wider font-space">NEXORA.</span>
            </Link>
            <p className="text-xs text-gray-500 font-light leading-relaxed font-sans">
              NEXORA: Where Alumni Connections Create Tomorrow. Connect with classmates, post jobs, and coordinate mentorships.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 font-sans">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">Platform</h4>
            <Link to="/directory" className="text-xs text-gray-400 hover:text-white transition">Alumni Directory</Link>
            <Link to="/mentorship" className="text-xs text-gray-400 hover:text-white transition">Find Mentors</Link>
            <Link to="/jobs" className="text-xs text-gray-400 hover:text-white transition">Job Board</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2 font-sans">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">Support</h4>
            <a href="https://aditya.ac.in" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline">aditya.ac.in</a>
            <span className="text-xs text-gray-400">alumni@aditya.ac.in</span>
            <div className="flex items-center gap-3 mt-2">
              <a href="https://www.linkedin.com/school/adityaedugroup/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition"><Linkedin className="w-4 h-4" /></a>
              <a href="https://www.facebook.com/adityaedugrp/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3 font-sans">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Newsletter</h4>
            <p className="text-xs text-gray-500 font-light">Stay updated on workshops, hackathons, and placement records.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-primary/50 flex-1"
              />
              <button className="p-2.5 rounded-xl bg-primary hover:bg-indigo-650 transition flex items-center justify-center border-0 cursor-pointer">
                <Mail className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row justify-between text-[10px] text-gray-650 font-mono">
          <span>&copy; 2026 NEXORA. All rights reserved.</span>
          <span>Designed & developed for Major Project Submission.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
