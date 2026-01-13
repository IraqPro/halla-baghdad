import { VotingPage } from "@/components/voting";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التصويت | مسابقة أفضل صانع محتوى ٢٠٢٥ | هلة بغداد",
  description:
    "صوّت لصانع المحتوى المفضل لديك في مسابقة أفضل صانع محتوى اجتماعي وتوعوي لسنة ٢٠٢٥",
};

export default function VotePage() {
  return <VotingPage />;
}
