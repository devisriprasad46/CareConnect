import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SignupForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', mobileNumber: '', role: 'Volunteer', location: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signup(formData);
      if (result.success) {
        toast.success('Account created successfully! Please log in.');
        navigate('/login');
      } else { toast.error(result.message); }
    } catch { toast.error('An error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <h1 className="text-5xl font-bold mb-6 text-center">Join Us</h1>
          <p className="text-xl text-center max-w-md">Be the Change You Wish to See. Create an account to find opportunities, host events, and build a better tomorrow.</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 opacity-20"></div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary-600 mb-2">Care Connect</h2>
            <h3 className="text-xl font-semibold text-gray-700">Create Your Account</h3>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button type="button" onClick={() => setFormData({ ...formData, role: 'Volunteer' })} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${formData.role === 'Volunteer' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
                Volunteer
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, role: 'NGO' })} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${formData.role === 'NGO' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
                Organization
              </button>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field pl-10" placeholder="Full Name" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field pl-10" placeholder="Email Address" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="input-field pl-10 pr-10" placeholder="Password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPassword ? (<EyeOff className="h-5 w-5 text-gray-400" />) : (<Eye className="h-5 w-5 text-gray-400" />)}</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="input-field pl-10 pr-10" placeholder="Mobile Number" />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="City, State" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Creating Account...' : 'Create Account'}</button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Already have your account? <Link to="/login" className="font-medium text-green-600 hover:text-green-500">Log In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;


