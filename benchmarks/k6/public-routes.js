import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "1m",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000"],
  },
};

export default function () {
  const baseUrl = __ENV.BASE_URL || "http://localhost:3000";

  const routes = ["/", "/sitemap.xml"];

  for (const route of routes) {
    const res = http.get(`${baseUrl}${route}`);

    check(res, {
      [`${route} status is 200`]: (r) => r.status === 200,
      [`${route} duration < 1000ms`]: (r) => r.timings.duration < 1000,
    });
  }

  sleep(1);
}
