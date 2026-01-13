// Event Types
export interface LocalizedText {
  arabic: string;
  english: string;
}

export interface EventDate {
  start: string;
  end: string;
  timing_note: LocalizedText;
}

export interface EventLocation {
  arabic: string;
  english: string;
  city: string;
  country: string;
}

export interface Organizer {
  name: string;
  english: string;
}

export interface Event {
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  date: EventDate;
  location: EventLocation;
  organizers: Organizer[];
}

// Activity Types
export interface PreviousEdition {
  edition: number;
  year: number;
  date: string;
  participants: number;
  distance_km: number;
  location: LocalizedText;
  highlights: string[];
}

export interface Activity {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  type: string;
  edition?: number;
  features_2026?: LocalizedText;
  prizes?: { main_prize: string };
  previous_editions?: PreviousEdition[];
  media_coverage?: { description: LocalizedText };
  sport?: string;
  level?: string;
  eligibility?: string[];
  participants_count?: string;
  voting_system?: string;
  criteria?: string[];
  target?: { trees_to_plant: number; method: string };
  eco_pen_concept?: LocalizedText;
  innovation_note?: LocalizedText;
  features?: string[];
  date?: string;
}

// Media Partners Types
export interface MediaPartners {
  satellite_channels: string[];
  magazines: string[];
  participants_types: string[];
}

// Brand Types
export interface Brand {
  name: string;
  english?: string;
  type: string;
}

// Complete Event Data Type
export interface EventData {
  event: Event;
  activities: Activity[];
  media_partners: MediaPartners;
  objectives: LocalizedText[];
  themes: string[];
  target_audience: LocalizedText;
  metadata: {
    source_document: string;
    total_pages: number;
    language: string;
    parsed_date: string;
    brands: Brand[];
  };
}

// Component Props Types
export interface SectionProps {
  className?: string;
  id?: string;
}

export interface AnimationProps {
  delay?: number;
  duration?: number;
  once?: boolean;
}
