import type { Metadata } from "next";
import {
  PrimaryServicePage,
  primaryServiceMetadata,
} from "@/components/pages/primary-service-page";

export async function generateMetadata(): Promise<Metadata> {
  return primaryServiceMetadata("cleaning");
}

export default async function AirconCleaningPage() {
  return <PrimaryServicePage segment="cleaning" />;
}
