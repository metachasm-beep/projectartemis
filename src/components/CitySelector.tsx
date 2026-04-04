import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Comprehensive list of prominent Indian cities (Tier 1, Tier 2, Tier 3)
const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
  "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi",
  "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
  "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad",
  "Mysore", "Tiruchirappalli", "Bareilly", "Aligarh", "Tiruppur", "Gurgaon", "Moradabad", "Jalandhar", "Bhubaneswar", "Salem",
  "Warangal", "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur", "Bikaner", "Amravati", "Noida", "Jamshedpur", "Bhilai",
  "Cuttack", "Firozabad", "Kochi", "Nellore", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded",
  "Kolhapur", "Ajmer", "Akola", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi", "Ulhasnagar",
  "Jammu", "Sangli-Miraj & Kupwad", "Mangalore", "Erode", "Belgaum", "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Jalgaon",
  "Udaipur", "Maheshtala", "Davanagere", "Kozhikode", "Akbarpur", "Rajpur Sonarpur", "Rajahmundry", "Bokaro", "South Dumdum", "Bellary",
  "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar", "Bhatpara", "Panihati", "Latur", "Dhule", "Tirupati",
  "Rohtak", "Korba", "Bhilwara", "Berhampur", "Muzaffarpur", "Ahmednagar", "Mathura", "Kollam", "Avadi", "Kadapa",
  "Kamarhati", "Sambalpur", "Bilaspur", "Shahjahanpur", "Satara", "Bijapur", "Rampur", "Shimoga", "Chandrapur", "Junagadh",
  "Thrissur", "Alwar", "Bardhaman", "Kulti", "Kakinada", "Nizamabad", "Parbhani", "Tumkur", "Khammam", "Ozhukarai",
  "Bihar Sharif", "Panvel", "Darbhanga", "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Karnal", "Bathinda", "Jalna",
  "Eluru", "Barasat", "Kirari Suleman Nagar", "Purnia", "Satna", "Mau", "Sonipat", "Farrukhabad", "Sagar", "Rourkela",
  "Durg", "Imphal", "Ratlam", "Hapur", "Anantapur", "Arrah", "Karimnagar", "Ramagundam", "Etawah", "Bharatpur",
  "Begusarai", "New Delhi", "Chandausi", "Rewa", "Mirzapur", "Yamunanagar", "Pallavaram", "Vizianagaram", "Katihar", "Haridwar",
  "Thanjavur", "Nagercoil", "Haldia", "Bulandshahr", "Gurugram", "Secunderabad", "Shimla", "Puducherry", "Ganganagar", "Ambala"
].sort();

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
  error?: boolean;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCities = INDIAN_CITIES.filter(city => 
    city.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-full bg-white/5 border rounded-2xl flex items-center justify-between px-6 cursor-pointer transition-all ${
          isOpen ? 'border-mat-gold ring-1 ring-mat-gold/20' : error ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-3">
          <MapPin size={18} className={value ? 'text-mat-gold' : 'text-white/20'} />
          <span className={`text-[12px] font-mono tracking-widest uppercase ${value ? 'text-white' : 'text-white/20'}`}>
            {value || "Select Your City"}
          </span>
        </div>
        <ChevronDown size={18} className={`text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-3 z-[100] mat-glass-deep p-4 rounded-3xl overflow-hidden"
          >
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input
                autoFocus
                type="text"
                placeholder="Search cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-[11px] uppercase font-mono tracking-widest text-white outline-none focus:border-mat-gold/50 transition-all"
              />
            </div>

            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-1">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onChange(city);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      value === city 
                        ? 'bg-mat-gold text-black' 
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {city}
                  </button>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">No cities found matching your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
