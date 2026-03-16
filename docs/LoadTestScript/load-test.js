import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '1m', target: 100 },
        { duration: '3m', target: 500 },
        { duration: '1m', target: 100 },
    ],
};

const BASE_URL = 'https://4.225.128.203/catalog';

const GENRES = ['Fantasy', 'Dystopian', 'Thriller', 'Mystery', 'Science Fiction', 'Horror', 'Classic', 'Young Adult'];
const KEYWORDS = ['the', 'art', 'war', 'game', 'dark', 'great', 'lost', 'shadow', 'fire', 'blood', 'mind', 'time'];

function browseBooks() {
    const page = Math.floor(Math.random() * 40) + 1;
    return http.get(`${BASE_URL}?page=${page}`);
}

function searchByKeyword() {
    const word = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
    const page = Math.floor(Math.random() * 20) + 1;
    return http.get(`${BASE_URL}/search?query=${word}&page=${page}`);
}

function searchByGenre() {
    const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
    const page = Math.floor(Math.random() * 10) + 1;
    return http.get(`${BASE_URL}/search?genre=${encodeURIComponent(genre)}&page=${page}`);
}

function viewBook() {
    const bookNumber = String(Math.floor(Math.random() * 50) + 1).padStart(3, '0');
    return http.get(`${BASE_URL}/B${bookNumber}`);
}

export default function () {
    const roll = Math.random();

    if (roll < 0.15) {
        const res = browseBooks();
        check(res, { 'listing 200': (r) => r.status === 200 });

    } else if (roll < 0.55) {
        const res = searchByKeyword();
        check(res, { 'search 200': (r) => r.status === 200 });

    } else if (roll < 0.80) {
        const res = searchByGenre();
        check(res, { 'genre 200': (r) => r.status === 200 });

    } else {
        const res = viewBook();
        check(res, { 'product 200': (r) => r.status === 200 });
    }

    sleep(Math.random() * 0.5 + 0.1);
}
