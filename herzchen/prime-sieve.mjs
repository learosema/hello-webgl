/**
 * Get primes up to N via the Sieve of Eratosthenes algorithm
 * 
 * @param {Number} N prime limit
 * @returns {Array} Array of primes up to N 
 */
export function primeSieve(N = 100) {
  const data = new Array(N + 1).fill(true);
  data[0] = false;
  data[1] = false
  for (let i = 2; i <= (Math.sqrt(N)|0); i++) {
    if (!data[i]) {
      continue;
    }
    for (let j = i * i; j <= N; j += i) {
      data[j] = false;
    }
  }
  return data;
}