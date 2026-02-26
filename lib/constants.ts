// Brand Information
export const BRAND = {
  name: "TripVision",
  tagline: "Turn Your Dream Holidays Into Unforgettable Memories",
  description:
    "At Tripvision.in, we turn your dream holidays into unforgettable memories. As India's leading travel agency, we offer custom, budget-friendly travel experiences — from scenic hill stations and tropical islands to spiritual journeys across the subcontinent.",
  founded: 1994,
  experience: "30+",
  logo: "/logo.png",
};

// Contact Information
export const CONTACT = {
  primaryPhone: "87795 33567",
  secondaryPhone: "93222 37350",
  primaryEmail: "tripvision.in@gmail.com",
  secondaryEmail: "nepalvision@gmail.com",
  whatsappNumber: "918779533567",
};

// Social Media
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/tripvision",
  instagram: "https://instagram.com/tripvision",
  twitter: "https://twitter.com/tripvision",
  youtube: "https://youtube.com/tripvision",
  linkedin: "https://linkedin.com/company/tripvision",
};

// Branch Offices
export const BRANCH_OFFICES = [
  {
    name: "Mumbai Branch Office",
    address:
      "01, 1st Floor, Karanjia Building, 653-A, J.S.S Road, Marine Lines, Near Metro Cinema, Next to Kyani & Co Bakery",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400002",
    country: "India",
  },
  {
    name: "Siliguri Branch Office",
    address:
      "4th Floor, Sharda Mansion, Near Sharda Auto Care, Next to Hotel Apollo, Mallaguri",
    city: "Siliguri",
    state: "West Bengal",
    pincode: "734003",
    country: "India",
  },
  {
    name: "Nepal Branch Office",
    address: "Ward No. 20, Building No. 238, Purnachandi, Lalitpur, Patan",
    city: "Kathmandu",
    country: "Nepal",
  },
  {
    name: "Bhutan Branch Office",
    address: "Above Sherza Venture, Kinely Wangmo Building, Olakha",
    city: "Thimphu",
    country: "Bhutan",
  },
];

// About Content
export const ABOUT = {
  short:
    "At Tripvision.in, we turn your dream holidays into unforgettable memories. As India's leading travel agency, we offer personalized, budget-friendly travel experiences — whether you're seeking scenic hill stations, tropical island retreats, or spiritual journeys across the subcontinent.",
  overview: `Tripvision.in is a trusted online travel booking service and holiday planner for the nation. Whether you're searching for a 'travel agency near me', 'book holiday packages online', or the 'best travel deals', our goal is to provide you with convenience, expert advice, and the best value for your money.

We are a trusted source for booking any type of vacation throughout India. From budget-friendly holiday package tours to luxury travel packages, we cater to every travel dream and every budget consideration.

Founded in 1994 and headquartered in Mumbai, Tripvision has grown to become one of India's most trusted travel companies — offering Group Tours, Family Tours, Honeymoon Tours, Corporate Tours, Student Group Tours, Leisure Tours, Trekking Tours, and Biker Tours.`,
  location:
    "You can find us at J.S.S Road, Marine Lines, near Metro Cinema, Mumbai. Visit us and let's start planning your next adventure.",
  cta: "Ready to explore India or the world? Whether you're searching for the best travel agency in India or the perfect tour package online, Tripvision.in has your adventures covered. Let's get started!",
};

export const TOUR_TYPES = [
  "Group Tours",
  "Family Tours",
  "Honeymoon Tours",
  "Corporate Tours",
  "Student Group Tours",
  "Leisure Tours",
  "Trekking Tours",
  "Biker Tours",
];

// Duration Options
export const DURATION_OPTIONS = [
  { label: "1-3 Days", value: "1-3" },
  { label: "4-6 Days", value: "4-6" },
  { label: "7-10 Days", value: "7-10" },
  { label: "11-15 Days", value: "11-15" },
  { label: "15+ Days", value: "15+" },
];

// Month Options
export const MONTH_OPTIONS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

// Default Navigation Links (fallback if DB is empty)
export const DEFAULT_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "India Holidays", href: "/packages/domestic" },
  { label: "International Holidays", href: "/packages/international" },
  { label: "Destinations", href: "/destinations" },
  { label: "Blogs", href: "/blogs" },
  { label: "Our Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];
