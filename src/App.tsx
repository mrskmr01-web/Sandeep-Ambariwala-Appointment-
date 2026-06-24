/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MessageSquare, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  MessageCircle, 
  Lock, 
  CalendarDays,
  Briefcase,
  Users,
  Award,
  ArrowRight,
  Info,
  Trash2,
  Search,
  Filter,
  Check,
  Copy,
  X,
  LogOut,
  Sliders,
  TrendingUp
} from 'lucide-react';

import sandeepProfile from './assets/images/regenerated_image_1782332560037.png';

// Pre-defined convenient time slots from 06:00 AM to 06:00 PM with 30-minute intervals
const START_TIME_OPTIONS = [
  { value: "06:00", label: "06:00 AM" },
  { value: "06:30", label: "06:30 AM" },
  { value: "07:00", label: "07:00 AM" },
  { value: "07:30", label: "07:30 AM" },
  { value: "08:00", label: "08:00 AM" },
  { value: "08:30", label: "08:30 AM" },
  { value: "09:00", label: "09:00 AM" },
  { value: "09:30", label: "09:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "13:30", label: "01:30 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "14:30", label: "02:30 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "15:30", label: "03:30 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "16:30", label: "04:30 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "17:30", label: "05:30 PM" },
  { value: "18:00", label: "06:00 PM" },
];

const END_TIME_OPTIONS = [
  { value: "06:30", label: "06:30 AM" },
  { value: "07:00", label: "07:00 AM" },
  { value: "07:30", label: "07:30 AM" },
  { value: "08:00", label: "08:00 AM" },
  { value: "08:30", label: "08:30 AM" },
  { value: "09:00", label: "09:00 AM" },
  { value: "09:30", label: "09:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "13:30", label: "01:30 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "14:30", label: "02:30 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "15:30", label: "03:30 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "16:30", label: "04:30 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "17:30", label: "05:30 PM" },
  { value: "18:00", label: "06:00 PM" },
  { value: "18:30", label: "06:30 PM" },
  { value: "19:00", label: "07:00 PM" },
];

interface Appointment {
  id: string;
  fullName: string;
  mobileNumber: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  trackingId: string;
}

interface BlockedItem {
  id: string;
  type: 'date' | 'slot';
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM if type === 'slot'
}

export default function App() {
  // Appointments state with localStorage persistence and default seeds
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const stored = localStorage.getItem('sandeep_appointments');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Appointment[];
        let updated = false;
        // Backwards compatibility migration: guarantee every loaded record has a unique trackingId
        const checked = parsed.map(app => {
          if (!app.trackingId) {
            updated = true;
            const firstName = app.fullName.trim().split(/\s+/)[0].replace(/[^a-zA-Z]/g, '') || 'Client';
            const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            return {
              ...app,
              trackingId: `${capitalizedFirstName}${randomNum}`
            };
          }
          return app;
        });
        if (updated) {
          localStorage.setItem('sandeep_appointments', JSON.stringify(checked));
        }
        return checked;
      } catch (e) {
        console.error(e);
      }
    }
    
    // Seed default future dates
    const d1 = new Date();
    d1.setDate(d1.getDate() + 1);
    const dateTomorrow = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`;
    
    const d2 = new Date();
    d2.setDate(d2.getDate() + 2);
    const dateDayAfter = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, '0')}-${String(d2.getDate()).padStart(2, '0')}`;

    return [
      {
        id: "seed-1",
        fullName: "Rahul Sen",
        mobileNumber: "9876543210",
        date: dateTomorrow,
        startTime: "10:00",
        endTime: "11:30",
        duration: "1 Hour 30 Minutes",
        message: "Requesting advisory session for corporate fundraising scaling.",
        status: 'accepted',
        createdAt: new Date().toISOString(),
        trackingId: "Rahul1356"
      },
      {
        id: "seed-2",
        fullName: "Ananya Mehta",
        mobileNumber: "9988776655",
        date: dateTomorrow,
        startTime: "14:00",
        endTime: "15:00",
        duration: "1 Hour",
        message: "Discussion regarding fundraising rounds and VC positioning.",
        status: 'pending',
        createdAt: new Date().toISOString(),
        trackingId: "Ananya2468"
      },
      {
        id: "seed-3",
        fullName: "Vikram Malhotra",
        mobileNumber: "9123456789",
        date: dateDayAfter,
        startTime: "09:30",
        endTime: "11:00",
        duration: "1 Hour 30 Minutes",
        message: "Advisory session on expansion strategies in global markets.",
        status: 'pending',
        createdAt: new Date().toISOString(),
        trackingId: "Vikram9084"
      }
    ];
  });

  // Persist appointments to localStorage
  useEffect(() => {
    localStorage.setItem('sandeep_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Appointment Tracking State
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [trackMobile, setTrackMobile] = useState('');
  const [trackTrackingId, setTrackTrackingId] = useState('');
  const [hasTracked, setHasTracked] = useState(false);
  const [trackedApps, setTrackedApps] = useState<Appointment[]>([]);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Success tracking state for newly booked
  const [lastBookedTrackingId, setLastBookedTrackingId] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleTrackSearch = (e: FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    const cleanSearchNum = trackMobile.trim().replace(/\D/g, '');
    const cleanTrackingId = trackTrackingId.trim().toLowerCase();
    
    if (!cleanSearchNum || !cleanTrackingId) {
      setTrackedApps([]);
      setHasTracked(true);
      return;
    }
    
    // Strict authentication match: trackingId matches exactly (case insensitive) AND mobile matches
    const results = appointments.filter(app => {
      const appCleanNum = app.mobileNumber.replace(/\D/g, '');
      const appTrackingId = (app.trackingId || '').trim().toLowerCase();
      
      const mobileMatches = appCleanNum.endsWith(cleanSearchNum) || cleanSearchNum.endsWith(appCleanNum);
      const trackingIdMatches = appTrackingId === cleanTrackingId;
      
      return mobileMatches && trackingIdMatches;
    });
    
    setTrackedApps(results);
    setHasTracked(true);
  };

  // Admin Portal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('sandeep_admin_logged_in') === 'true';
  });
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [adminFilter, setAdminFilter] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'rejected'>('all');
  const [adminSearch, setAdminSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Admin control states
  const [adminTab, setAdminTab] = useState<'appointments' | 'availability'>('appointments');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [availManageDate, setAvailManageDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [blockedItems, setBlockedItems] = useState<BlockedItem[]>(() => {
    const stored = localStorage.getItem('sandeep_blocked_items');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Persist admin blocks
  useEffect(() => {
    localStorage.setItem('sandeep_blocked_items', JSON.stringify(blockedItems));
  }, [blockedItems]);

  // Form States
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  
  // Date and Time selection
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  // Validation & Feedback States
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Admin Handlers
  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (adminUsername.trim() === 'admin' && adminPassword === 'RSS78900') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('sandeep_admin_logged_in', 'true');
      setAdminLoginError(null);
      setAdminUsername('');
      setAdminPassword('');
    } else {
      setAdminLoginError('Invalid credentials. Check your Admin ID or Password.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('sandeep_admin_logged_in');
  };

  const handleAcceptApp = (id: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'accepted' } : app
    ));
  };

  const handleRejectApp = (id: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'rejected' } : app
    ));
  };

  const handleCompleteApp = (id: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'completed' } : app
    ));
  };

  const handleDeleteApp = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    setTrackedApps(prev => prev.filter(app => app.id !== id));
    if (deletingId === id) setDeletingId(null);
  };

  // Admin Block & Edit Actions
  const handleToggleDateBlock = (date: string) => {
    setBlockedItems(prev => {
      const exists = prev.find(item => item.type === 'date' && item.date === date);
      if (exists) {
        return prev.filter(item => item.id !== exists.id);
      } else {
        const newItem: BlockedItem = {
          id: `block-date-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: 'date',
          date
        };
        return [...prev, newItem];
      }
    });
  };

  const handleToggleSlotBlock = (date: string, time: string) => {
    setBlockedItems(prev => {
      const exists = prev.find(item => item.type === 'slot' && item.date === date && item.time === time);
      if (exists) {
        return prev.filter(item => item.id !== exists.id);
      } else {
        const newItem: BlockedItem = {
          id: `block-slot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: 'slot',
          date,
          time
        };
        return [...prev, newItem];
      }
    });
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    // Run overlap check if setting status to accepted
    if (editingAppointment.status === 'accepted') {
      const startMin = timeToMinutes(editingAppointment.startTime);
      const endMin = timeToMinutes(editingAppointment.endTime);
      
      const hasOverlap = appointments.some(app => {
        if (app.id === editingAppointment.id || app.status !== 'accepted' || app.date !== editingAppointment.date) return false;
        const appStart = timeToMinutes(app.startTime);
        const appEnd = timeToMinutes(app.endTime);
        return Math.max(startMin, appStart) < Math.min(endMin, appEnd);
      });

      if (hasOverlap) {
        const confirmOverride = window.confirm("Warning: This schedule overlaps with another already booked (accepted) appointment. Do you want to force override and save anyway?");
        if (!confirmOverride) return;
      }
    }

    setAppointments(prev => prev.map(app => 
      app.id === editingAppointment.id ? {
        ...editingAppointment,
        duration: getDurationString(editingAppointment.startTime, editingAppointment.endTime)
      } : app
    ));
    
    setEditingAppointment(null);
  };

  const handleAddDemoApp = () => {
    const names = ["Aarav Sharma", "Priya Nair", "Kabir Saxena", "Riya Sen"];
    const phones = ["9812345670", "9945678123", "9723456789", "9112233445"];
    const messages = [
      "Seeking portfolio advisory & strategic positioning guidance.",
      "Corporate tax planning and scaling operations consultation.",
      "Venture Capital pitch deck review & advisory.",
      "Tech advisory regarding AI integrations and roadmapping."
    ];
    
    const randomIdx = Math.floor(Math.random() * names.length);
    
    // Choose a future date (tomorrow or day after)
    const d = new Date();
    d.setDate(d.getDate() + 1 + Math.floor(Math.random() * 2));
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    // Find a free starting slot
    const possibleStarts = ["09:00", "11:30", "14:30", "16:00"];
    const chosenStart = possibleStarts[Math.floor(Math.random() * possibleStarts.length)];
    const chosenEnd = chosenStart === "16:00" ? "17:30" : `${String(parseInt(chosenStart.split(':')[0]) + 1).padStart(2, '0')}:30`;
    
    const firstNameClean = names[randomIdx].trim().split(' ')[0].replace(/[^a-zA-Z]/g, '') || "Demo";
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `${firstNameClean}${randCode}`;

    const newDemo: Appointment = {
      id: 'demo-' + Date.now(),
      trackingId,
      fullName: names[randomIdx],
      mobileNumber: phones[randomIdx],
      date: dateStr,
      startTime: chosenStart,
      endTime: chosenEnd,
      duration: "1 Hour 30 Minutes",
      message: messages[randomIdx],
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setAppointments(prev => [newDemo, ...prev]);
  };

  // Constants
  const WHATSAPP_NUMBER = "+91 62072 86276";
  const WHATSAPP_URL_PHONE = "916207286276";

  // Quick Date Selectors
  const [quickDates, setQuickDates] = useState<{ label: string; dateStr: string; sub: string }[]>([]);

  // Generate date selectors for today, tomorrow, and day after today
  useEffect(() => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`;
      
      let label = "";
      if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";
      else label = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;

      const sub = `${d.getDate()} ${months[d.getMonth()]}`;
      dates.push({ label, dateStr, sub });
    }
    setQuickDates(dates);
    
    // Default select Tomorrow to prevent immediate past validation issues
    if (dates.length > 1) {
      setSelectedDate(dates[1].dateStr);
    }
  }, []);

  // Helper: Get minimum selectable date (Today)
  const getMinDateStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Convert "HH:MM" to minutes from midnight
  const timeToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Check if a specific date is blocked entirely by the Admin
  const isDateBlockedByAdmin = (date: string): boolean => {
    return blockedItems.some(item => item.type === 'date' && item.date === date);
  };

  // Check if a specific slot is blocked specifically by the Admin
  const isSlotBlockedByAdminOnly = (date: string, time: string): boolean => {
    if (isDateBlockedByAdmin(date)) return true;
    return blockedItems.some(item => item.type === 'slot' && item.date === date && item.time === time);
  };

  // Unified slot status finder: returns available, booked, or blocked
  const getSlotStatus = (date: string, time: string): 'available' | 'booked' | 'blocked' => {
    if (isSlotBlockedByAdminOnly(date, time)) {
      return 'blocked';
    }
    
    // Check if slot has an accepted booking
    const targetMin = timeToMinutes(time);
    const isBooked = appointments.some(app => {
      if (app.status !== 'accepted' || app.date !== date) return false;
      const startMin = timeToMinutes(app.startTime);
      const endMin = timeToMinutes(app.endTime);
      return targetMin >= startMin && targetMin < endMin;
    });

    if (isBooked) return 'booked';
    
    return 'available';
  };

  // Check if a specific start time slot is blocked on a date by an accepted appointment OR Admin block
  const isSlotBlocked = (date: string, time: string): boolean => {
    if (!date || !time) return false;
    const status = getSlotStatus(date, time);
    return status === 'booked' || status === 'blocked';
  };

  // Check if an end time slot overlaps with any accepted appointments starting after startSelected OR Admin blocks
  const isEndTimeBlockedByAcceptedAppointment = (endTimeStr: string, startTimeStr: string, date: string): boolean => {
    if (!startTimeStr || !endTimeStr || !date) return false;
    const startMin = timeToMinutes(startTimeStr);
    const endMin = timeToMinutes(endTimeStr);
    
    // Check standard accepted appointment overlap
    const hasAppOverlap = appointments.some(app => {
      if (app.status !== 'accepted' || app.date !== date) return false;
      const appStart = timeToMinutes(app.startTime);
      const appEnd = timeToMinutes(app.endTime);
      return Math.max(startMin, appStart) < Math.min(endMin, appEnd);
    });
    if (hasAppOverlap) return true;

    // Check if date itself is blocked by Admin
    if (isDateBlockedByAdmin(date)) {
      return true;
    }

    // Check if any individual 30-minute slot in the range [startMin, endMin) is blocked by Admin
    for (let min = startMin; min < endMin; min += 30) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      if (isSlotBlockedByAdminOnly(date, timeStr)) {
        return true;
      }
    }

    return false;
  };

  // Check if a Start Time slot is disabled because of the 3-hour pre-booking rule
  const isStartTimeDisabled = (timeStr: string) => {
    if (!selectedDate) return false;
    const now = new Date();
    const slotDate = new Date(`${selectedDate}T${timeStr}:00`);
    if (isNaN(slotDate.getTime())) return false;
    
    // Rule: must be booked at least 3 hours before start time
    const diffMs = slotDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 3;
  };

  // Check if an End Time slot is disabled (must be later than Selected Start Time)
  const isEndTimeDisabled = (timeStr: string, startSelected: string) => {
    if (!startSelected) return false;
    const [startH, startM] = startSelected.split(':').map(Number);
    const [endH, endM] = timeStr.split(':').map(Number);
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    return endMinutes <= startMinutes;
  };

  // Effect: Auto-correct Start Time if it becomes disabled or blocked
  useEffect(() => {
    if (selectedDate && startTime) {
      if (isStartTimeDisabled(startTime) || isSlotBlocked(selectedDate, startTime)) {
        // Find first available start time option that is valid and not blocked
        const firstAvailable = START_TIME_OPTIONS.find(opt => !isStartTimeDisabled(opt.value) && !isSlotBlocked(selectedDate, opt.value));
        if (firstAvailable) {
          setStartTime(firstAvailable.value);
        } else if (selectedDate === quickDates[0]?.dateStr) {
          // If all slots are disabled for Today, automatically select Tomorrow
          const tomorrowStr = quickDates[1]?.dateStr;
          if (tomorrowStr) {
            setSelectedDate(tomorrowStr);
            setStartTime('09:00');
          }
        }
      }
    }
  }, [selectedDate, appointments]);

  // Effect: Auto-correct End Time if it is less than or equal to Start Time
  useEffect(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      
      if (endMinutes <= startMinutes) {
        // Automatically push end time to at least 1 hour after start time
        const targetEndMinutes = startMinutes + 60;
        const targetH = Math.floor(targetEndMinutes / 60);
        const targetM = targetEndMinutes % 60;
        const targetStr = `${String(targetH).padStart(2, '0')}:${String(targetM).padStart(2, '0')}`;
        
        // Find nearest end time option
        const matchingOpt = END_TIME_OPTIONS.find(opt => opt.value === targetStr);
        if (matchingOpt) {
          setEndTime(matchingOpt.value);
        } else {
          // Fallback to first end time option that is greater than start time
          const firstLater = END_TIME_OPTIONS.find(opt => !isEndTimeDisabled(opt.value, startTime));
          if (firstLater) {
            setEndTime(firstLater.value);
          }
        }
      }
    }
  }, [startTime]);

  // Duration Calculator helper
  const getDurationString = (start: string, end: string) => {
    if (!start || !end) return "";
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    let diffMin = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMin <= 0) return "";
    
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    
    let str = "";
    if (hours > 0) {
      str += `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
    }
    if (mins > 0) {
      if (str) str += " ";
      str += `${mins} ${mins === 1 ? 'Minute' : 'Minutes'}`;
    }
    return str;
  };

  const currentDurationStr = getDurationString(startTime, endTime);

  // Full validation helper
  const runValidation = (
    date: string, 
    start: string, 
    end: string, 
    name: string, 
    phone: string
  ): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: false, error: "Please enter your full name." };
    }
    if (!phone.trim()) {
      return { isValid: false, error: "Please enter your mobile number." };
    }
    
    const digitCount = phone.replace(/\D/g, "").length;
    if (digitCount < 10) {
      return { isValid: false, error: "Please enter a valid mobile number (at least 10 digits)." };
    }
    if (!date) {
      return { isValid: false, error: "Please select an appointment date." };
    }
    if (!start) {
      return { isValid: false, error: "Please select a meeting start time." };
    }
    if (!end) {
      return { isValid: false, error: "Please select a meeting end time." };
    }

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (endMinutes <= startMinutes) {
      return { 
        isValid: false, 
        error: "End Time must be later than Start Time." 
      };
    }

    const now = new Date();
    const selectedStart = new Date(`${date}T${start}:00`);

    if (isNaN(selectedStart.getTime())) {
      return { isValid: false, error: "The selected date or start time format is invalid." };
    }

    const diffMs = selectedStart.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 0) {
      return { isValid: false, error: "Selected start time has already passed. Please pick a future time." };
    }

    if (diffHours < 3) {
      return { 
        isValid: false, 
        error: "Booking rules: Appointments must be booked at least 3 hours before the selected start time. Please select a later start time." 
      };
    }

    if (isSlotBlocked(date, start)) {
      return {
        isValid: false,
        error: "The selected start time is already booked. Please choose another time slot."
      };
    }

    if (isEndTimeBlockedByAcceptedAppointment(end, start, date)) {
      return {
        isValid: false,
        error: "The chosen duration overlaps with another booked appointment on this day. Please select a shorter duration."
      };
    }

    return { isValid: true };
  };

  // Handle immediate verification feedback
  useEffect(() => {
    if (selectedDate && startTime && endTime) {
      const res = runValidation(selectedDate, startTime, endTime, "Pre-check", "9999999999");
      if (!res.isValid && res.error && !res.error.includes("name") && !res.error.includes("mobile")) {
        setValidationError(res.error);
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [selectedDate, startTime, endTime]);

  // Form Submission
  const handleBookAppointment = (e: FormEvent) => {
    e.preventDefault();
    
    const validation = runValidation(selectedDate, startTime, endTime, fullName, mobileNumber);
    
    if (!validation.isValid) {
      setValidationError(validation.error || "Please correct the form fields.");
      const errorElement = document.getElementById('booking-error-anchor');
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setValidationError(null);

    // Generate unique Tracking ID in format: Firstname + 4 random digits
    let finalTrackingId = "";
    let isUnique = false;
    let attempts = 0;
    const firstName = fullName.trim().split(/\s+/)[0].replace(/[^a-zA-Z]/g, '') || 'Client';
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    while (!isUnique && attempts < 100) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      finalTrackingId = `${capitalizedFirstName}${randomNum}`;
      if (!appointments.some(app => app.trackingId === finalTrackingId)) {
        isUnique = true;
      }
      attempts++;
    }

    setLastBookedTrackingId(finalTrackingId);
    setIsCopied(false);
    setIsSubmitted(true);

    // Format Date nicely for message
    const dateObj = new Date(`${selectedDate}T00:00:00`);
    const formattedDateStr = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const format12h = (time24: string) => {
      const [h, m] = time24.split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${String(formattedHour).padStart(2, '0')}:${m} ${ampm}`;
    };

    const formattedStart = format12h(startTime);
    const formattedEnd = format12h(endTime);
    const durationText = currentDurationStr || getDurationString(startTime, endTime);

    // Construct the WhatsApp URL message exactly in requested format
    const messageBody = `Hello Sandeep Ambariwala,

New Appointment Request

Tracking ID: 🎫 ${finalTrackingId}
Name: ${fullName.trim()}
Mobile: ${mobileNumber.trim()}
Date: ${formattedDateStr}
Start Time: ${formattedStart}
End Time: ${formattedEnd}
Total Duration: ${durationText}
Message: ${message.trim() ? message.trim() : 'No additional message.'}

Please confirm my appointment.`;

    // Save appointment details in local state for the Admin Dashboard
    const newAppointment: Appointment = {
      id: 'app-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      duration: durationText,
      message: message.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      trackingId: finalTrackingId
    };
    setAppointments(prev => [newAppointment, ...prev]);

    const encodedMsg = encodeURIComponent(messageBody);
    const whatsappLink = `https://wa.me/${WHATSAPP_URL_PHONE}?text=${encodedMsg}`;

    // Open WhatsApp
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  // Direct Chat on WhatsApp handler
  const handleDirectChat = () => {
    const defaultChatMsg = "Hello Sandeep Ambariwala, I'd like to ask a general question about your consulting services.";
    const encodedChatMsg = encodeURIComponent(defaultChatMsg);
    const directChatLink = `https://wa.me/${WHATSAPP_URL_PHONE}?text=${encodedChatMsg}`;
    window.open(directChatLink, '_blank', 'noopener,noreferrer');
  };

  const faqs = [
    {
      q: "What is the 3-hour pre-booking rule?",
      a: "To ensure proper preparation and respect Sandeep's schedule, appointments must be booked at least 3 hours before the selected start time. Slots within the next 3 hours are automatically locked."
    },
    {
      q: "Are bookings secure?",
      a: "Yes. No personal data is stored in any external database. All information compiles dynamically and securely into a secure WhatsApp text message dispatched directly from your browser to Sandeep."
    },
    {
      q: "Can I choose custom durations?",
      a: "Absolutely. Simply select your Start Time ('Kitne baje milna hai?') and End Time ('Kitne baje tak saath rehna hai?') from the dropdown options. The duration auto-calculator instantly determines the total consulting hours."
    },
    {
      q: "How do I cancel or reschedule?",
      a: "Please open WhatsApp and message Sandeep directly with your requested updates. He will coordinate the changes immediately."
    }
  ];

  const filteredAppointments = appointments.filter(app => {
    const searchLower = adminSearch.toLowerCase();
    const matchesSearch = app.fullName.toLowerCase().includes(searchLower) || 
                          app.mobileNumber.includes(adminSearch) ||
                          (app.trackingId || '').toLowerCase().includes(searchLower);
    if (adminFilter === 'all') return matchesSearch;
    return app.status === adminFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] selection:bg-emerald-100 selection:text-emerald-800 antialiased text-slate-800 font-sans">
      
      {/* Premium Notification Banner */}
      <div className="bg-[#0F172A] text-white py-2.5 px-4 text-xs font-medium tracking-wide text-center flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="tracking-widest uppercase text-[10px]">Strategic Advisory Portal — Sandeep Ambariwala</span>
      </div>

      {/* Elegant Nav Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg md:text-xl tracking-tight text-[#0F172A]">
                Sandeep Ambariwala
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">
                Corporate Advisory & Advisory
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setIsTrackOpen(true);
                setTrackMobile('');
                setHasTracked(false);
                setTrackedApps([]);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-100 transition-all cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-emerald-600" />
              <span>Track Appointment</span>
            </button>
            <button
              id="admin-portal-toggle"
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-100 rounded-full border border-slate-200 transition-all cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5 text-slate-500" />
              <span>{isAdminLoggedIn ? "Admin Portal" : "Admin Login"}</span>
            </button>
            <button
              onClick={handleDirectChat}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-200 transition-all cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat on WhatsApp
            </button>
            <a 
              href="#booking-panel"
              className="px-5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-sm shadow-emerald-600/15 transition-all duration-250"
            >
              Book Slot
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 md:py-12">
        
        {/* Luxury Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-800 text-xs font-medium">
              <Award className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Luxury Consulting Experience</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-[#0F172A] leading-[1.12]">
              Secure Your High-Value <span className="text-emerald-600">Executive Consult</span>
            </h2>
            
            <p className="text-base text-[#475569] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Schedule direct 1-on-1 strategy sessions with <strong className="font-semibold text-slate-800">Sandeep Ambariwala</strong>. 
              Enjoy a modern client-centric booking experience with automated duration trackers, strict validation safety, and instant WhatsApp dispatching.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
              <a 
                href="#booking-panel"
                className="px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/15 transition-all flex items-center gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Book Consultation</span>
              </a>
              <button
                onClick={() => {
                  setIsTrackOpen(true);
                  setTrackMobile('');
                  setHasTracked(false);
                  setTrackedApps([]);
                }}
                className="px-6 py-3 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search className="h-4 w-4 text-emerald-600" />
                <span>Track Appointment</span>
              </button>
            </div>

            {/* Premium Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-3 max-w-md mx-auto lg:mx-0 text-left">
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <p className="text-2xl font-bold font-display text-slate-900">06:00</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Start Limit</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <p className="text-2xl font-bold font-display text-slate-900">18:00</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">End Limit</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <p className="text-2xl font-bold font-display text-slate-900">3 Hours</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Min Buffer</p>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="space-y-2.5 pt-2 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 text-sm text-[#475569]">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Available daily from 06:00 AM to 06:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#475569]">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Auto-calculated duration feedback in hours and minutes</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#475569]">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Zero registration files or account signups required</span>
              </div>
            </div>
          </div>

          {/* Hero Right Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-sm p-6 text-center space-y-4 relative"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>

              <div className="relative inline-block">
                <img 
                  src={sandeepProfile} 
                  alt="Sandeep Ambariwala" 
                  className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-3 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></span>
              </div>

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">Sandeep Ambariwala</h3>
                <p className="text-xs text-slate-500 mt-0.5">Corporate Advisory & Strategic Partner</p>
              </div>

              <div className="bg-[#F8FAFC] py-2 px-3.5 rounded-lg inline-flex items-center gap-2 text-xs text-[#475569] border border-slate-100">
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-mono tracking-tight font-semibold">+91 62072 86276</span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-around gap-2 text-center text-xs text-slate-600">
                <div>
                  <Briefcase className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                  <span>Strategic Advisor</span>
                </div>
                <div className="border-l border-slate-100"></div>
                <div>
                  <Users className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                  <span>1-on-1 Sessions</span>
                </div>
                <div className="border-l border-slate-100"></div>
                <div>
                  <ShieldCheck className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                  <span>Direct Connect</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Anchor point for scrolling */}
        <div id="booking-error-anchor" className="h-1 -mt-10 mb-10"></div>

        {/* Highlighted Notice Box */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 mb-8 flex flex-col items-center text-center max-w-4xl mx-auto shadow-sm">
          <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4 border border-amber-200/40">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h4 className="font-display font-bold text-base md:text-lg text-amber-900 tracking-wide mb-2">
            📌 IMPORTANT NOTICE
          </h4>
          <p className="font-extrabold text-amber-950 text-sm md:text-base leading-snug mb-3">
            ⏰ Please book your appointment at least 3 hours before your meeting time.
          </p>
          <p className="text-xs md:text-sm text-amber-800 max-w-2xl leading-relaxed font-medium">
            To ensure proper scheduling and availability, appointment requests submitted less than 3 hours before the selected meeting time may not be accepted. We recommend booking in advance to avoid any inconvenience.
          </p>
        </div>

        {/* Main Appointment Form Panel */}
        <section id="booking-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 mb-16">
          
          {/* Grid Left: Select Date and Times (Dropdowns) */}
          <div className="lg:col-span-7 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200/80 space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Step 1: Consultation Timing
              </div>
              <h3 className="font-display font-black text-xl md:text-2xl text-[#0F172A]">
                Select Date & Business Hours
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Business appointments are exclusively hosted between 06:00 AM and 06:00 PM.
              </p>
            </div>

            {/* Error Notifications */}
            <AnimatePresence mode="wait">
              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 text-rose-800 text-sm overflow-hidden shadow-inner"
                >
                  <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold block text-xs md:text-sm uppercase tracking-wider text-rose-900">Timing Restriction Found</span>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">{validationError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Date Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                Appointment Date <span className="text-rose-500">*</span>
              </label>

              {/* Quick selectors with luxury style */}
              <div className="grid grid-cols-3 gap-2.5">
                {quickDates.map((qDate) => {
                  const isBlocked = isDateBlockedByAdmin(qDate.dateStr);
                  return (
                    <button
                      key={qDate.dateStr}
                      type="button"
                      disabled={isBlocked}
                      onClick={() => setSelectedDate(qDate.dateStr)}
                      className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                        isBlocked
                          ? 'opacity-45 border-slate-200 bg-slate-50 text-slate-400 line-through cursor-not-allowed'
                          : selectedDate === qDate.dateStr
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className="block text-[9px] uppercase tracking-wider text-slate-450 font-extrabold mb-0.5">
                        {qDate.label} {isBlocked && "⚫"}
                      </span>
                      <span className="text-xs font-display font-medium">{qDate.sub}</span>
                    </button>
                  );
                })}
              </div>

              {/* Calendar date input */}
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  min={getMinDateStr()}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-slate-800 bg-[#F8FAFC]/50 hover:bg-slate-50 transition-all font-medium cursor-pointer"
                />
                <Calendar className="absolute right-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Timing Dropdowns Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Meeting Start Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-widest">
                  Start Time (Kitne baje milna hai?) <span className="text-rose-500">*</span>
                </label>
                
                <div className="relative">
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-slate-800 bg-white hover:bg-slate-50 transition-all font-mono font-medium appearance-none cursor-pointer"
                  >
                    {START_TIME_OPTIONS.map((opt) => {
                      const is3hLocked = isStartTimeDisabled(opt.value);
                      const status = getSlotStatus(selectedDate, opt.value);
                      const isBlocked = status === 'booked';
                      const isAdminBlocked = status === 'blocked';
                      const isDisabled = is3hLocked || isBlocked || isAdminBlocked;
                      
                      let suffix = " 🟢 Available";
                      if (isAdminBlocked) {
                        suffix = " ⚫ Unavailable by Admin";
                      } else if (isBlocked) {
                        suffix = " 🔴 Already Booked";
                      } else if (is3hLocked) {
                        suffix = " (Locked - 3h buffer)";
                      }
                      
                      return (
                        <option 
                          key={opt.value} 
                          value={opt.value}
                          disabled={isDisabled}
                          className="font-sans text-slate-800 py-1"
                        >
                          {opt.label}{suffix}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Meeting End Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-widest">
                  End Time (Kitne baje tak saath rehna hai?) <span className="text-rose-500">*</span>
                </label>
                
                <div className="relative">
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-slate-800 bg-white hover:bg-slate-50 transition-all font-mono font-medium appearance-none cursor-pointer"
                  >
                    {END_TIME_OPTIONS.map((opt) => {
                      const isBeforeStart = isEndTimeDisabled(opt.value, startTime);
                      const isOverlap = isEndTimeBlockedByAcceptedAppointment(opt.value, startTime, selectedDate);
                      const isDisabled = isBeforeStart || isOverlap;
                      
                      let suffix = "";
                      if (isOverlap) {
                        // Determine if overlap is admin block or accepted booking
                        let isOverlapAdmin = false;
                        const startMin = timeToMinutes(startTime);
                        const endMin = timeToMinutes(opt.value);
                        for (let min = startMin; min < endMin; min += 30) {
                          const h = Math.floor(min / 60);
                          const m = min % 60;
                          const tStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                          if (isSlotBlockedByAdminOnly(selectedDate, tStr)) {
                            isOverlapAdmin = true;
                            break;
                          }
                        }
                        
                        suffix = isOverlapAdmin ? " ⚫ Overlaps Admin Blocked Slot" : " 🔴 Overlaps Booked Slot";
                      }
                      
                      return (
                        <option 
                          key={opt.value} 
                          value={opt.value}
                          disabled={isDisabled}
                          className="font-sans text-slate-800 py-1"
                        >
                          {opt.label}{suffix}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Dynamic Duration Box */}
            <div className="bg-[#FAFDFB] rounded-2xl p-5 border border-emerald-100/80 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Total Duration (Kitne ghante ka appointment hai?)
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider rounded-md">
                  Calculated Instantly
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  {currentDurationStr ? (
                    <motion.p 
                      key={currentDurationStr}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg font-display font-bold text-[#0F172A]"
                    >
                      {currentDurationStr}
                    </motion.p>
                  ) : (
                    <p className="text-xs font-semibold text-rose-500">
                      Error: End Time must be strictly later than Start Time.
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Duration updates dynamically based on your dropdown selection.
                  </p>
                </div>
              </div>
            </div>

            {/* Small helper info banner */}
            <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-100 text-xs text-[#64748B] flex items-start gap-2.5">
              <Info className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>How are slots displayed?</strong> Only available time slots between 06:00 AM and 06:00 PM are active. Past options or options within the 3-hour buffer remain locked automatically.
              </span>
            </div>

          </div>

          {/* Grid Right: Personal Details and Submit Button */}
          <form onSubmit={handleBookAppointment} className="lg:col-span-5 p-6 md:p-8 bg-slate-50/50 flex flex-col justify-between space-y-6">
            
            <div className="space-y-5">
              
              <div>
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Step 2: Personal Details
                </div>
                <h3 className="font-display font-black text-xl text-[#0F172A]">
                  Register Details
                </h3>
              </div>

              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none text-sm text-slate-800 bg-white transition-all shadow-sm"
                />
              </div>

              {/* Mobile Number Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-sm font-mono text-slate-400 font-semibold pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none text-sm text-slate-800 bg-white transition-all font-mono shadow-sm"
                  />
                </div>
              </div>

              {/* Message / Purpose Optional */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                  Message / Purpose <span className="text-slate-400 text-[10px] font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  placeholder="Tell Sandeep about your business strategy queries or consultation targets..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none text-sm text-slate-800 bg-white transition-all resize-none shadow-sm"
                />
              </div>

            </div>

            {/* CTA Trigger Group */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              
              {/* Primary Book Appointment Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#0F172A] hover:bg-slate-900 active:bg-[#0F172A] text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>Book Appointment</span>
              </button>

              {/* WhatsApp Secondary button */}
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-2">
                  Or bypass booking & chat directly
                </span>
                <button
                  type="button"
                  onClick={handleDirectChat}
                  className="w-full py-3 px-6 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <MessageCircle className="h-4.5 w-4.5 text-emerald-500" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>

              {/* Client protection disclaimer */}
              <p className="text-[10px] text-slate-400 text-center leading-normal">
                Direct Client Booking — Secure, high speed client-side formatting routing. No database storage.
              </p>

            </div>

          </form>

        </section>

        {/* Dynamic Success Notice Overlay */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 md:p-8 shadow-2xl text-center space-y-6 relative"
              >
                <div className="mx-auto h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-black text-xl md:text-2xl text-emerald-600 tracking-tight leading-snug">
                    ✅ Appointment Request Submitted Successfully
                  </h4>
                  <p className="text-sm text-slate-600 font-semibold">
                    Thank you for booking your appointment.
                  </p>
                </div>

                {/* Tracking ID card */}
                <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl relative space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                    Your Tracking ID
                  </span>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl md:text-2xl font-mono font-extrabold text-[#0F172A] flex items-center gap-1.5">
                      🎫 {lastBookedTrackingId}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(lastBookedTrackingId);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                      title="Copy Tracking ID"
                    >
                      {isCopied ? (
                        <Check className="h-4.5 w-4.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                  
                  {isCopied && (
                    <span className="text-[10px] text-emerald-600 font-semibold absolute bottom-1 left-1/2 -translate-x-1/2">
                      Copied to clipboard!
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                  Please save this Tracking ID for future reference. You can use this Tracking ID along with your mobile number to track your appointment status anytime.
                </p>

                {/* Status Indicator */}
                <div className="bg-amber-50 border border-amber-100/60 p-3.5 rounded-xl flex items-center justify-center gap-2 max-w-xs mx-auto">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    📌 Current Status: 🟡 Pending Review
                  </span>
                </div>

                {/* Simulated message preview */}
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100 text-left space-y-1.5 font-mono text-[11px] text-slate-600 max-h-36 overflow-y-auto">
                  <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mb-1">Prepared Message Preview</p>
                  <p>Hello Sandeep Ambariwala,</p>
                  <br />
                  <p>New Appointment Request</p>
                  <br />
                  <p>Tracking ID: 🎫 {lastBookedTrackingId}</p>
                  <p>Name: {fullName}</p>
                  <p>Mobile: {mobileNumber}</p>
                  <p>Date: {selectedDate}</p>
                  <p>Start Time: {START_TIME_OPTIONS.find(opt => opt.value === startTime)?.label || startTime}</p>
                  <p>End Time: {END_TIME_OPTIONS.find(opt => opt.value === endTime)?.label || endTime}</p>
                  <p>Total Duration: {currentDurationStr}</p>
                  <p>Message: {message || 'No additional message.'}</p>
                  <br />
                  <p>Please confirm my appointment.</p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
                  >
                    Close Form
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const format12h = (time24: string) => {
                        const [h, m] = time24.split(':');
                        const hour = parseInt(h);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const formattedHour = hour % 12 || 12;
                        return `${String(formattedHour).padStart(2, '0')}:${m} ${ampm}`;
                      };
                      const formattedStart = format12h(startTime);
                      const formattedEnd = format12h(endTime);
                      const durationText = currentDurationStr || getDurationString(startTime, endTime);
                      const dateObj = new Date(`${selectedDate}T00:00:00`);
                      const formattedDateStr = dateObj.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                      const messageBody = `Hello Sandeep Ambariwala,\n\nNew Appointment Request\n\nTracking ID: 🎫 ${lastBookedTrackingId}\nName: ${fullName.trim()}\nMobile: ${mobileNumber.trim()}\nDate: ${formattedDateStr}\nStart Time: ${formattedStart}\nEnd Time: ${formattedEnd}\nTotal Duration: ${durationText}\nMessage: ${message.trim() ? message.trim() : 'No additional message.'}\n\nPlease confirm my appointment.`;
                      window.open(`https://wa.me/${WHATSAPP_URL_PHONE}?text=${encodeURIComponent(messageBody)}`, '_blank', 'noopener,noreferrer');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Open WhatsApp
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits & Trust Icons Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 text-emerald-600">
              <Calendar className="h-5 w-5" />
            </div>
            <h4 className="font-display font-bold text-base text-[#0F172A]">
              1. Choose Boundaries
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick your target appointment date and configure precise 1-hour intervals starting at 06:00 AM.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 text-emerald-600">
              <User className="h-5 w-5" />
            </div>
            <h4 className="font-display font-bold text-base text-[#0F172A]">
              2. Add Personal Details
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your WhatsApp mobile contact number and add strategic target targets or brief advisory details.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 text-emerald-600">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h4 className="font-display font-bold text-base text-[#0F172A]">
              3. Connect Instantly
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dispatch compiled details onto WhatsApp in one click. Sandeep confirms final slots directly on his terminal.
            </p>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 max-w-3xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-8 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </div>
            <h3 className="font-display font-extrabold text-xl md:text-2xl text-[#0F172A]">
              Consultation FAQ
            </h3>
            <p className="text-xs text-slate-500">
              Discover how the booking logic is managed without complicated system files.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="border-b border-slate-100 pb-3.5 last:border-0 last:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex justify-between items-center text-left py-2 font-display font-bold text-sm text-slate-850 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-slate-500 leading-relaxed pt-1.5 pr-4 font-sans">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 text-center text-xs text-slate-500 space-y-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-extrabold text-slate-800">Sandeep Ambariwala</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-medium">Strategic Advisor & Corporate Consultant</span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleDirectChat}
              className="hover:text-emerald-600 transition-colors cursor-pointer font-medium"
            >
              Direct Chat
            </button>
            <span>•</span>
            <a 
              href="#booking-panel"
              className="hover:text-emerald-600 transition-colors font-medium"
            >
              Book Consultation
            </a>
            <span>•</span>
            <span className="text-slate-500 font-mono font-bold">WA: +91 62072 86276</span>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 Sandeep Ambariwala. All Rights Reserved.</span>
          <span className="flex items-center gap-1 font-medium">
            Verified server-free client encryption
          </span>
        </div>
      </footer>

      {/* Admin Portal Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            {!isAdminLoggedIn ? (
              /* LOGIN FORM PANEL */
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 relative"
              >
                <button
                  onClick={() => setIsAdminOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="text-center space-y-2">
                  <div className="mx-auto h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200/60 text-slate-700">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-[#0F172A] tracking-tight">
                    Admin Authentication
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Enter your advisor credentials to enter Sandeep's strategic advisory registry control deck.
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-600">Admin ID</label>
                    <input
                      type="text"
                      required
                      placeholder="admin"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-mono shadow-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-600">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-mono shadow-sm bg-white"
                    />
                  </div>

                  {adminLoginError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>{adminLoginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Authenticate Console</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              /* FULL RICH ADMIN DASHBOARD PANEL */
              <motion.div
                initial={{ scale: 0.97, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.97, y: 15 }}
                className="relative max-w-6xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header block */}
                <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        Sandeep Ambariwala
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">Secure Consultation Console v2.0</span>
                    </div>
                    <h3 className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
                      <Sliders className="h-6 w-6 text-emerald-400" />
                      Advisory Deck & Controller
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleAdminLogout}
                      className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700/60 flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log Out</span>
                    </button>
                    <button
                      onClick={() => setIsAdminOpen(false)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 rounded-xl transition-all border border-slate-700/60 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Dashboard Tab Buttons Row */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                  <div className="flex bg-slate-200/60 p-1 rounded-xl w-fit">
                    <button
                      onClick={() => setAdminTab('appointments')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        adminTab === 'appointments'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>Consultation Registry ({appointments.length})</span>
                    </button>
                    <button
                      onClick={() => setAdminTab('availability')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        adminTab === 'availability'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Availability & Blocks ({blockedItems.length})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddDemoApp}
                      className="px-3.5 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-xl border border-emerald-200/60 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Add Demo Slots</span>
                    </button>
                  </div>
                </div>

                {/* Stat Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200 bg-white shrink-0">
                  <div className="p-4 border-r border-slate-100 text-center">
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Total Consultations</span>
                    <span className="text-xl font-display font-black text-slate-900">{appointments.length}</span>
                  </div>
                  <div className="p-4 border-r border-slate-100 text-center">
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Pending Review</span>
                    <span className="text-xl font-display font-black text-amber-600">
                      {appointments.filter(a => a.status === 'pending').length}
                    </span>
                  </div>
                  <div className="p-4 border-r border-slate-100 text-center">
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Approved (Booked)</span>
                    <span className="text-xl font-display font-black text-emerald-600">
                      {appointments.filter(a => a.status === 'accepted').length}
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Admin Restrictions</span>
                    <span className="text-xl font-display font-black text-slate-800">{blockedItems.length}</span>
                  </div>
                </div>

                {/* Main Dashboard Content Workspace */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 min-h-[40vh]">
                  
                  {/* TAB 1: CONSULTATION REGISTRY */}
                  {adminTab === 'appointments' && (
                    <div className="space-y-4">
                      {/* Search & Filter Controls */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3.5">
                        {/* Search Input */}
                        <div className="relative w-full md:max-w-md">
                          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search client name, phone..."
                            value={adminSearch}
                            onChange={(e) => setAdminSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none text-sm text-slate-800 bg-white"
                          />
                        </div>

                        {/* Status Filter buttons */}
                        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                          {(['all', 'pending', 'accepted', 'completed', 'rejected'] as const).map((filterVal) => (
                            <button
                              key={filterVal}
                              onClick={() => setAdminFilter(filterVal)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all uppercase tracking-wider cursor-pointer ${
                                adminFilter === filterVal
                                  ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {filterVal}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Appointments Cards Array */}
                      {filteredAppointments.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 py-12 px-6 text-center space-y-2.5 shadow-sm">
                          <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
                          <h4 className="font-display font-bold text-slate-800 text-sm">No Appointments Found</h4>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Adjust your filters, search keyword, or try adding a few strategic demo slots to check.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredAppointments.map((app) => (
                            <div 
                              key={app.id}
                              className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-all hover:shadow-md ${
                                app.status === 'accepted' ? 'border-l-4 border-l-emerald-500 border-slate-200' :
                                app.status === 'pending' ? 'border-l-4 border-l-amber-500 border-slate-200' :
                                app.status === 'completed' ? 'border-l-4 border-l-blue-500 border-slate-200' :
                                'border-l-4 border-l-slate-400 border-slate-200'
                              }`}
                            >
                              {/* Card Header Info */}
                              <div className="flex justify-between items-start gap-2.5">
                                <div className="space-y-0.5">
                                  <h4 className="font-display font-black text-slate-900 text-base flex flex-wrap items-center gap-2">
                                    {app.fullName}
                                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                      ID: {app.id.substring(0, 6)}
                                    </span>
                                    {app.trackingId && (
                                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                                        🎫 {app.trackingId}
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-xs font-mono text-slate-500 font-semibold flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    <a 
                                      href={`https://wa.me/${app.mobileNumber}`} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="text-emerald-700 hover:underline flex items-center gap-1"
                                    >
                                      +91 {app.mobileNumber}
                                      <MessageCircle className="h-3 w-3" />
                                    </a>
                                  </p>
                                </div>

                                {/* Status Badge */}
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  app.status === 'accepted' ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' :
                                  app.status === 'pending' ? 'bg-amber-50 border border-amber-100 text-amber-800' :
                                  app.status === 'completed' ? 'bg-blue-50 border border-blue-100 text-blue-800' :
                                  'bg-slate-50 border border-slate-200 text-slate-600'
                                }`}>
                                  {app.status === 'accepted' ? '🟢 APPROVED' :
                                   app.status === 'pending' ? '⏳ PENDING' :
                                   app.status === 'completed' ? '✅ COMPLETED' :
                                   '❌ REJECTED'}
                                </span>
                              </div>

                              {/* Target details */}
                              <div className="bg-slate-50/85 p-3.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Appointment Date</span>
                                  <p className="font-mono text-slate-800 font-medium">{app.date}</p>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Time & Duration</span>
                                  <p className="font-mono text-slate-800 font-medium">
                                    {app.startTime} - {app.endTime} ({app.duration})
                                  </p>
                                </div>
                              </div>

                              {/* Purpose comment */}
                              {app.message && (
                                <div className="text-xs text-slate-600 bg-[#FAFAFA] p-3 rounded-xl border border-slate-100 leading-relaxed font-sans italic">
                                  "{app.message}"
                                </div>
                              )}

                              {/* Operational CTA Actions */}
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                                {app.status === 'pending' && (
                                  <button
                                    onClick={() => handleAcceptApp(app.id)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Accept</span>
                                  </button>
                                )}

                                {app.status === 'accepted' && (
                                  <button
                                    onClick={() => handleCompleteApp(app.id)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Complete</span>
                                  </button>
                                )}

                                {(app.status === 'pending' || app.status === 'accepted') && (
                                  <button
                                    onClick={() => handleRejectApp(app.id)}
                                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-250 font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Reject</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => setEditingAppointment(app)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-slate-250"
                                >
                                  <Sliders className="h-3.5 w-3.5" />
                                  <span>Edit Details</span>
                                </button>

                                <button
                                  onClick={() => setDeletingId(app.id)}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-rose-250 ml-auto"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: SCHEDULE BLOCKING & OVERRIDES */}
                  {adminTab === 'availability' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* 1. Date Level Blocks Column (Left) */}
                      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-display font-black text-slate-950 text-base flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-emerald-600" />
                            Date Restrictions
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Block entire days immediately (bypasses any availability hours)
                          </p>
                        </div>

                        {/* Interactive date selector block input */}
                        <div className="flex gap-2.5">
                          <input
                            type="date"
                            min={getMinDateStr()}
                            value={availManageDate}
                            onChange={(e) => setAvailManageDate(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800"
                          />
                          <button
                            onClick={() => handleToggleDateBlock(availManageDate)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer ${
                              isDateBlockedByAdmin(availManageDate)
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isDateBlockedByAdmin(availManageDate) ? "Unblock Date" : "Block Entire Date"}
                          </button>
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                            Active Admin-Blocked Days
                          </span>

                          {blockedItems.filter(item => item.type === 'date').length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-3">No entire dates currently blocked by Admin.</p>
                          ) : (
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                              {blockedItems.filter(item => item.type === 'date').map((block) => (
                                <div 
                                  key={block.id}
                                  className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs text-slate-700 font-mono"
                                >
                                  <span>⚫ {block.date}</span>
                                  <button
                                    onClick={() => handleToggleDateBlock(block.date)}
                                    className="p-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-md transition-all cursor-pointer"
                                    title="Unblock date"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2. Interactive Time Slot Grid (Right) */}
                      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-display font-black text-slate-950 text-base flex items-center gap-2">
                            <Clock className="h-5 w-5 text-emerald-600" />
                            Time Slot Manager
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Select a date above or click below to toggle individual 30-minute intervals for <strong className="font-semibold text-slate-800 font-mono">{availManageDate}</strong>
                          </p>
                        </div>

                        {/* Date selection for time slot grids */}
                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 w-fit text-xs font-mono text-slate-700">
                          <span>Target Date:</span>
                          <input
                            type="date"
                            min={getMinDateStr()}
                            value={availManageDate}
                            onChange={(e) => setAvailManageDate(e.target.value)}
                            className="bg-transparent font-bold text-slate-950 focus:outline-none focus:underline border-0 p-0"
                          />
                        </div>

                        {isDateBlockedByAdmin(availManageDate) ? (
                          <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
                            <AlertCircle className="h-6 w-6 text-slate-600 mx-auto" />
                            <h5 className="font-display font-bold text-slate-800 text-sm">Entire Date is Blocked</h5>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto">
                              Because you have blocked {availManageDate} entirely, all time slots for this day are automatically marked as ⚫ Unavailable to clients.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-1">
                              {START_TIME_OPTIONS.map((opt) => {
                                const status = getSlotStatus(availManageDate, opt.value);
                                
                                // Find any accepted appointment covering this slot
                                const targetMin = timeToMinutes(opt.value);
                                const bookedApp = appointments.find(app => {
                                  if (app.status !== 'accepted' || app.date !== availManageDate) return false;
                                  const startMin = timeToMinutes(app.startTime);
                                  const endMin = timeToMinutes(app.endTime);
                                  return targetMin >= startMin && targetMin < endMin;
                                });

                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      if (bookedApp) {
                                        // If booked, clicking it lets Sandeep view or edit the appointment details!
                                        setEditingAppointment(bookedApp);
                                      } else {
                                        // Otherwise, toggle slot blocking
                                        handleToggleSlotBlock(availManageDate, opt.value);
                                      }
                                    }}
                                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer text-xs space-y-1 relative ${
                                      status === 'booked'
                                        ? 'border-rose-200 bg-rose-50/40 text-rose-950 hover:bg-rose-50'
                                        : status === 'blocked'
                                        ? 'border-slate-800 bg-slate-900 text-white hover:bg-slate-800'
                                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center gap-1 font-mono font-bold">
                                      <span>{opt.label}</span>
                                      <span>
                                        {status === 'booked' ? '🔴' : status === 'blocked' ? '⚫' : '🟢'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] truncate leading-none text-slate-400 font-sans font-medium">
                                      {status === 'booked' ? `Booked: ${bookedApp?.fullName}` :
                                       status === 'blocked' ? 'Admin Restricted' : 'Open / Available'}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-4 pt-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-t border-slate-100">
                              <span className="flex items-center gap-1">🟢 Available (Open)</span>
                              <span className="flex items-center gap-1">🔴 Already Booked</span>
                              <span className="flex items-center gap-1">⚫ Unavailable by Admin</span>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>

              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editing Appointment Sub-Modal Popup */}
      <AnimatePresence>
        {editingAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setEditingAppointment(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1.5 pb-2 border-b border-slate-150">
                <h4 className="font-display font-black text-slate-900 text-lg flex items-center gap-1.5">
                  <Sliders className="h-5 w-5 text-emerald-600 animate-spin-slow" />
                  Edit Appointment Details
                </h4>
                <p className="text-xs text-slate-400">
                  Override client inputs, adjust schedule ranges, and manage status flags.
                </p>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3">
                
                {/* Tracking ID */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Tracking ID</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.trackingId || ''}
                    onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, trackingId: e.target.value.trim() } : null)}
                    placeholder="e.g. Rahul1356"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-emerald-500 bg-white text-slate-800"
                  />
                </div>

                {/* Client Name */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Client Name</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.fullName}
                    onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-emerald-500 bg-white text-slate-800"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.mobileNumber}
                    onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, mobileNumber: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-500 bg-white text-slate-800"
                  />
                </div>

                {/* Grid Date & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Appointment Date</label>
                    <input
                      type="date"
                      required
                      value={editingAppointment.date}
                      onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, date: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-500 bg-white text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Appointment Status</label>
                    <select
                      value={editingAppointment.status}
                      onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                      className="w-full px-2 py-2 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-emerald-500 bg-white text-slate-800"
                    >
                      <option value="pending">⏳ Pending Review</option>
                      <option value="accepted">🟢 Approved (Blocked)</option>
                      <option value="completed">✅ Completed</option>
                      <option value="rejected">❌ Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Start & End Times */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Start Time</label>
                    <select
                      value={editingAppointment.startTime}
                      onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, startTime: e.target.value } : null)}
                      className="w-full px-2 py-2 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-500 bg-white text-slate-800"
                    >
                      {START_TIME_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">End Time</label>
                    <select
                      value={editingAppointment.endTime}
                      onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, endTime: e.target.value } : null)}
                      className="w-full px-2 py-2 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-500 bg-white text-slate-800"
                    >
                      {END_TIME_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message / Purpose */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Message / Purpose</label>
                  <textarea
                    rows={2}
                    value={editingAppointment.message}
                    onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, message: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-emerald-500 resize-none bg-white text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={() => setEditingAppointment(null)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-900 text-white font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-5 text-center relative"
            >
              <div className="mx-auto h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100">
                <Trash2 className="h-6 w-6 text-rose-600" />
              </div>

              <div className="space-y-2">
                <h4 className="font-display font-black text-lg text-slate-900 leading-snug">
                  Delete Appointment
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to delete this appointment?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = deletingId;
                    handleDeleteApp(id);
                    setShowDeleteSuccess(true);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Success Modal */}
      <AnimatePresence>
        {showDeleteSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4 text-center relative"
            >
              <div className="mx-auto h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-black text-base text-emerald-600 leading-snug">
                  ✅ Appointment deleted successfully.
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The appointment has been removed and the time slot is now available.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteSuccess(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track Appointment Modal */}
      <AnimatePresence>
        {isTrackOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setIsTrackOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 text-emerald-700">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-display font-extrabold text-2xl text-[#0F172A] tracking-tight">
                  Track Appointment Status
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Enter your Tracking ID and registered Mobile Number below to track your appointment details and status.
                </p>
              </div>

              <form onSubmit={handleTrackSearch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-600 block">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-semibold">+91</span>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        placeholder="10-digit number"
                        value={trackMobile}
                        onChange={(e) => setTrackMobile(e.target.value.replace(/\D/g, '').substring(0, 10))}
                        className="w-full pl-12 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-mono shadow-sm bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-600 block">Tracking ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul1356"
                      value={trackTrackingId}
                      onChange={(e) => setTrackTrackingId(e.target.value.trim())}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-mono shadow-sm bg-white text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0F172A] hover:bg-slate-850 text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Search className="h-4 w-4 text-emerald-400" />
                  <span>Search Consultations</span>
                </button>
              </form>

              {/* Search Results */}
              {hasTracked && (
                <div className="border-t border-slate-100 pt-5 space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                  <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                    Search Results ({trackedApps.length})
                  </h4>

                  {trackedApps.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl text-center space-y-1.5">
                      <AlertCircle className="h-5 w-5 text-amber-500 mx-auto" />
                      <p className="font-semibold text-slate-800 text-xs">No Appointments Found</p>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        No scheduled requests found matching Mobile (+91 {trackMobile}) and Tracking ID ({trackTrackingId}). Please double-check both credentials.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {trackedApps.map((app) => {
                        const dateObj = new Date(`${app.date}T00:00:00`);
                        const formattedDateStr = dateObj.toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });

                        const format12h = (time24: string) => {
                          const [h, m] = time24.split(':');
                          const hour = parseInt(h);
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          const formattedHour = hour % 12 || 12;
                          return `${String(formattedHour).padStart(2, '0')}:${m} ${ampm}`;
                        };

                        return (
                          <div
                            key={app.id}
                            className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3 hover:border-slate-300 transition-all"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h5 className="font-semibold text-slate-900 text-sm">{app.fullName}</h5>
                                <p className="text-[10px] text-slate-400 font-mono">ID: {app.id.substring(0, 8).toUpperCase()}</p>
                              </div>

                              {/* Status Badge */}
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                                app.status === 'accepted' ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' :
                                app.status === 'pending' ? 'bg-amber-50 border border-amber-100 text-amber-800' :
                                app.status === 'completed' ? 'bg-blue-50 border border-blue-100 text-blue-800' :
                                'bg-rose-50 border border-rose-100 text-rose-800'
                              }`}>
                                {app.status === 'pending' && '🟡 Pending'}
                                {app.status === 'accepted' && '🟢 Accepted'}
                                {app.status === 'rejected' && '🔴 Rejected'}
                                {app.status === 'completed' && '✅ Completed'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-[11px] font-mono">
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Meeting Date</span>
                                <span className="text-slate-800 font-medium">{formattedDateStr}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Duration</span>
                                <span className="text-slate-800 font-medium">{app.duration}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Tracking ID</span>
                                <span className="text-emerald-700 font-extrabold">🎫 {app.trackingId}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Reference ID</span>
                                <span className="text-slate-500">{app.id.substring(0, 8).toUpperCase()}</span>
                              </div>
                              <div className="col-span-2 border-t border-slate-100/60 pt-1.5 mt-1">
                                <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Time Slot</span>
                                <span className="text-slate-800 font-medium">{format12h(app.startTime)} - {format12h(app.endTime)}</span>
                              </div>
                            </div>

                            {app.message && (
                              <p className="text-[11px] text-slate-500 italic bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                                "{app.message}"
                              </p>
                            )}

                            {/* WhatsApp Follow-up CTA */}
                            <button
                              type="button"
                              onClick={() => {
                                const defaultFollowUp = `Hello Sandeep Ambariwala, I am checking the status of my appointment (ID: ${app.id.substring(0, 8).toUpperCase()}) booked for ${formattedDateStr} from ${format12h(app.startTime)} to ${format12h(app.endTime)}. My mobile is +91 ${app.mobileNumber}.`;
                                window.open(`https://wa.me/${WHATSAPP_URL_PHONE}?text=${encodeURIComponent(defaultFollowUp)}`, '_blank', 'noopener,noreferrer');
                              }}
                              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-xl transition-all border border-emerald-150/60 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>Enquire on WhatsApp</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
