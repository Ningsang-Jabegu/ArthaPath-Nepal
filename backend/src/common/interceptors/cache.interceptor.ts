import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Adds HTTP caching headers to GET requests
 * - Education articles: 1 hour (3600s)
 * - Investment categories: 1 hour (3600s)
 * - Other GET requests: 5 minutes (300s)
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    const route = request.route?.path || request.url;

    // Set cache-control headers based on route
    if (
      route.includes('/education/articles') ||
      route.includes('/investment-categories')
    ) {
      // Cache for 1 hour (3600 seconds)
      response.set('Cache-Control', 'public, max-age=3600');
      response.set('ETag', `"${Date.now()}"`);
    } else {
      // Cache for 5 minutes for other GET requests
      response.set('Cache-Control', 'public, max-age=300');
    }

    return next.handle().pipe(
      tap(() => {
        // Add Last-Modified header
        response.set('Last-Modified', new Date().toUTCString());
      }),
    );
  }
}
