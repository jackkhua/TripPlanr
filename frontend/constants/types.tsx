export type NavLink = {
  name: string;
  path: string;
};

export type User = {
  id: string;
  email: string; // user_name in DB
  last_login_dt: Date;
  meta_data: Object; // questionnaire answers
};

export type Geography = {
  location_code: string;
  location: string;
  city: string;
  country: string;
};

export type Attraction = {
  id: string;
  name: string;
  rating: number;
  location_code: string;
  country: string;
  img: string;
  tags: string[];
};

export type Restaurant = {
  id: string;
  name: string;
  rating: number;
  location_code: string;
  country: string;
  source_site_id: number;
};

export type TripObj = {
  id: string;
  schedule: Object;
  user_id: string;
  meta_data: Object;
};
