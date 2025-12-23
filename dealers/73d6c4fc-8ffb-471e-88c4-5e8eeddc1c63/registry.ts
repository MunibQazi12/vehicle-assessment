/**
 * Lazy Route Registry for Tonkin Automotive Group (73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63)
 * 
 * Uses dynamic imports for code splitting - components are only loaded when needed.
 * This significantly reduces bundle size as only the requested page is loaded.
 */

import { LazyDealerRegistry, LazyDealerRegistryModule } from '@dealertower/types/dealer-registry';

/**
 * Lazy route registry for this dealer
 * Keys are route paths without leading/trailing slashes
 * Empty string '' represents the home page (/)
 * 
 * Each route uses a loader function that dynamically imports the component.
 * The component is only loaded when the route is accessed.
 */
export const routes: LazyDealerRegistry = {
  // Home page
  '': {
    loader: () => import('./pages/Home'),
  },

  // Contact
  'contact-us': {
    loader: () => import('./pages/ContactUs'),
    metadata: {
      title: 'Contact Us | Tonkin Automotive Group',
      description: 'We welcome your feedback and comments. Fill out our contact form and we\'ll get back to you as soon as possible.',
    },
  },

  // Legal/Privacy
  'privacy-policy': {
    loader: () => import('./pages/PrivacyPolicy'),
  },
  'privacy-requests': {
    loader: () => import('./pages/PrivacyRequests'),
    metadata: {
      title: 'Privacy Requests | Tonkin Automotive Group',
      description: 'Submit your privacy requests through our secure portal.',
    },
  },

  // About
  'dealers': {
    loader: () => import('./pages/Dealers'),
  },
  'team': {
    loader: () => import('./pages/Team'),
    metadata: {
      title: 'Meet Our Team | Tonkin',
      description: 'Get to know the exceptional leaders driving success across the Tonkin family of dealerships',
    },
  },

  // Services
  'service': {
    loader: () => import('./pages/ServiceLocations'),
  },
  'sell-vehicles': {
    loader: () => import('./pages/SellVehicles'),
    metadata: {
      title: 'Sell Your Vehicle | Tonkin',
      description: 'Get a real offer in minutes. We make selling your car fast and easy. Trade in or sell your vehicle to Tonkin Buy Center.',
    },
  },
  'specials': {
    loader: () => import('./pages/Specials'),
  },

  // Tonkin branded pages
  'tonkin-gee': {
    loader: () => import('./pages/TonkinGee'),
  },
  'tonkin-gee/careers': {
    loader: () => import('./pages/Careers'),
    metadata: {
      title: 'Careers | Tonkin GEE Automotive',
      description: 'Explore career opportunities at Tonkin GEE Automotive.',
    },
  },
  'tonkin-gee/gee-grant': {
    loader: () => import('./pages/GeeGrant'),
    metadata: {
      title: 'GEE Grant | Tonkin GEE Automotive',
      description: 'Learn about the GEE Grant program at Tonkin GEE Automotive.',
    },
  },
  'tonkincare': {
    loader: () => import('./pages/TonkinCare'),
    metadata: {
      title: 'TonkinCare | Tonkin Family of Dealerships',
      description: 'TonkinCare offers peace of mind with complimentary oil changes and 24-hour roadside assistance for your vehicle.',
    },
  },
  'tonkincare-exclusions': {
    loader: () => import('./pages/TonkinCareExclusions'),
  },
  'tonkin-collision-center': {
    loader: () => import('./pages/CollisionCenter'),
    metadata: {
      title: 'Tonkin Collision Center | Portland Auto Body Repair',
      description: 'Portland\'s premier independent collision repair shop. Certified with Toyota and GM. Lifetime guarantee on workmanship. No appointment necessary for estimates.',
    },
  },

  // Events
  'june-12-hiring-event': {
    loader: () => import('./pages/HiringEventJune12'),
  },
  'june-26-hiring-event': {
    loader: () => import('./pages/HiringEvent'),
  },

  // Inventory
  'used-vehicles-for-sale-oregon': {
    loader: () => import('./pages/UsedVehicles'),
    metadata: {
      title: 'Pre-Owned Vehicles | Used Cars for Sale in Oregon',
      description: 'Discover the largest selection of used cars for sale in Oregon at Tonkin. Quality pre-owned vehicles with expert care before, during, and after the sale.',
    },
  },
};

/**
 * Not found component loader for this dealer
 */
export const notFoundLoader = () => import('./pages/NotFound');

/**
 * Export as module for the registry map
 */
const registryModule: LazyDealerRegistryModule = {
  routes,
  notFoundLoader,
};

export default registryModule;
