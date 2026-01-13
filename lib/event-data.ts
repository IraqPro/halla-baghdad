import type { EventData } from "./types";

let cachedData: EventData | null = null;

export async function getEventData(): Promise<EventData> {
  if (cachedData) return cachedData;

  const response = await fetch("/event_details.json");
  cachedData = await response.json();
  return cachedData as EventData;
}

// For server-side usage
export async function getEventDataServer(): Promise<EventData> {
  const fs = await import("fs/promises");
  const path = await import("path");
  
  const filePath = path.join(process.cwd(), "public", "event_details.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data) as EventData;
}
