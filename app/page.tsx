import { getEventDataServer } from "@/lib/event-data";
import { HomePageClient } from "./home-page-client";

export default async function Home() {
  const eventData = await getEventDataServer();
  
  return <HomePageClient eventData={eventData} />;
}
