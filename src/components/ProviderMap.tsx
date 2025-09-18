"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Star, Clock, Shield, Zap, Wrench, Droplets, Sparkles, Package, Snowflake, Hammer, Palette, Bug, Shirt, Square, Video, Sprout, Settings, Key, Sofa } from 'lucide-react';
import { Provider } from '../types/provider';
import Avatar from './Avatar';
import 'leaflet/dist/leaflet.css';

// Custom Naira symbol component
const NairaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2v-2zm0 4h2v6h-2v-6zm0 8h2v2h-2v-2z"/>
    <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">₦</text>
  </svg>
);

// Custom marker icons
const createCustomIcon = (isAvailable: boolean, isVerified: boolean) => {
  const color = isAvailable ? '#10B981' : '#F59E0B'; // Green for available, amber for busy
  
  // Create SVG without Unicode characters to avoid btoa issues
  const svgString = `<svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0C8.954 0 0 8.954 0 20c0 15 20 30 20 30s20-15 20-30c0-11.046-8.954-20-20-20z" fill="${color}"/>
    <circle cx="20" cy="20" r="12" fill="white"/>
    ${isVerified ? '<circle cx="20" cy="20" r="6" fill="' + color + '" stroke="white" stroke-width="2"/>' : ''}
  </svg>`;
  
  // Encode the SVG properly
  const encodedSvg = encodeURIComponent(svgString);
  
  return new Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodedSvg}`,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

interface ProviderMapProps {
  providers: Provider[];
  selectedProvider?: Provider | null;
  onProviderSelect: (provider: Provider) => void;
  onProviderDeselect: () => void;
}

// Component to fit map bounds to show all providers
function MapBounds({ providers }: { providers: Provider[] }) {
  const map = useMap();
  
  if (providers.length > 0) {
    const bounds = providers.map(provider => [
      provider.latitude || 6.5244, // Default to Lagos coordinates
      provider.longitude || 3.3792
    ] as [number, number]);
    
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }
  
  return null;
}

export default function ProviderMap({ providers, selectedProvider, onProviderSelect, onProviderDeselect }: ProviderMapProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const categories = [
    { value: 'plumbing', label: 'Plumbing', icon: Droplets },
    { value: 'electrical', label: 'Electrical', icon: Zap },
    { value: 'cleaning', label: 'Cleaning', icon: Sparkles },
    { value: 'moving', label: 'Moving', icon: Package },
    { value: 'ac_repair', label: 'AC Repair', icon: Snowflake },
    { value: 'carpentry', label: 'Carpentry', icon: Hammer },
    { value: 'painting', label: 'Painting', icon: Palette },
    { value: 'pest_control', label: 'Pest Control', icon: Bug },
    { value: 'laundry', label: 'Laundry', icon: Shirt },
    { value: 'tiling', label: 'Tiling', icon: Square },
    { value: 'cctv', label: 'CCTV', icon: Video },
    { value: 'gardening', label: 'Gardening', icon: Sprout },
    { value: 'appliance_repair', label: 'Appliance Repair', icon: Settings },
    { value: 'locksmith', label: 'Locksmith', icon: Key },
    { value: 'carpet_cleaning', label: 'Carpet Cleaning', icon: Sofa }
  ];

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  // Default center (Lagos, Nigeria)
  const defaultCenter: [number, number] = [6.5244, 3.3792];

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-white/10">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds providers={providers} />
        
        {providers.map((provider) => {
          const lat = provider.latitude || 6.5244 + (Math.random() - 0.5) * 0.1;
          const lng = provider.longitude || 3.3792 + (Math.random() - 0.5) * 0.1;
          
          return (
            <Marker
              key={provider.id}
              position={[lat, lng]}
              icon={createCustomIcon(provider.isAvailable, provider.verificationStatus === 'verified')}
              eventHandlers={{
                click: () => onProviderSelect(provider),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-4 min-w-[280px]">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar
                      src={provider.user.avatarUrl}
                      alt={provider.user.fullName}
                      fallback={provider.user.fullName}
                      size="md"
                      showVerification={true}
                      isVerified={provider.verificationStatus === 'verified'}
                      showAvailability={true}
                      isAvailable={provider.isAvailable}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900">
                        {provider.user.fullName}
                      </h3>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        {(() => {
                          const cat = categories.find(c => c.value === provider.category);
                          const IconComponent = cat?.icon || Wrench;
                          return <IconComponent className="w-4 h-4 text-[#14B8A6]" />;
                        })()}
                        {getCategoryLabel(provider.category)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={14} />
                      {provider.locationCity}, {provider.locationState}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      {provider.ratingAverage.toFixed(1)} ({provider.ratingCount} reviews)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={14} />
                      {provider.isAvailable ? `Available - ${provider.estimatedArrival}` : 'Busy'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg flex items-center gap-1">
                      <NairaIcon className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-slate-900">
                        {formatPrice(provider.startingPrice)}
                      </span>
                      <span className="text-sm text-slate-500">(Starting)</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      provider.isAvailable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {provider.isAvailable ? 'Available' : 'Busy'}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {provider.bio}
                  </p>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => onProviderSelect(provider)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => onProviderDeselect()}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Map overlay with provider count */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20 dark:border-white/10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#2563EB]" />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {providers.length} provider{providers.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-white/10">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-slate-700 dark:text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-slate-700 dark:text-slate-300">Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-slate-700 dark:text-slate-300">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

