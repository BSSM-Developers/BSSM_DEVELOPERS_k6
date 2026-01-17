import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://stg-proxy.bssm-dev.com';
const HEADERS = {
  'bssm-dev-token': __ENV.BSSM_DEVELOPERS_CLIENT_ID,
  'bssm-dev-secret': __ENV.BSSM_DEVELOPERS_SECRET_KEY,
};

export const options = {
  scenarios: {
    ramp_300_users: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '2m', target: 300 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/proxy-server/posts`, { headers: HEADERS });
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
