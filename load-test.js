import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 100 }, // Ramp up to 100 users over 1 minute
        { duration: '3m', target: 500 }, // Ramp up to 500 users and hold for 3 minutes
        { duration: '1m', target: 0 },   // Ramp down to 0 users over 1 minute
    ],
};

export default function () {

    const res =  http.get('http://9.223.64.113:9000/catalog');

    check(res, {
        'is status 200': (r) => r.status === 200,
    });

    // Sleep for 1 second between requests so we don't accidentally DDoS your laptop
    sleep(1);
}