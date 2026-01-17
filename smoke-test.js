import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://proxy-dev.bssm-dev.com';

export const options = {
  tags : {
    "test" : "smoke"
  },
  vus: 1,
  duration: '30s',
};

export default function () {
  const headers = {
    'bssm-dev-token': __ENV.BSSM_DEVELOPERS_CLIENT_ID,
    'bssm-dev-secret': __ENV.BSSM_DEVELOPERS_SECRET_KEY,
  };
  
  const res = http.get(`${BASE_URL}/proxy-server/posts`, { headers });
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}