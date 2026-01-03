import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Brain, Baby, Stethoscope, ArrowRight, CheckCircle, Clock, Award, Users, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const serviceData = {
  cardiology: {
    title: 'Cardiology',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description: 'Expert heart care with advanced diagnostics and treatment for all cardiovascular conditions.',
    longDescription: 'Our cardiology department is equipped with state-of-the-art facilities and staffed by experienced cardiologists who specialize in diagnosing and treating heart diseases. We provide comprehensive care from prevention to advanced surgical interventions.',
    services: [
      'Echocardiography (2D Echo, Doppler)',
      'Electrocardiogram (ECG/EKG)',
      'Stress Testing & Cardiac Monitoring',
      'Angiography & Angioplasty',
      'Pacemaker Implantation',
      'Heart Failure Management',
      'Arrhythmia Treatment',
      'Preventive Cardiac Care',
    ],
    conditions: [
      'Coronary Artery Disease',
      'Heart Attack & Angina',
      'Heart Failure',
      'Arrhythmias (Irregular Heartbeat)',
      'Valvular Heart Disease',
      'Congenital Heart Defects',
      'Hypertension (High Blood Pressure)',
      'Cardiomyopathy',
    ],
    stats: {
      patients: '10,000+',
      specialists: '25+',
      successRate: '98%',
      experience: '15+ Years',
    },
  },
  neurology: {
    title: 'Neurology',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    description: 'Comprehensive neurological care and brain health services with cutting-edge technology.',
    longDescription: 'Our neurology department offers comprehensive diagnosis and treatment for all neurological disorders. With advanced imaging technology and expert neurologists, we provide personalized care for brain, spine, and nervous system conditions.',
    services: [
      'MRI & CT Scan Imaging',
      'EEG (Electroencephalogram)',
      'EMG & Nerve Conduction Studies',
      'Stroke Treatment & Prevention',
      'Epilepsy Management',
      'Movement Disorder Treatment',
      'Headache & Migraine Clinic',
      'Neurosurgical Consultations',
    ],
    conditions: [
      'Stroke & TIA',
      'Epilepsy & Seizures',
      "Parkinson's Disease",
      "Alzheimer's & Dementia",
      'Multiple Sclerosis',
      'Migraine & Chronic Headaches',
      'Neuropathy',
      'Brain Tumors',
    ],
    stats: {
      patients: '8,500+',
      specialists: '20+',
      successRate: '96%',
      experience: '12+ Years',
    },
  },
  pediatrics: {
    title: 'Pediatrics',
    icon: Baby,
    color: 'from-cyan-500 to-blue-500',
    description: 'Specialized care for children from infancy to adolescence with compassionate expertise.',
    longDescription: 'Our pediatrics department is dedicated to providing comprehensive healthcare for children of all ages. From routine check-ups to specialized treatments, we ensure your child receives the best care in a friendly, child-centric environment.',
    services: [
      'Well-Child Check-ups',
      'Vaccination & Immunization',
      'Growth & Development Monitoring',
      'Pediatric Emergency Care',
      'Neonatal Intensive Care (NICU)',
      'Pediatric Surgery',
      'Childhood Disease Management',
      'Nutritional Counseling',
    ],
    conditions: [
      'Common Childhood Infections',
      'Asthma & Allergies',
      'Developmental Disorders',
      'Congenital Conditions',
      'Childhood Obesity',
      'Behavioral Issues',
      'Ear, Nose & Throat Problems',
      'Skin Conditions',
    ],
    stats: {
      patients: '15,000+',
      specialists: '30+',
      successRate: '99%',
      experience: '20+ Years',
    },
  },
  'general-medicine': {
    title: 'General Medicine',
    icon: Stethoscope,
    color: 'from-green-500 to-emerald-500',
    description: 'Complete healthcare solutions for all age groups with comprehensive medical services.',
    longDescription: 'Our general medicine department serves as your primary point of contact for all health concerns. Our experienced physicians provide comprehensive care, from routine health screenings to management of chronic diseases.',
    services: [
      'Health Check-ups & Screenings',
      'Chronic Disease Management',
      'Diabetes Care & Management',
      'Hypertension Treatment',
      'Respiratory Care',
      'Gastrointestinal Treatments',
      'Infectious Disease Care',
      'Preventive Medicine',
    ],
    conditions: [
      'Diabetes Mellitus',
      'Hypertension',
      'Thyroid Disorders',
      'Respiratory Infections',
      'Digestive Disorders',
      'Arthritis & Joint Pain',
      'Fever & Infections',
      'General Health Issues',
    ],
    stats: {
      patients: '25,000+',
      specialists: '40+',
      successRate: '97%',
      experience: '25+ Years',
    },
  },
};

const ServiceDetail = () => {
  const { service } = useParams<{ service: string }>();
  const data = serviceData[service as keyof typeof serviceData];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`inline-block w-28 h-28 bg-white/20 backdrop-blur-lg rounded-3xl mb-8 p-7 shadow-2xl`}
            >
              <Icon className="h-full w-full" />
            </motion.div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">{data.title} Department</h1>
            <p className="text-2xl text-white/95 mb-10 leading-relaxed">{data.description}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/doctors">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg">
                  Find Specialists <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/appointments">
                <Button size="lg" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-blue-600 font-semibold transition-all">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <motion.div
              whileHover={{ y: -5, scale: 1.05 }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{data.stats.patients}</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Patients Treated</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.05 }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{data.stats.specialists}</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Specialists</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.05 }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{data.stats.successRate}</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Success Rate</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.05 }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{data.stats.experience}</div>
              <div className="text-sm font-medium text-gray-600 mt-2">Experience</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                About Our {data.title} Department
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-gray-700 leading-relaxed text-center">{data.longDescription}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services & Conditions */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Services */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Services</h3>
                <div className="space-y-3">
                  {data.services.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{service}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Conditions Treated */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Conditions We Treat</h3>
                <div className="space-y-3">
                  {data.conditions.map((condition, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${data.color} flex-shrink-0 mt-2`} />
                      <span className="text-gray-700">{condition}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-2xl text-white/95 mb-10 leading-relaxed">
              Book an appointment with our expert {data.title.toLowerCase()} specialists today
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/doctors">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Find Doctors
                </Button>
              </Link>
              <Link to="/appointments">
                <Button size="lg" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-blue-600 font-semibold transition-all">
                  <Phone className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
              </Link>
              <Link to="/hospitals">
                <Button size="lg" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-purple-600 font-semibold transition-all">
                  View Hospitals
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
