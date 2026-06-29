import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Authentication Guard
 * Protects routes that require user to be authenticated
 * 
 * Usage: { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | any => {
  const authService = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;

  if (authService.isLoggedIn()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  authService.setRedirectUrl(state.url);
  return router.createUrlTree(['/login']);
};

/**
 * Role-Based Access Guard
 * Protects routes based on user role
 * 
 * Usage: { path: 'admin', component: AdminComponent, canActivate: [roleGuard] }
 * Route data: { roles: ['admin'] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | any => {
  const authService = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const user = authService.getUser();
  const requiredRoles = route.data['roles'] as string[];
  const userRole = user?.role || '';

  if (requiredRoles && requiredRoles.includes(userRole)) {
    return true;
  }

  // User doesn't have permission
  return router.createUrlTree(['/dashboard']);
};

/**
 * Public Guard
 * Prevents authenticated users from accessing public pages (login, register)
 */
export const publicGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  // Redirect authenticated user away from public pages
  return router.createUrlTree(['/dashboard']);
};
