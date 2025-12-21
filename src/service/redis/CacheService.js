const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: process.env.REDIS_SERVER,
    },
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    await client.connect();
})();

const set = (key, value, ttl = 3600) => client.set(key, value, { EX: ttl });

const get = (key) => {
    const result = client.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');
    return result;
};

const del = (key) => client.del(key);

module.exports = {
    set,
    get,
    del,
};
