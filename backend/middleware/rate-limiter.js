const rateLimiter = (limit, windowMs) => {
    const requests = new Map();

    return (req, res, next) => {
        const key = req.ip;
        const currentTime = Date.now();

        if (!requests.has(key)) {
            requests.set(key, { count: 1, startTime: currentTime });
        } else {
            const data = requests.get(key);
            const elapsedTime = currentTime - data.startTime;

            if (elapsedTime < windowMs) {
                if (data.count < limit) {
                    data.count++;
                } else {
                    return res
                        .status(429)
                        .json({
                            message:
                                'Too many requests, please try again later.',
                        });
                }
            } else {
                // Reset the counter and timestamp
                requests.set(key, { count: 1, startTime: currentTime });
            }
        }

        next();
    };
};

module.exports = rateLimiter;
