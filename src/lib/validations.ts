import { z } from 'zod';
import { 
  cityEnum, 
  propertyTypeEnum, 
  bhkEnum, 
  purposeEnum, 
  timelineEnum, 
  sourceEnum, 
  statusEnum 
} from '@/db/schema';

// Base schemas for enums
export const citySchema = z.enum(cityEnum, {
  message: 'Please select a valid city'
});

export const propertyTypeSchema = z.enum(propertyTypeEnum, {
  message: 'Please select a valid property type'
});

export const bhkSchema = z.enum(bhkEnum, {
  message: 'Please select a valid BHK configuration'
});

export const purposeSchema = z.enum(purposeEnum, {
  message: 'Please select Buy or Rent'
});

export const timelineSchema = z.enum(timelineEnum, {
  message: 'Please select a valid timeline'
});

export const sourceSchema = z.enum(sourceEnum, {
  message: 'Please select a valid source'
});

export const statusSchema = z.enum(statusEnum, {
  message: 'Please select a valid status'
});

// Phone validation for Indian numbers
export const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must not exceed 15 digits')
  .regex(/^\d+$/, 'Phone number must contain only digits')
  .refine((phone) => phone.length >= 10 && phone.length <= 15, {
    message: 'Phone number must be between 10-15 digits'
  });

// Email validation (optional)
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .optional();

// Budget validation
export const budgetSchema = z.number()
  .min(0, 'Budget must be a positive number')
  .max(1000000000, 'Budget seems unreasonably high')
  .optional();

// Tags validation
export const tagsSchema = z.array(z.string().trim().min(1))
  .max(10, 'Maximum 10 tags allowed')
  .default([]);

// Notes validation
export const notesSchema = z.string()
  .max(1000, 'Notes must not exceed 1000 characters')
  .optional();

// Base buyer schema
const baseBuyerSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name must not exceed 80 characters'),
  
  email: emailSchema,
  
  phone: phoneSchema,
  
  city: citySchema,
  
  propertyType: propertyTypeSchema,
  
  bhk: bhkSchema.optional(),
  
  purpose: purposeSchema,
  
  budgetMin: budgetSchema,
  
  budgetMax: budgetSchema,
  
  timeline: timelineSchema,
  
  source: sourceSchema,
  
  status: statusSchema.default('New'),
  
  notes: notesSchema,
  
  tags: tagsSchema,
});

// Create buyer schema with additional validation
export const createBuyerSchema = baseBuyerSchema
  .refine((data) => {
    // BHK is required for Apartment and Villa
    if (data.propertyType === 'Apartment' || data.propertyType === 'Villa') {
      return data.bhk !== undefined && data.bhk !== null;
    }
    return true;
  }, {
    message: 'BHK is required for Apartments and Villas',
    path: ['bhk']
  })
  .refine((data) => {
    // Budget validation: max >= min
    if (data.budgetMin && data.budgetMax) {
      return data.budgetMax >= data.budgetMin;
    }
    return true;
  }, {
    message: 'Maximum budget must be greater than or equal to minimum budget',
    path: ['budgetMax']
  });

// Update buyer schema (similar to create but with id)
export const updateBuyerSchema = createBuyerSchema.merge(z.object({
  id: z.string().min(1, 'Buyer ID is required'),
  updatedAt: z.number().optional(), // For concurrency control
}));

// Search and filter schemas
export const searchFiltersSchema = z.object({
  search: z.string().optional(),
  city: citySchema.optional(),
  propertyType: propertyTypeSchema.optional(),
  status: statusSchema.optional(),
  timeline: timelineSchema.optional(),
  purpose: purposeSchema.optional(),
  bhk: bhkSchema.optional(),
  budgetMin: budgetSchema,
  budgetMax: budgetSchema,
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(50).optional().default(10),
  sortBy: z.enum(['updatedAt', 'createdAt', 'fullName']).optional().default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// CSV import row schema
export const csvRowSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().optional().or(z.literal('')),
  phone: phoneSchema,
  city: citySchema,
  propertyType: propertyTypeSchema,
  bhk: bhkSchema.optional().or(z.literal('').transform(() => undefined)),
  purpose: purposeSchema,
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  timeline: timelineSchema,
  source: sourceSchema,
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.string().optional().transform((str) => {
    if (!str) return [];
    return str.split(',').map(tag => tag.trim()).filter(Boolean);
  }),
  status: statusSchema.optional().default('New'),
})
.refine((data) => {
  // BHK validation for CSV
  if (data.propertyType === 'Apartment' || data.propertyType === 'Villa') {
    return data.bhk !== undefined && data.bhk !== null;
  }
  return true;
}, {
  message: 'BHK is required for Apartments and Villas',
  path: ['bhk']
})
.refine((data) => {
  // Budget validation for CSV
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMax >= data.budgetMin;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
});

// User authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
});

// Type exports
export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerInput = z.infer<typeof updateBuyerSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type CSVRowInput = z.infer<typeof csvRowSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserInput = z.infer<typeof userSchema>;

// Validation helper functions
export function validateBudget(budgetMin?: number, budgetMax?: number): boolean {
  if (budgetMin && budgetMax) {
    return budgetMax >= budgetMin;
  }
  return true;
}

export function validateBHKRequired(propertyType: string, bhk?: string): boolean {
  if (propertyType === 'Apartment' || propertyType === 'Villa') {
    return Boolean(bhk);
  }
  return true;
}

export function sanitizeSearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/[^\w\s]/g, '');
}

export function parseCSVTags(tagsStr: string): string[] {
  if (!tagsStr) return [];
  return tagsStr.split(',').map(tag => tag.trim()).filter(Boolean);
}