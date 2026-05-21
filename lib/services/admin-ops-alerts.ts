import { prisma } from "@/lib/db/prisma";
import { withRequestTiming } from "@/lib/performance/with-request-timing";
import { logAdminRenderError } from "@/lib/server/log-admin-render-error";

export type AdminOpsAlertsDetail = {
  total: number;
  pendingTestimonials: number;
};

const EMPTY_OPS_ALERTS: AdminOpsAlertsDetail = {
  total: 0,
  pendingTestimonials: 0,
};

/** CMS moderation alerts for the admin shell — no operational ERP queues. */
export async function getAdminOpsAlertsDetail(): Promise<AdminOpsAlertsDetail> {
  return withRequestTiming("getAdminOpsAlertsDetail", async () => {
    try {
      const pendingTestimonials = await prisma.testimonial.count({
        where: { approved: false, rejected: false },
      });
      return {
        total: pendingTestimonials,
        pendingTestimonials,
      };
    } catch (error) {
      logAdminRenderError("getAdminOpsAlertsDetail", error);
      return EMPTY_OPS_ALERTS;
    }
  });
}
