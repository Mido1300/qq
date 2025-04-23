'use client';

import { useState } from 'react';
import ModalWrapper from './ModalWrapper';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  initialStartDate: string;
  initialEndDate: string;
}

export default function DateRangeModal({ 
  isOpen, 
  onClose, 
  onApply,
  initialStartDate,
  initialEndDate 
}: DateRangeModalProps) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  
  const handleApply = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    // Validate that end date is not before start date
    if (new Date(endDate) < new Date(startDate)) {
      alert('End date cannot be before start date');
      return;
    }
    
    onApply(startDate, endDate);
  };
  
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Custom Date Range">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="date-range-start">
          Start Date
        </label>
        <input 
          id="date-range-start" 
          type="date" 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="date-range-end">
          End Date
        </label>
        <input 
          id="date-range-end" 
          type="date" 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 text-base"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end gap-3">
        <button 
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button 
          onClick={handleApply}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Apply
        </button>
      </div>
    </ModalWrapper>
  );
}