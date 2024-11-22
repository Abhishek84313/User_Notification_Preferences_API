import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private requests: Map<string, number[]> = new Map();
  private MAX_REQUESTS = 100; // Max requests per hour
  private WINDOW_MS = 60 * 60 * 1000; // 1 hour

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip ?? '';
    const now = Date.now();

    // Initialize or clean up request history for this IP
    if (!this.requests.has(ip)) {
      this.requests.set(ip, []);
    }

    const requestTimes = this.requests.get(ip)!;
    
    // Remove requests outside the time window
    const recentRequests = requestTimes.filter(time => now - time < this.WINDOW_MS);
    
    if (recentRequests.length >= this.MAX_REQUESTS) {
      return res.status(429).json({
        message: 'Too many requests, please try again later'
      });
    }

    // Add current request timestamp
    recentRequests.push(now);
    this.requests.set(ip, recentRequests);

    next();
  }
}
