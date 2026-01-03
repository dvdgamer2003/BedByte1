import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Lock, Mail, ArrowRight, AlertCircle, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import Toast from '../components/Toast';

const EnhancedLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await login(email, password);
      setSuccess('Login successful! Redirecting...');

      // Redirect to hospitals page after short delay to show success message
      setTimeout(() => {
        navigate('/hospitals');
      }, 1500);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 border-4 border-blue-100 rounded-full"
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Server className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">Connecting to Server</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                This might take a moment if the server is waking up from sleep mode (Render free tier).
                <br /><br />
                Please stay with us! 🚀
              </p>

              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-blue-600 h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 shadow-xl border-0">
            {/* Logo */}
            <motion.div
              className="text-center mb-8"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to manage hospital bookings</p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-2"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12"
                    placeholder="email or username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base group"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Create Account
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
            >
              <p className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Email:</strong> admin@getbeds.com</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default EnhancedLogin;
