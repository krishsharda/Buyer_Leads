'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBuyerSchema, CreateBuyerInput } from '@/lib/validations';

type CreateBuyerFormData = CreateBuyerInput;

export function CreateBuyerForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateBuyerFormData>({
    resolver: zodResolver(createBuyerSchema) as any,
    defaultValues: {
      status: 'New' as const,
      tags: [],
      email: '',
      notes: '',
    },
  });

  const propertyType = watch('propertyType');
  const budgetMin = watch('budgetMin');
  const budgetMax = watch('budgetMax');

  const onSubmit: SubmitHandler<CreateBuyerFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch('/api/buyers-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tags: data.tags || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        throw new Error(errorData.error || 'Failed to create buyer');
      }

      const newBuyer = await response.json();
      
      // Redirect to the buyer detail page
      router.push(`/buyers/${newBuyer.id}`);
    } catch (error) {
      console.error('Error creating buyer:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create buyer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setSubmitError(null);
  };

  return (
    <div className="dashboard-card rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        {submitError && (
          <div className="rounded-md bg-red-50 p-4" role="alert">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error creating buyer
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {submitError}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              {...register('fullName')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter buyer's full name"
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="buyer@example.com"
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="9876543210"
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <select
              id="city"
              {...register('city')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby={errors.city ? 'city-error' : undefined}
            >
              <option value="">Select a city</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Mohali">Mohali</option>
              <option value="Zirakpur">Zirakpur</option>
              <option value="Panchkula">Panchkula</option>
              <option value="Other">Other</option>
            </select>
            {errors.city && (
              <p id="city-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
              Property Type *
            </label>
            <select
              id="propertyType"
              {...register('propertyType')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby={errors.propertyType ? 'propertyType-error' : undefined}
            >
              <option value="">Select property type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Office">Office</option>
              <option value="Retail">Retail</option>
            </select>
            {errors.propertyType && (
              <p id="propertyType-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.propertyType.message}
              </p>
            )}
          </div>

          {/* BHK (conditional) */}
          {(propertyType === 'Apartment' || propertyType === 'Villa') && (
            <div>
              <label htmlFor="bhk" className="block text-sm font-medium text-gray-700">
                BHK *
              </label>
              <select
                id="bhk"
                {...register('bhk')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                aria-describedby={errors.bhk ? 'bhk-error' : undefined}
              >
                <option value="">Select BHK</option>
                <option value="Studio">Studio</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
              </select>
              {errors.bhk && (
                <p id="bhk-error" className="mt-2 text-sm text-red-600" role="alert">
                  {errors.bhk.message}
                </p>
              )}
            </div>
          )}

          {/* Purpose */}
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Purpose *
            </label>
            <select
              id="purpose"
              {...register('purpose')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby={errors.purpose ? 'purpose-error' : undefined}
            >
              <option value="">Select purpose</option>
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
            {errors.purpose && (
              <p id="purpose-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.purpose.message}
              </p>
            )}
          </div>

          {/* Budget Min */}
          <div>
            <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700">
              Budget Min (₹)
            </label>
            <input
              type="number"
              id="budgetMin"
              {...register('budgetMin', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 2500000"
              aria-describedby={errors.budgetMin ? 'budgetMin-error' : undefined}
            />
            {errors.budgetMin && (
              <p id="budgetMin-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.budgetMin.message}
              </p>
            )}
          </div>

          {/* Budget Max */}
          <div>
            <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700">
              Budget Max (₹)
            </label>
            <input
              type="number"
              id="budgetMax"
              {...register('budgetMax', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 3500000"
              aria-describedby={errors.budgetMax ? 'budgetMax-error' : undefined}
            />
            {errors.budgetMax && (
              <p id="budgetMax-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.budgetMax.message}
              </p>
            )}
            {budgetMin && budgetMax && budgetMax < budgetMin && (
              <p className="mt-2 text-sm text-red-600">
                Maximum budget should be greater than minimum budget
              </p>
            )}
          </div>

          {/* Timeline */}
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
              Timeline *
            </label>
            <select
              id="timeline"
              {...register('timeline')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby={errors.timeline ? 'timeline-error' : undefined}
            >
              <option value="">Select timeline</option>
              <option value="0-3m">0-3 months</option>
              <option value="3-6m">3-6 months</option>
              <option value=">6m">6+ months</option>
              <option value="Exploring">Just Exploring</option>
            </select>
            {errors.timeline && (
              <p id="timeline-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.timeline.message}
              </p>
            )}
          </div>

          {/* Source */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
              Source *
            </label>
            <select
              id="source"
              {...register('source')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby={errors.source ? 'source-error' : undefined}
            >
              <option value="">Select source</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Call">Call</option>
              <option value="Other">Other</option>
            </select>
            {errors.source && (
              <p id="source-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.source.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Contacted">Contacted</option>
              <option value="Visited">Visited</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Converted">Converted</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Additional notes about the buyer..."
              aria-describedby={errors.notes ? 'notes-error' : undefined}
            />
            {errors.notes && (
              <p id="notes-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.notes.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Buyer'}
          </button>
        </div>
      </form>
    </div>
  );
}