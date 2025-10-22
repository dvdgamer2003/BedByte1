import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  Star, 
  Calendar, 
  MapPin, 
  Mail, 
  ArrowRight, 
  Shield, 
  Award, 
  Users, 
  Clock,
  Stethoscope,
  Linkedin,
  Instagram,
  Github,
  Brain,
  Baby,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import FloatingEmergencyButton from '../components/FloatingEmergencyButton';

const ModernHome = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Animated counters
  useEffect(() => {
    const timer1 = setInterval(() => {
      setCount1((prev) => (prev < 95 ? prev + 1 : 95));
    }, 20);
    const timer2 = setInterval(() => {
      setCount2((prev) => (prev < 99 ? prev + 1 : 99));
    }, 20);
    const timer3 = setInterval(() => {
      setCount3((prev) => (prev < 50 ? prev + 1 : 50));
    }, 30);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
    };
  }, []);

  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Expert heart care with advanced diagnostics and treatment',
      color: 'from-red-400 to-pink-500',
      slug: 'cardiology',
    },
    {
      icon: Brain,
      title: 'Neurology',
      description: 'Comprehensive neurological care and brain health services',
      color: 'from-purple-400 to-indigo-500',
      slug: 'neurology',
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      description: 'Specialized care for children from infancy to adolescence',
      color: 'from-cyan-400 to-blue-500',
      slug: 'pediatrics',
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Complete healthcare solutions for all age groups',
      color: 'from-green-400 to-emerald-500',
      slug: 'general-medicine',
    },
  ];

  const testimonials = [
    {
      name: 'Sarvesh Dharmadhikari',
      role: 'Patient',
      content: 'The care I received was exceptional. The staff was professional and caring throughout my treatment.',
      rating: 5,
      avatar: '👩‍⚕️',
    },
    {
      name: 'Yash Dhadge',
      role: 'Patient',
      content: 'State-of-the-art facilities combined with compassionate care. Highly recommend BedByte+!',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      name: 'Mangesh Alange',
      role: 'Patient',
      content: 'The booking system is so easy to use, and the doctors are incredibly knowledgeable.',
      rating: 5,
      avatar: '👩‍🎓',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Floating Emergency Button */}
      <FloatingEmergencyButton />

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                Your Partner in Health
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-2xl md:text-3xl text-gray-600 mb-12 font-light"
              >
                Every Step of the Way
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/emergency-booking" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl"
                  >
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Emergency Booking
                    <Badge className="ml-2 bg-white/20 hover:bg-white/20">24/7</Badge>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/appointments" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-6 text-lg rounded-full shadow-xl"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                    <CheckCircle2 className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-6 justify-center items-center mt-8"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">24/7 Support</span>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/4 right-10 hidden lg:block"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12">
                <Heart className="text-white h-10 w-10" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute bottom-1/4 left-10 hidden lg:block"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-2xl flex items-center justify-center">
                <Activity className="text-white h-12 w-12" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform -rotate-6"
              >
                <CheckCircle2 className="text-white h-10 w-10" />
              </motion.div>
              <motion.h3
                className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
              >
                {count1}%
              </motion.h3>
              <p className="text-gray-600 text-lg">Diseases Treated Successfully</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-6"
              >
                <Users className="text-white h-10 w-10" />
              </motion.div>
              <motion.h3
                className="text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
              >
                {count2}%
              </motion.h3>
              <p className="text-gray-600 text-lg">Patient Satisfaction Rate</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform -rotate-3"
              >
                <Award className="text-white h-10 w-10" />
              </motion.div>
              <motion.h3
                className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.6 }}
              >
                {count3}+
              </motion.h3>
              <p className="text-gray-600 text-lg">Certified Specialists</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="relative z-10"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop"
                      alt="Medical Equipment"
                      className="rounded-2xl shadow-xl"
                    />
                  </div>
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, -5, 0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-2xl opacity-50"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Excellence in Healthcare Since 2008
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                With over 15 years of experience, we've been at the forefront of medical innovation,
                providing compassionate care and cutting-edge treatments to thousands of patients.
              </p>
              
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Award className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">15+ Years Experience</h4>
                    <p className="text-gray-600 text-sm">Trusted healthcare provider</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">50+ Certified Specialists</h4>
                    <p className="text-gray-600 text-sm">Expert medical professionals</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Heart className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">10,000+ Happy Patients</h4>
                    <p className="text-gray-600 text-sm">Lives transformed</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Specialized Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive healthcare solutions tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  scale: 1.05,
                }}
                style={{ perspective: 1000 }}
              >
                <Card className="p-6 h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 mb-6 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <service.icon className="text-white h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link to={`/service/${service.slug}`}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="mt-auto flex items-center text-blue-600 font-semibold cursor-pointer hover:text-blue-700 transition-colors"
                    >
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              What Our Patients Say
            </h2>
            <p className="text-gray-600 text-lg">Real stories from real people</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              >
                <Card className="p-8 h-full bg-white border-0 shadow-xl relative overflow-hidden">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 relative overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Book your appointment today and experience world-class healthcare
            </p>
            <Link to="/emergency-booking">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-lg rounded-full shadow-2xl"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                BedByte<span className="text-pink-400">+</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Your trusted partner in smart healthcare, providing excellence at every step.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/doctors" className="text-gray-400 hover:text-white transition-colors">Find Doctors</Link></li>
                <li><Link to="/nearby" className="text-gray-400 hover:text-white transition-colors">Nearby Hospitals</Link></li>
                <li><Link to="/emergency-booking" className="text-gray-400 hover:text-white transition-colors">Emergency Booking</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Style Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Licensing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Change Log</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  Pune, Maharashtra, India
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <a href="mailto:divyesh.ravane_comp23@pccoer.in" className="hover:text-white transition-colors">divyesh.ravane_comp23@pccoer.in</a>
                </li>
              </ul>
              
              {/* Social Media Links */}
              <div className="mt-6">
                <h4 className="font-bold mb-3 text-sm text-gray-300">Connect With Me</h4>
                <div className="flex gap-3">
                  <a 
                    href="https://www.linkedin.com/in/divyesh-ravane-194753292" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/divyesh_06" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://github.com/dvdgamer2003" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                    title="Visit my GitHub Profile"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 mb-2">&copy; 2025 BedByte+. All rights reserved. Built with ❤️ for better healthcare.</p>
            <p className="text-sm text-gray-500">Developed by <a href="https://divyeshravane.info" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Divyesh Ravane</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernHome;
