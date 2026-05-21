import type { Metadata } from "next";
import {
  PrimaryServicePage,
  primaryServiceMetadata,
} from "@/components/pages/primary-service-page";

export async function generateMetadata(): Promise<Metadata> {
  return primaryServiceMetadata("installation");
}

export default async function AirconInstallationPage() {
  return <PrimaryServicePage segment="installation" />;
}
