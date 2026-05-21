import type { Metadata } from "next";
import {
  PrimaryServicePage,
  primaryServiceMetadata,
} from "@/components/pages/primary-service-page";

export async function generateMetadata(): Promise<Metadata> {
  return primaryServiceMetadata("repair");
}

export default async function RepairPage() {
  return <PrimaryServicePage segment="repair" />;
}
