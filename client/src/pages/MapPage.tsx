import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Slider, IconButton, Drawer, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import L from 'leaflet';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TourismPlace } from '../types';
import { mockPlaces } from '../data/mockPlaces';

// Fix leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  
  return null;
};

const MapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [places, setPlaces] = useState<TourismPlace[]>(mockPlaces);
  const [selectedPlace, setSelectedPlace] = useState<TourismPlace | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([-6.2, 106.8]); // Default to Jakarta
  const [radius, setRadius] = useState<number>(10000); // 10km in meters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Load user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  // Check if there's a focus parameter
  useEffect(() => {
    const focusId = searchParams.get('focus');
    if (focusId && places.length > 0) {
      const place = places.find(p => p.id === parseInt(focusId));
      if (place) {
        setSelectedPlace(place);
        setDrawerOpen(true);
      }
    }
  }, [searchParams, places]);

  const handleRadiusChange = (_event: Event, value: number | number[]) => {
    const newRadius = value as number;
    setRadius(newRadius);
  };

  const handlePlaceClick = (place: TourismPlace) => {
    setSelectedPlace(place);
    setDrawerOpen(true);
  };

  const handleBookmarkToggle = async (place: TourismPlace) => {
    if (!user) return;

    // Update the local state
    setPlaces(places.map(p => 
      p.id === place.id ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));

    if (selectedPlace && selectedPlace.id === place.id) {
      setSelectedPlace({ ...selectedPlace, isBookmarked: !selectedPlace.isBookmarked });
    }
  };

  const filteredPlaces = categoryFilter === 'all' 
    ? places 
    : places.filter(place => place.category === categoryFilter);

  return (
    <Box sx={{ position: 'relative', height: 'calc(100vh - 64px)' }}>
      {/* Search and Filters Panel */}
      <Paper elevation={3} sx={{ position: 'absolute', top: 20, left: 20, zIndex: 1000, p: 2, width: 300 }}>
        <Typography variant="h6" gutterBottom>Temukan Tempat Wisata</Typography>
        
        <FormControl fullWidth margin="normal" size="small">
          <InputLabel>Kategori</InputLabel>
          <Select
            value={categoryFilter}
            label="Kategori"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">Semua Kategori</MenuItem>
            <MenuItem value="budaya">Budaya</MenuItem>
            <MenuItem value="sejarah">Sejarah</MenuItem>
            <MenuItem value="alam">Alam</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Radius Pencarian: {(radius / 1000).toFixed(1)} km</Typography>
          <Slider
            value={radius}
            min={1000}
            max={50000}
            step={1000}
            onChange={handleRadiusChange}
          />
        </Box>
      </Paper>

      {/* Map Component */}
      <MapContainer 
        center={userLocation} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* User location marker */}
        <Marker position={userLocation}>
          <Popup>Lokasi Anda</Popup>
        </Marker>
        
        {/* Tourism places markers */}
        {filteredPlaces.map(place => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            eventHandlers={{
              click: () => handlePlaceClick(place),
            }}
          >
            <Popup>
              <Typography variant="subtitle2">{place.name}</Typography>
              <Typography variant="body2">{place.category}</Typography>
            </Popup>
          </Marker>
        ))}
        
        {/* Keep map centered on user location */}
        <LocationMarker position={userLocation} />
      </MapContainer>

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 } } }}
      >
        {selectedPlace && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{selectedPlace.name}</Typography>
              <Box>
                {user && (
                  <IconButton onClick={() => handleBookmarkToggle(selectedPlace)}>
                    {selectedPlace.isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                  </IconButton>
                )}
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            
            {selectedPlace.image_url && (
              <Box
                component="img"
                src={selectedPlace.image_url}
                alt={selectedPlace.name}
                sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 1, mb: 2 }}
              />
            )}
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" paragraph>{selectedPlace.description}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Kategori: {selectedPlace.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Alamat: {selectedPlace.address}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.latitude},${selectedPlace.longitude}`}
              target="_blank"
            >
              Petunjuk Arah
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default MapPage; 