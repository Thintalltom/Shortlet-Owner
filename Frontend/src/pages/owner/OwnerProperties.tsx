import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  XIcon,
  CheckIcon,
  ImageIcon,
  AlertCircleIcon,
  StarIcon,
  ZapIcon } from
'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addProperty,
  deleteProperty,
  featureProperty,
  boostProperty,
  updateBookingStatus } from
'../../store/propertiesSlice';
import { Property } from '../../types';
const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  ownerPrice: '',
  location: '',
  city: 'Lagos',
  bedrooms: '1',
  amenities: '',
  manageType: 'owner' as 'owner' | 'agent',
  images: ['', '', '', '', '', ''] as string[],
  availableFrom: '',
  availableTo: ''
};
export function OwnerProperties() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const properties = useAppSelector((s) => s.properties.list);
  const commissions = useAppSelector((s) => s.bookings.commissions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [boostingId, setBoostingId] = useState<string | null>(null);
  const [featuringId, setFeaturingId] = useState<string | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const myProperties = properties.filter((p) => p.ownerId === currentUser?.id);
  const myCommissions = commissions.filter((c) => c.payerId === currentUser?.id);
  const hasUnpaidCommissions = myCommissions.some((c) => c.status === 'pending');
  // Posting limit logic: max 3 properties UNLESS all commissions are paid
  const limitReached = myProperties.length >= 3 && hasUnpaidCommissions;
  const now = new Date();
  const filledImages = form.images.filter((url) => url.trim() !== '');
  const validImages = filledImages.filter((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  });
  const updateImage = (index: number, value: string) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm((f) => ({
      ...f,
      images: updated
    }));
    if (errors.images)
    setErrors((e) => ({
      ...e,
      images: ''
    }));
  };
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
    e.price = 'Valid price required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (validImages.length < 3)
    e.images = `Please add at least 3 valid image URLs (${validImages.length}/3 added)`;
    if (!termsAgreed) e.terms = 'You must agree to the commission terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      ownerPrice: Number(form.ownerPrice || form.price),
      location: form.location,
      city: form.city,
      bedrooms: Number(form.bedrooms),
      amenities: form.amenities.
      split(',').
      map((a) => a.trim()).
      filter(Boolean),
      images: validImages,
      manageType: form.manageType,
      ownerId: currentUser!.id,
      status: 'active',
      availableFrom: form.availableFrom || undefined,
      availableTo: form.availableTo || undefined,
      bookingStatus: 'available',
      commissionPaid: false,
      isFeatured: false,
      viewsCount: 0,
      isReported: false,
      createdAt: new Date().toISOString()
    };
    dispatch(addProperty(newProperty));
    setForm(EMPTY_FORM);
    setTermsAgreed(false);
    setErrors({});
    setShowForm(false);
    setSaving(false);
  };
  const handleBoost = async (propertyId: string, days: number) => {
    setBoostingId(propertyId);
    await new Promise((r) => setTimeout(r, 800));
    dispatch(
      boostProperty({
        id: propertyId,
        days
      })
    );
    setBoostingId(null);
  };
  const handleFeature = async (propertyId: string, days: number) => {
    setFeaturingId(propertyId);
    await new Promise((r) => setTimeout(r, 800));
    dispatch(
      featureProperty({
        id: propertyId,
        days
      })
    );
    setFeaturingId(null);
  };
  const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(price);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">My Properties</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            {myProperties.length} properties listed
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={limitReached}
          className="btn-primary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">

          <PlusIcon size={16} /> Add Property
        </button>
      </div>

      {limitReached && !showForm &&
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircleIcon
          size={20}
          className="text-red-600 flex-shrink-0 mt-0.5" />

          <div>
            <h3 className="font-bold text-red-800">Posting Limit Reached</h3>
            <p className="text-sm text-red-700 mt-1">
              You have reached the limit of 3 properties. To post more, you must
              pay all pending commissions for your booked properties.
            </p>
            <Link
            to="/owner/commissions"
            className="text-sm font-semibold text-red-800 hover:underline mt-2 inline-block">

              Go to Commissions →
            </Link>
          </div>
        </div>
      }

      {/* Add Property Form */}
      {showForm && !limitReached &&
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-[#111827] text-lg">
              Add New Property
            </h2>
            <button
            onClick={() => {
              setShowForm(false);
              setErrors({});
              setForm(EMPTY_FORM);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280]">

              <XIcon size={18} />
            </button>
          </div>

          <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Property Title <span className="text-[#EF4444]">*</span>
              </label>
              <input
              value={form.title}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                title: e.target.value
              }))
              }
              placeholder="e.g. Luxury 2-Bedroom Apartment in Lekki"
              className={`input-field ${errors.title ? 'border-[#EF4444]' : ''}`} />

              {errors.title &&
            <p className="text-xs text-[#EF4444] mt-1">{errors.title}</p>
            }
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Description <span className="text-[#EF4444]">*</span>
              </label>
              <textarea
              value={form.description}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                description: e.target.value
              }))
              }
              rows={3}
              placeholder="Describe your property..."
              className={`input-field resize-none ${errors.description ? 'border-[#EF4444]' : ''}`} />

              {errors.description &&
            <p className="text-xs text-[#EF4444] mt-1">
                  {errors.description}
                </p>
            }
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Price per Night (₦) <span className="text-[#EF4444]">*</span>
              </label>
              <input
              type="number"
              value={form.price}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                price: e.target.value
              }))
              }
              placeholder="e.g. 35000"
              className={`input-field ${errors.price ? 'border-[#EF4444]' : ''}`} />

              {errors.price &&
            <p className="text-xs text-[#EF4444] mt-1">{errors.price}</p>
            }
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Owner Price (₦){' '}
                <span className="text-[#6B7280] font-normal text-xs">
                  (what you charge agent)
                </span>
              </label>
              <input
              type="number"
              value={form.ownerPrice}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                ownerPrice: e.target.value
              }))
              }
              placeholder="Leave blank to use listing price"
              className="input-field" />

            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Available From{' '}
                <span className="text-[#6B7280] font-normal text-xs">
                  (optional)
                </span>
              </label>
              <input
              type="date"
              value={form.availableFrom}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                availableFrom: e.target.value
              }))
              }
              className="input-field" />

            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Available To{' '}
                <span className="text-[#6B7280] font-normal text-xs">
                  (optional)
                </span>
              </label>
              <input
              type="date"
              value={form.availableTo}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                availableTo: e.target.value
              }))
              }
              className="input-field" />

            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Bedrooms
              </label>
              <select
              value={form.bedrooms}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                bedrooms: e.target.value
              }))
              }
              className="input-field">

                {['1', '2', '3', '4', '5', '6'].map((b) =>
              <option key={b} value={b}>
                    {b} Bedroom{b !== '1' ? 's' : ''}
                  </option>
              )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                City
              </label>
              <select
              value={form.city}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                city: e.target.value
              }))
              }
              className="input-field">

                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Full Address <span className="text-[#EF4444]">*</span>
              </label>
              <input
              value={form.location}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                location: e.target.value
              }))
              }
              placeholder="e.g. Lekki Phase 1, Lagos"
              className={`input-field ${errors.location ? 'border-[#EF4444]' : ''}`} />

              {errors.location &&
            <p className="text-xs text-[#EF4444] mt-1">{errors.location}</p>
            }
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Amenities{' '}
                <span className="text-[#6B7280] font-normal">
                  (comma-separated)
                </span>
              </label>
              <input
              value={form.amenities}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                amenities: e.target.value
              }))
              }
              placeholder="WiFi, Air Conditioning, 24/7 Power, Parking, Security"
              className="input-field" />

            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#111827]">
                  Property Images <span className="text-[#EF4444]">*</span>
                </label>
                <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${validImages.length >= 3 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>

                  {validImages.length} / 6 {validImages.length < 3 && '(min 3)'}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mb-3">
                Add 3–6 image URLs. First image will be the cover photo.
              </p>
              {errors.images &&
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg mb-3">
                  <AlertCircleIcon size={14} /> {errors.images}
                </div>
            }
              <div className="space-y-3">
                {form.images.map((url, index) => {
                const isRequired = index < 3;
                const hasValue = url.trim() !== '';
                const isValid =
                hasValue &&
                (() => {
                  try {
                    new URL(url);
                    return true;
                  } catch {
                    return false;
                  }
                })();
                return (
                  <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isValid ? 'bg-[#10B981] text-white' : isRequired ? 'bg-red-50 text-[#EF4444] border border-red-200' : 'bg-[#F8FAFC] text-[#6B7280] border border-[#E5E7EB]'}`}>

                          {isValid ? <CheckIcon size={13} /> : index + 1}
                        </div>
                        <div className="flex-1 relative">
                          <input
                          type="url"
                          value={url}
                          onChange={(e) => updateImage(index, e.target.value)}
                          placeholder={
                          isRequired ?
                          `Image ${index + 1} URL (required)` :
                          `Image ${index + 1} URL (optional)`
                          }
                          className={`input-field pr-10 text-sm ${hasValue && !isValid ? 'border-[#EF4444]' : isValid ? 'border-[#10B981]' : ''}`} />

                          {hasValue &&
                        <button
                          type="button"
                          onClick={() => updateImage(index, '')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#EF4444]">

                              <XIcon size={14} />
                            </button>
                        }
                        </div>
                      </div>
                      {isValid &&
                    <div className="ml-9">
                          <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-full sm:w-40 object-cover rounded-lg border border-[#E5E7EB]"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display =
                          'none';
                        }} />

                        </div>
                    }
                    </div>);

              })}
              </div>
            </div>

            {/* Management Type */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                Management Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                type="button"
                onClick={() =>
                setForm((f) => ({
                  ...f,
                  manageType: 'owner'
                }))
                }
                className={`p-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.manageType === 'owner' ? 'border-[#1B6B3A] bg-[#E8F5EE] text-[#1B6B3A]' : 'border-[#E5E7EB] text-[#6B7280]'}`}>

                  <div className="font-semibold mb-0.5">
                    🏠 I'll manage it myself
                  </div>
                  <div className="text-xs opacity-80">
                    You handle all guest inquiries directly
                  </div>
                </button>
                <button
                type="button"
                onClick={() =>
                setForm((f) => ({
                  ...f,
                  manageType: 'agent'
                }))
                }
                className={`p-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.manageType === 'agent' ? 'border-[#1B6B3A] bg-[#E8F5EE] text-[#1B6B3A]' : 'border-[#E5E7EB] text-[#6B7280]'}`}>

                  <div className="font-semibold mb-0.5">
                    🧑‍💼 Allow agents to apply
                  </div>
                  <div className="text-xs opacity-80">
                    Agents can apply; you approve one
                  </div>
                </button>
              </div>
            </div>

            <div className="sm:col-span-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5E7EB]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-1 accent-[#1B6B3A]" />

                <span className="text-sm text-[#6B7280]">
                  I agree to the Terms and Conditions. I understand that I am
                  required to pay a{' '}
                  <strong className="text-[#111827]">3% commission</strong> to
                  ShortletConnect for every successful booking of this property.
                </span>
              </label>
              {errors.terms &&
            <p className="text-xs text-[#EF4444] mt-2">{errors.terms}</p>
            }
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2 border-t border-[#E5E7EB]">
              <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 disabled:opacity-60">

                {saving ?
              'Saving...' :

              <>
                    <CheckIcon size={16} /> Save Property
                  </>
              }
              </button>
              <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setErrors({});
                setForm(EMPTY_FORM);
              }}
              className="btn-outline py-3">

                Cancel
              </button>
            </div>
          </form>
        </div>
      }

      {/* Properties Table */}
      {myProperties.length === 0 ?
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
          <div className="w-16 h-16 bg-[#E8F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusIcon size={28} className="text-[#1B6B3A]" />
          </div>
          <h3 className="font-bold text-[#111827] mb-2">No properties yet</h3>
          <p className="text-[#6B7280] text-sm mb-4">
            Add your first shortlet property to get started.
          </p>
          <button
          onClick={() => setShowForm(true)}
          disabled={limitReached}
          className="btn-primary text-sm py-2.5 disabled:opacity-50">

            <PlusIcon size={15} /> Add Property
          </button>
        </div> :

      <div className="space-y-4">
          {myProperties.map((property) => {
          const isBoostedActive =
          property.boostedUntil && new Date(property.boostedUntil) > now;
          const isFeaturedActive =
          property.isFeatured &&
          property.featuredUntil &&
          new Date(property.featuredUntil) > now;
          return (
            <div
              key={property.id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-4">

                <div className="flex items-start gap-4">
                  <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-[#111827] text-sm line-clamp-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-0.5">
                          <MapPinIcon size={11} /> {property.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#1B6B3A] text-sm">
                          {formatPrice(property.price)}/night
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {property.viewsCount} views
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <select
                      value={property.bookingStatus}
                      onChange={(e) =>
                      dispatch(
                        updateBookingStatus({
                          id: property.id,
                          status: e.target.value as any
                        })
                      )
                      }
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border ${property.bookingStatus === 'available' ? 'bg-green-50 text-[#10B981] border-green-200' : property.bookingStatus === 'booked' ? 'bg-red-50 text-[#EF4444] border-red-200' : 'bg-gray-100 text-[#6B7280] border-gray-200'}`}>

                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                        <option value="unavailable">Unavailable</option>
                      </select>

                      {isBoostedActive &&
                    <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                          <ZapIcon size={10} /> Boosted until{' '}
                          {new Date(
                        property.boostedUntil!
                      ).toLocaleDateString()}
                        </span>
                    }
                      {isFeaturedActive &&
                    <span className="flex items-center gap-1 text-xs bg-[#E8F5EE] text-[#1B6B3A] border border-[#1B6B3A]/20 px-2 py-0.5 rounded-full font-medium">
                          <StarIcon size={10} /> Featured until{' '}
                          {new Date(
                        property.featuredUntil!
                      ).toLocaleDateString()}
                        </span>
                    }
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#F3F4F6]">
                      <Link
                      to={`/property/${property.id}`}
                      className="text-xs text-[#1B6B3A] hover:underline font-medium">

                        View
                      </Link>

                      {!isBoostedActive &&
                    <button
                      onClick={() => handleBoost(property.id, 7)}
                      disabled={boostingId === property.id}
                      className="flex items-center gap-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-60">

                          <ZapIcon size={11} />{' '}
                          {boostingId === property.id ?
                      'Boosting...' :
                      'Boost (₦2,000)'}
                        </button>
                    }

                      {!isFeaturedActive &&
                    <button
                      onClick={() => handleFeature(property.id, 30)}
                      disabled={featuringId === property.id}
                      className="flex items-center gap-1 text-xs bg-[#E8F5EE] hover:bg-[#1B6B3A]/10 text-[#1B6B3A] border border-[#1B6B3A]/20 px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-60">

                          <StarIcon size={11} />{' '}
                          {featuringId === property.id ?
                      'Featuring...' :
                      'Feature (₦5,000)'}
                        </button>
                    }

                      {deleteConfirm === property.id ?
                    <div className="flex items-center gap-1 ml-auto">
                          <button
                        onClick={() => {
                          dispatch(deleteProperty(property.id));
                          setDeleteConfirm(null);
                        }}
                        className="text-xs text-[#EF4444] font-semibold hover:underline">

                            Confirm Delete
                          </button>
                          <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs text-[#6B7280] hover:underline">

                            Cancel
                          </button>
                        </div> :

                    <button
                      onClick={() => setDeleteConfirm(property.id)}
                      className="p-1.5 rounded text-[#6B7280] hover:text-[#EF4444] hover:bg-red-50 transition-colors ml-auto"
                      aria-label="Delete">

                          <TrashIcon size={13} />
                        </button>
                    }
                    </div>
                  </div>
                </div>
              </div>);

        })}
        </div>
      }
    </div>);

}