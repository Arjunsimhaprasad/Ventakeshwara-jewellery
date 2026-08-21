import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per windowMs
  message: { error: 'Too Many Requests', message: 'Too many authentication attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const aiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 20 AI prompt requests per 5 minutes
  message: { error: 'Rate Limit Exceeded', message: 'AI request limit reached. Please wait a few minutes before asking another question.' },
  standardHeaders: true,
  legacyHeaders: false
});
