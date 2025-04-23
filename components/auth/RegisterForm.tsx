'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { validateEmail } from '@/lib/utils';

interface RegisterFormProps {
  onToggleForm: () => void;
}

export default function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    emailConfirm: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    country: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('reg-', '')]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.name || !formData.email || !formData.emailConfirm || 
        !formData.password || !formData.passwordConfirm || 
        !formData.phone || !formData.country || !formData.role) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.email !== formData.emailConfirm) {
      setError('Emails do not match');
      return;
    }
    
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        country: formData.country,
        role: formData.role
      });
      
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4">
      <div className="flex justify-center mb-6">
        <div className="bg-primary text-white rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">Create Account</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="reg-name">
              Full Name
            </label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-base text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
              id="reg-name" 
              type="text" 
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="reg-email">
              Email
            </label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-base text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
              id="reg-email" 
              type="email" 
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="reg-emailConfirm">
              Confirm Email
            </label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-base text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
              id="reg-emailConfirm" 
              type="email" 
              placeholder="Confirm Email"
              value={formData.emailConfirm}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="reg-password">
              Password
            </label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-base text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
              id="reg-password" 
              type="password" 
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="reg-passwordConfirm">
              Confirm Password
            </label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-base text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
              id="reg-passwordConfirm" 
              type="password" 
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="reg-phone">
              Phone Number
            </label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-base text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
              id="reg-phone" 
              type="tel" 
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="reg-country">
              Country
            </label>
            <select 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-base text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
              id="reg-country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="BR">Brazil</option>
              <option value="AE">United Arab Emirates</option>
              <option value="EG">Egypt</option>
              <option value="SA">Saudi Arabia</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="reg-role">
              Role
            </label>
            <select 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-base text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
              id="reg-role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        
        <div className="flex items-center justify-between mt-6">
          <button 
            className={`bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : 'Register'}
          </button>
          <button
            type="button" 
            className="inline-block align-baseline font-bold text-sm text-primary hover:text-opacity-80"
            onClick={onToggleForm}
          >
            Already have an account?
          </button>
        </div>
      </form>
    </div>
  );
}