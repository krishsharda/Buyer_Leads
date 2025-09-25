'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatRelativeTime, getStatusColor, formatBudgetRange, getInitials } from '@/lib/utils';

interface BuyerDetailsProps {
  buyer: {
    id: string;
    fullName: string;
    email?: string | null;
    phone: string;
    city: string;
    propertyType: string;
    bhk?: string | null;
    purpose: string;
    budgetMin?: number | null;
    budgetMax?: number | null;
    timeline: string;
    source: string;
    status: string;
    notes?: string | null;
    tags: string[] | null;
    createdAt: Date;
    updatedAt: Date;
    owner?: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
  history: Array<{
    id: string;
    changedAt: Date;
    diff: Record<string, { old: any; new: any }>;
    changedBy?: {
      id: string;
      name: string;
      email: string;
    } | null;
  }>;
  canEdit: boolean;
}

export function BuyerDetailsView({ buyer, history, canEdit }: BuyerDetailsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/buyers/${buyer.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete buyer');
      }

      router.push('/buyers');
    } catch (error) {
      console.error('Error deleting buyer:', error);
      alert('Failed to delete buyer');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {getInitials(buyer.fullName)}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{buyer.fullName}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(buyer.status)}`}>
                    {buyer.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Updated {formatRelativeTime(buyer.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
            
            {canEdit && (
              <div className="flex items-center space-x-3">
                <Link
                  href={`/buyers/${buyer.id}?edit=true`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    showDeleteConfirm
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
                >
                  {isDeleting ? 'Deleting...' : showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                </button>
                {showDeleteConfirm && (
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {buyer.email ? (
                  <a href={`mailto:${buyer.email}`} className="text-indigo-600 hover:text-indigo-500">
                    {buyer.email}
                  </a>
                ) : (
                  <span className="text-gray-400">Not provided</span>
                )}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a href={`tel:${buyer.phone}`} className="text-indigo-600 hover:text-indigo-500">
                  {buyer.phone}
                </a>
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-sm text-gray-900">{buyer.city}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Property Requirements */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Property Requirements</h2>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Property Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{buyer.propertyType}</dd>
            </div>
            
            {buyer.bhk && (
              <div>
                <dt className="text-sm font-medium text-gray-500">BHK</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.bhk}</dd>
              </div>
            )}
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Purpose</dt>
              <dd className="mt-1 text-sm text-gray-900">{buyer.purpose}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Budget</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatBudgetRange(buyer.budgetMin || undefined, buyer.budgetMax || undefined)}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Timeline</dt>
              <dd className="mt-1 text-sm text-gray-900">{buyer.timeline}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Source</dt>
              <dd className="mt-1 text-sm text-gray-900">{buyer.source}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {buyer.tags && buyer.tags.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tags</h2>
          </div>
          <div className="px-6 py-6">
            <div className="flex flex-wrap gap-2">
              {buyer.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {buyer.notes && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Notes</h2>
          </div>
          <div className="px-6 py-6">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{buyer.notes}</p>
          </div>
        </div>
      )}

      {/* Owner Information */}
      {buyer.owner && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Owner</h2>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getInitials(buyer.owner.name)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{buyer.owner.name}</p>
                <p className="text-sm text-gray-500">{buyer.owner.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history && history.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Changes</h2>
          </div>
          <div className="px-6 py-6">
            <div className="flow-root">
              <ul className="-my-4 divide-y divide-gray-200">
                {history.map((entry) => (
                  <li key={entry.id} className="py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {entry.changedBy && (
                          <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {getInitials(entry.changedBy.name)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {entry.changedBy?.name || 'System'}
                          </p>
                          <p className="text-gray-500">{formatRelativeTime(entry.changedAt)}</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          {Object.entries(entry.diff).map(([field, change]) => (
                            <div key={field} className="mb-1">
                              <span className="font-medium">{field}:</span>{' '}
                              <span className="line-through text-red-600">{String(change.old)}</span>{' '}
                              → <span className="text-green-600">{String(change.new)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}