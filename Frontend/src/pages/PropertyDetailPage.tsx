import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  BedDoubleIcon,
  PhoneIcon,
  MessageCircleIcon,
  AlertTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  WifiIcon,
  ZapIcon,
  CarIcon,
  ShieldIcon,
  TvIcon,
  WavesIcon,
  DumbbellIcon,
  WindIcon,
  ArrowLeftIcon,
  SendIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  HeartIcon,
  FlagIcon,
  EyeIcon,
  StarIcon,
  ZapIcon as BoostIcon,
  ShieldCheckIcon,
  CalendarIcon
} from
  'lucide-react';
import { TrustedBadge } from '../components/TrustedBadge';
import { ContactGate } from '../components/ContactGate';
import { BookingPrompt } from '../components/BookingPrompt';
import { useAppDispatch, useAppSelector } from '../store';
import { addApplication } from '../store/applicationsSlice';
import { incrementViews, reportProperty } from '../store/propertiesSlice';
// import { saveProperty, unsaveProperty } from '../store/savedPropertiesSlice';
import { mockUsers } from '../data/mockData';
import { Application } from '../types';
const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <WifiIcon size={16} />,
  'Air Conditioning': <WindIcon size={16} />,
  '24/7 Power': <ZapIcon size={16} />,
  'Power Backup': <ZapIcon size={16} />,
  Security: <ShieldIcon size={16} />,
  Parking: <CarIcon size={16} />,
  'Swimming Pool': <WavesIcon size={16} />,
  Gym: <DumbbellIcon size={16} />,
  'Smart TV': <TvIcon size={16} />
};
export function PropertyDetailPage() {
  const { id: propertyId } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const properties = useAppSelector((s) => s.properties.list);
  const applications = useAppSelector((s) => s.applications.list);
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const savedProperties = useAppSelector((s) => s.savedProperties.list);
  const [currentImage, setCurrentImage] = useState(0);
  const [applyMessage, setApplyMessage] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [showContactGate, setShowContactGate] = useState(false);
  const [showBookingPrompt, setShowBookingPrompt] = useState(false);
  const property = properties.find((p) => p.id === propertyId);
  useEffect(() => {
    if (property) {
      dispatch(incrementViews(property.id));
    }
  }, [propertyId]);
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#111827] mb-2">
            Property not found
          </h2>
          <Link to="/listings" className="btn-primary">
            Back to Listings
          </Link>
        </div>
      </div>);

  }
  const owner = mockUsers.find(
    (u) => u.id === property.ownerId && u.role === 'owner'
  );
  const agent = property.agentId ?
    mockUsers.find((u) => u.id === property.agentId && u.role === 'agent') :
    undefined;
  const contact = property.manageType === 'agent' && agent ? agent : owner;
  const isSaved = savedProperties.some(
    (s) => s.userId === currentUser?.id && s.propertyId === property.id
  );
  const isAgent = currentUser?.role === 'agent';
  const canApply =
    isAgent && property.manageType === 'agent' && !property.agentId;
  const existingApplication = applications.find(
    (a) => a.propertyId === property.id && a.agentId === currentUser?.id
  );
  const agentPendingCount = isAgent ?
    applications.filter(
      (a) => a.agentId === currentUser?.id && a.status === 'pending'
    ).length :
    0;
  const isTrustedAgent = currentUser?.trustedStatus === 'active';
  const applicationLimitReached = !isTrustedAgent && agentPendingCount >= 3;
  const now = new Date();
  const isBoosted =
    property.boostedUntil && new Date(property.boostedUntil) > now;
  const isFeatured =
    property.isFeatured &&
    property.featuredUntil &&
    new Date(property.featuredUntil) > now;
  const displayPrice = property.publicPrice || property.price;
  // const handleSave = () => {
  //   if (!currentUser) {
  //     setShowContactGate(true);
  //     return;
  //   }
  //   if (isSaved)
  //   dispatch(
  //     unsaveProperty({
  //       userId: currentUser.id,
  //       propertyId: property.id
  //     })
  //   );else

  //   dispatch(
  //     saveProperty({
  //       userId: currentUser.id,
  //       propertyId: property.id
  //     })
  //   );
  // };
  const handleContact = (
    e: React.MouseEvent,
    type: 'call' | 'whatsapp',
    link: string) => {
    e.preventDefault();
    if (!currentUser) {
      setShowContactGate(true);
      return;
    }
    window.open(link, type === 'whatsapp' ? '_blank' : '_self');
    // Only show booking prompt for users (guests)
    if (currentUser.role === 'user') {
      setTimeout(() => {
        setShowBookingPrompt(true);
      }, 2500);
    }
  };
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !applyMessage.trim()) return;
    setApplyLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const newApp: Application = {
      id: `app-${Date.now()}`,
      propertyId: property.id,
      agentId: currentUser.id,
      message: applyMessage.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    dispatch(addApplication(newApp));
    setApplySuccess(true);
    setApplyLoading(false);
  };
  const handleReport = async () => {
    if (!reportReason.trim()) return;
    await new Promise((r) => setTimeout(r, 600));
    dispatch(reportProperty(property.id));
    setReportSubmitted(true);
    setTimeout(() => setShowReportModal(false), 2000);
  };
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  const prevImage = () =>
    setCurrentImage((i) => i === 0 ? property.images.length - 1 : i - 1);
  const nextImage = () =>
    setCurrentImage((i) => i === property.images.length - 1 ? 0 : i + 1);
  const getStatusIcon = (status: string) => {
    if (status === 'approved')
      return <CheckCircleIcon size={16} className="text-[#10B981]" />;
    if (status === 'rejected')
      return <XCircleIcon size={16} className="text-[#EF4444]" />;
    return <ClockIcon size={16} className="text-amber-500" />;
  };
  const getBookingStatusBadge = () => {
    if (property.bookingStatus === 'booked') {
      return (
        <span className="flex items-center gap-1 bg-red-50 text-[#EF4444] border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full">
          <XCircleIcon size={12} /> Booked
        </span>);

    }
    if (property.bookingStatus === 'unavailable') {
      return (
        <span className="flex items-center gap-1 bg-gray-100 text-[#6B7280] border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full">
          <AlertTriangleIcon size={12} /> Unavailable
        </span>);

    }
    return (
      <span className="flex items-center gap-1 bg-green-50 text-[#10B981] border border-green-200 text-xs font-bold px-2.5 py-1 rounded-full">
        <CheckCircleIcon size={12} /> Available
      </span>);

  };
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {showContactGate &&
        <ContactGate onClose={() => setShowContactGate(false)} />
      }
      {showBookingPrompt &&
        <BookingPrompt
          property={property}
          onClose={() => setShowBookingPrompt(false)} />

      }

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B6B3A] transition-colors">

            <ArrowLeftIcon size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            {getBookingStatusBadge()}
            {isBoosted &&
              <span className="flex items-center gap-1 bg-[#F59E0B] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <BoostIcon size={12} /> Boosted
              </span>
            }
            {isFeatured &&
              <span className="flex items-center gap-1 bg-[#1B6B3A] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <StarIcon size={12} className="fill-white" /> Featured
              </span>
            }
            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
              <EyeIcon size={13} /> {property.viewsCount} views
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[16/7]">
          <img
            src={property.images[currentImage]}
            alt={`${property.title} - Image ${currentImage + 1}`}
            className="w-full h-full object-cover" />

          {property.images.length > 1 &&
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                aria-label="Previous image">

                <ChevronLeftIcon size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                aria-label="Next image">

                <ChevronRightIcon size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {property.images.map((_, i) =>
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-5' : 'bg-white/60 w-2'}`} />

                )}
              </div>
            </>
          }
        </div>
        {property.images.length > 1 &&
          <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
            {property.images.map((img, i) =>
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${i === currentImage ? 'border-[#1B6B3A]' : 'border-transparent opacity-70 hover:opacity-100'}`}>

                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover" />

              </button>
            )}
          </div>
        }
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#111827] leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-[#6B7280] mt-2">
                    <MapPinIcon size={16} className="text-[#1B6B3A]" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#1B6B3A]">
                    {formatPrice(displayPrice)}
                  </div>
                  <div className="text-sm text-[#6B7280]">per night</div>
                  {property.publicPrice &&
                    property.publicPrice !== property.ownerPrice &&
                    <div className="text-xs text-[#6B7280] mt-0.5">
                      Agent-set price
                    </div>
                  }
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-2 rounded-lg text-sm text-[#6B7280]">
                  <BedDoubleIcon size={16} className="text-[#1B6B3A]" />
                  {property.bedrooms}{' '}
                  {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </div>
                <div
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${property.manageType === 'owner' ? 'badge-owner' : 'badge-agent'}`}>

                  {property.manageType === 'owner' ?
                    'Owner Managed' :
                    'Agent Managed'}
                </div>
                {agent?.trustedStatus === 'active' &&
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg text-xs font-medium text-amber-700">
                    <ShieldCheckIcon size={14} className="text-amber-500" />{' '}
                    Trusted Agent
                  </div>
                }
              </div>

              {(property.availableFrom || property.availableTo) &&
                <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center gap-2 text-sm text-[#6B7280]">
                  <CalendarIcon size={16} className="text-[#1B6B3A]" />
                  <span>
                    Available:{' '}
                    <strong className="text-[#111827]">
                      {property.availableFrom ?
                        new Date(property.availableFrom).toLocaleDateString() :
                        'Now'}
                    </strong>{' '}
                    to{' '}
                    <strong className="text-[#111827]">
                      {property.availableTo ?
                        new Date(property.availableTo).toLocaleDateString() :
                        'Anytime'}
                    </strong>
                  </span>
                </div>
              }
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827] mb-3">
                About this property
              </h2>
              <p className="text-[#6B7280] leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827] mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) =>
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 bg-[#F8FAFC] px-3 py-2.5 rounded-lg text-sm text-[#6B7280]">

                    <span className="text-[#1B6B3A]">
                      {amenityIcons[amenity] || <ShieldIcon size={16} />}
                    </span>
                    {amenity}
                  </div>
                )}
              </div>
            </div>

            {/* Agent Application Section */}
            {property.manageType === 'agent' &&
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h2 className="text-lg font-bold text-[#111827] mb-1">
                  Manage This Property
                </h2>
                <p className="text-sm text-[#6B7280] mb-5">
                  This property is open for agent management applications.
                </p>

                {property.agentId &&
                  <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                    <CheckCircleIcon
                      size={18}
                      className="text-[#10B981] flex-shrink-0 mt-0.5" />

                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Agent already assigned
                      </p>
                      <p className="text-xs text-green-700 mt-0.5">
                        This property already has an approved agent managing it.
                      </p>
                    </div>
                  </div>
                }

                {!currentUser && !property.agentId &&
                  <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-5 text-center">
                    <p className="text-sm text-[#6B7280] mb-3">
                      You must be logged in as an agent to apply.
                    </p>
                    <Link to="/login" className="btn-primary text-sm py-2">
                      Login to Apply
                    </Link>
                  </div>
                }

                {currentUser?.role === 'owner' && !property.agentId &&
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                    Only agents can apply to manage properties.
                  </div>
                }

                {isAgent && existingApplication &&
                  <div
                    className={`flex items-start gap-3 rounded-xl p-4 border ${existingApplication.status === 'approved' ? 'bg-green-50 border-green-200' : existingApplication.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>

                    <div className="mt-0.5">
                      {getStatusIcon(existingApplication.status)}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${existingApplication.status === 'approved' ? 'text-green-800' : existingApplication.status === 'rejected' ? 'text-red-800' : 'text-amber-800'}`}>

                        Application{' '}
                        {existingApplication.status === 'approved' ?
                          'Approved' :
                          existingApplication.status === 'rejected' ?
                            'Rejected' :
                            'Pending Review'}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${existingApplication.status === 'approved' ? 'text-green-700' : existingApplication.status === 'rejected' ? 'text-red-700' : 'text-amber-700'}`}>

                        {existingApplication.status === 'approved' ?
                          'Congratulations! You are now managing this property.' :
                          existingApplication.status === 'rejected' ?
                            'Your application was not accepted.' :
                            'Your application is under review by the property owner.'}
                      </p>
                    </div>
                  </div>
                }

                {isAgent && !existingApplication && !property.agentId &&
                  <>
                    {applySuccess ?
                      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                        <CheckCircleIcon
                          size={18}
                          className="text-[#10B981] flex-shrink-0 mt-0.5" />

                        <div>
                          <p className="text-sm font-semibold text-green-800">
                            Application submitted!
                          </p>
                          <p className="text-xs text-green-700 mt-0.5">
                            The property owner will review your application.
                          </p>
                        </div>
                      </div> :
                      applicationLimitReached ?
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <p className="text-sm font-semibold text-amber-800 mb-1">
                            Application limit reached
                          </p>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            Untrusted agents can only have 3 pending applications.
                            Get your Trusted Agent badge for unlimited
                            applications.
                          </p>
                          <Link
                            to="/agent/verification"
                            className="mt-3 btn-accent text-xs py-2 inline-flex">

                            Get Trusted Badge
                          </Link>
                        </div> :

                        <form onSubmit={handleApply} className="space-y-4">
                          {!isTrustedAgent &&
                            <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-3 py-2">
                              <span className="text-xs text-[#6B7280]">
                                Pending applications
                              </span>
                              <span className="text-xs font-bold text-[#111827]">
                                {agentPendingCount} / 3
                              </span>
                            </div>
                          }
                          <div>
                            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                              Your Application Message{' '}
                              <span className="text-[#EF4444]">*</span>
                            </label>
                            <textarea
                              value={applyMessage}
                              onChange={(e) => setApplyMessage(e.target.value)}
                              rows={4}
                              placeholder="Introduce yourself and explain why you'd be a great fit to manage this property..."
                              className="input-field resize-none"
                              required />

                          </div>
                          <button
                            type="submit"
                            disabled={
                              applyLoading || applyMessage.trim().length < 20
                            }
                            className="btn-primary py-3 disabled:opacity-60 disabled:cursor-not-allowed">

                            {applyLoading ?
                              'Submitting...' :

                              <>
                                <SendIcon size={16} /> Submit Application
                              </>
                            }
                          </button>
                        </form>
                    }
                  </>
                }
              </div>
            }

            {/* Report & Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <AlertTriangleIcon
                  size={18}
                  className="text-amber-600 flex-shrink-0 mt-0.5" />

                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800 mb-1">
                    Important Notice
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    ShortletConnect only connects property owners, agents, and
                    guests. We do not handle payments, bookings, or act as
                    escrow. All agreements are made directly between parties.
                  </p>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="mt-3 flex items-center gap-1.5 text-xs text-[#EF4444] hover:underline font-medium">

                    <FlagIcon size={12} /> Report this listing
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] sticky top-24">
              <h2 className="text-lg font-bold text-[#111827] mb-4">
                {property.manageType === 'agent' ?
                  'Contact Agent' :
                  'Contact Owner'}
              </h2>

              {contact &&
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Link
                      to={
                        contact.role === 'agent' ? `/agent/${contact.id}` : '#'
                      }>

                      <img
                        src={
                          contact.profileImage ||
                          'https://i.pravatar.cc/150?img=1'
                        }
                        alt={contact.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#E5E7EB]" />

                    </Link>
                    <div>
                      <Link
                        to={
                          contact.role === 'agent' ?
                            `/agent/${contact.id}` :
                            '#'
                        }
                        className="font-semibold text-[#111827] hover:text-[#1B6B3A] transition-colors">

                        {contact.name}
                      </Link>
                      {property.manageType === 'agent' && agent &&
                        <div className="mt-1">
                          {agent.trustedStatus === 'active' ?
                            <TrustedBadge size="sm" showSubtext /> :

                            <span className="text-xs text-[#6B7280]">
                              Agent
                            </span>
                          }
                        </div>
                      }
                      {property.manageType === 'owner' &&
                        <span className="text-xs text-[#6B7280]">
                          Property Owner
                        </span>
                      }
                    </div>
                  </div>

                  {contact.bio &&
                    <p className="text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E7EB] pt-3">
                      {contact.bio}
                    </p>
                  }

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={(e) =>
                        handleContact(e, 'call', `tel:${contact.phone}`)
                      }
                      className="w-full btn-primary justify-center py-3">

                      <PhoneIcon size={17} /> Call Now
                    </button>
                    <button
                      onClick={(e) =>
                        handleContact(
                          e,
                          'whatsapp',
                          `https://wa.me/${(contact.whatsapp || contact.phone).replace(/\+/g, '').replace(/\s/g, '')}`
                        )
                      }
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-semibold py-3 px-6 rounded-lg transition-colors">

                      <MessageCircleIcon size={17} /> WhatsApp
                    </button>
                  </div>
                </div>
              }

              <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex gap-2">
                <button
                  // onClick={handleSave}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${isSaved ? 'bg-red-50 border-red-200 text-[#EF4444]' : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#EF4444] hover:text-[#EF4444]'}`}>

                  <HeartIcon
                    size={15}
                    className={isSaved ? 'fill-[#EF4444]' : ''} />

                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal &&
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-down">
            <h3 className="font-bold text-[#111827] text-lg mb-2">
              Report This Listing
            </h3>
            {reportSubmitted ?
              <div className="text-center py-4">
                <CheckCircleIcon
                  size={40}
                  className="text-[#10B981] mx-auto mb-3" />

                <p className="font-semibold text-[#111827]">
                  Report submitted!
                </p>
                <p className="text-sm text-[#6B7280] mt-1">
                  Our team will review this listing within 24 hours.
                </p>
              </div> :

              <>
                <p className="text-sm text-[#6B7280] mb-4">
                  Help us keep ShortletConnect safe. Tell us what's wrong with
                  this listing.
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    'Fake/misleading listing',
                    'Wrong location or photos',
                    'Suspicious contact details',
                    'Price manipulation',
                    'Other'].
                    map((reason) =>
                      <label
                        key={reason}
                        className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-[#F8FAFC]">

                        <input
                          type="radio"
                          name="reason"
                          value={reason}
                          checked={reportReason === reason}
                          onChange={() => setReportReason(reason)}
                          className="accent-[#EF4444]" />

                        <span className="text-sm text-[#6B7280]">{reason}</span>
                      </label>
                    )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReport}
                    disabled={!reportReason}
                    className="flex-1 bg-[#EF4444] hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-50 transition-colors">

                    Submit Report
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 border border-[#E5E7EB] text-[#6B7280] font-semibold py-2.5 rounded-lg text-sm hover:bg-[#F8FAFC] transition-colors">

                    Cancel
                  </button>
                </div>
              </>
            }
          </div>
        </div>
      }
    </div>);

}