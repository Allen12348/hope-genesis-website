import type { Metadata } from "next";
import {
  PrimaryServicePage,
  primaryServiceMetadata,
} from "@/components/pages/primary-service-page";

export async function generateMetadata(): Promise<Metadata> {
  return primaryServiceMetadata("maintenance");
}

export default async function PreventiveMaintenancePage() {
  return <PrimaryServicePage segment="maintenance" />;
}
