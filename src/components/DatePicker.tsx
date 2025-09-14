import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  label: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  label,
  required
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm text-gray-400 mb-2">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type="text"
          value={formatDate(value)}
          readOnly
          onClick={() => setIsOpen(true)}
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
          placeholder="Select date..."
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null as any);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <CalendarIcon className="text-gray-400 w-4 h-4" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-4">
          <Calendar
            onChange={(date) => {
              onChange(date as Date);
              setIsOpen(false);
            }}
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            className="custom-calendar"
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;