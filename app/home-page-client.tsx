"use client";

import { Header, Footer } from "@/components/layout";
import {
  HeroSection,
  AboutSection,
  StatsSection,
  ActivitiesSection,
  MarathonSection,
  EcoPenSection,
  PartnersSection,
  RegistrationSection,
} from "@/components/sections";
import type { EventData } from "@/lib/types";

interface HomePageClientProps {
  eventData: EventData;
}

export function HomePageClient({ eventData }: HomePageClientProps) {
  const { event, activities, media_partners, objectives } = eventData;
  
  // Find marathon and eco-pen activities
  const marathon = activities.find((a) => a.type === "marathon");
  const ecoPen = activities.find((a) => a.type === "environmental_campaign");

  return (
    <>
      <Header />
      
      <main className="overflow-hidden">
        <HeroSection event={event} />
        <ActivitiesSection activities={activities} />
        {/* <AboutSection objectives={objectives} /> */}
        <StatsSection />
        {marathon && <MarathonSection marathon={marathon} />}
        {ecoPen && <EcoPenSection ecoPen={ecoPen} />}
        <PartnersSection mediaPartners={media_partners} />
        <RegistrationSection />
      </main>

      <Footer />
    </>
  );
}
