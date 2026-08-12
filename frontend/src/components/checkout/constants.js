export const EXPRESS_DAYS = { min: 1, max: 2 };
export const STANDARD_DAYS = { min: 3, max: 5 };

export const PAKISTAN_PROVINCES = [
  { value: 'punjab', label: 'Punjab' },
  { value: 'sindh', label: 'Sindh' },
  { value: 'kpk', label: 'Khyber Pakhtunkhwa' },
  { value: 'balochistan', label: 'Balochistan' },
  { value: 'gilgit-baltistan', label: 'Gilgit Baltistan' },
  { value: 'ajk', label: 'Azad Jammu & Kashmir' },
  { value: 'islamabad', label: 'Islamabad Capital Territory' },
];

export const CITIES_BY_PROVINCE = {
  punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur', 'Gujrat'],
  sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Thatta', 'Jacobabad'],
  kpk: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Dera Ismail Khan', 'Bannu'],
  balochistan: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi', 'Zhob'],
  'gilgit-baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Chilas', 'Ghizer'],
  ajk: ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Bagh', 'Bhimber'],
  islamabad: ['Islamabad'],
};

export function formatDate(d) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export function getEstimatedDelivery(days) {
  const start = new Date();
  start.setDate(start.getDate() + days.min);
  const end = new Date();
  end.setDate(end.getDate() + days.max);
  return `${formatDate(start)}\u2013${formatDate(end)}, ${end.getFullYear()}`;
}
