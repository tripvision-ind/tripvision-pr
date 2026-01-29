// Brand Information
export const BRAND = {
  name: "TripVision",
  tagline: "Crafting Unforgettable Journeys",
  description:
    "TripVision is a premier travel company with over 30 years of experience in crafting unforgettable journeys across the globe. We specialize in personalized travel experiences that cater to your unique preferences.",
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
    "At Trip Vision, we don't just plan trips—we craft unforgettable experiences tailored to your desires. Our personalized approach ensures every journey is unique, memorable, and meaningful.",
  overview: `TRIP VISION is a tour operator company with over 30 years of experience, headquartered in Mumbai. We specialize in both domestic and international tour packages, offering Group Tours, Family Tours, Honeymoon Tours, Corporate Tours, Student Group Tours, Leisure Tours, Trekking Tours, and Biker Tours.

Founded in 1994, Trip Vision was created with a clear vision: to redefine travel experiences by delivering excellence, trust, and unforgettable memories. Over the years, our expertise has grown to cater to both seasoned travelers and those discovering the world for the first time.`,
  location:
    "You can find us at J.S.S Road, Marine Lines, near Metro Cinema, Mumbai. Visit us and let's start planning your next adventure.",
  cta: "Let's turn your travel dreams into unforgettable memories—contact us now to get started.",
};

// Tour Types
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
