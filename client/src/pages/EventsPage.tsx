import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Fab,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { Add as AddIcon, ViewList, CalendarMonth } from '@mui/icons-material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { id } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { mockEvents, CulturalEvent } from '../data/mockEvents';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface CreateEventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'seni' | 'tradisi' | 'festival' | 'workshop';
  image_url: string;
  organizer: string;
  price: string;
}

const initialFormState: CreateEventForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: 'seni',
  image_url: '',
  organizer: '',
  price: '',
};

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CulturalEvent[]>(mockEvents);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CulturalEvent | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateEventForm>(initialFormState);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleCategoryChange = (event: any) => {
    if (event.target.name === 'category') {
      setCreateForm(prev => ({
        ...prev,
        category: event.target.value
      }));
    } else {
      setCategoryFilter(event.target.value);
    }
  };

  const handleBookmarkToggle = (event: CulturalEvent) => {
    if (!user) return;
    setEvents(events.map(e => 
      e.id === event.id ? { ...e, isBookmarked: !e.isBookmarked } : e
    ));
  };

  const handleEventClick = (event: CulturalEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  const handleCreateDialogOpen = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    setCreateForm(initialFormState);
  };

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = () => {
    const newEvent: CulturalEvent = {
      id: events.length + 1,
      title: createForm.title,
      description: createForm.description,
      date: createForm.date,
      time: createForm.time,
      location: createForm.location,
      category: createForm.category,
      image_url: createForm.image_url || 'https://placehold.co/600x400/3498db/FFFFFF?text=Event',
      organizer: createForm.organizer,
      price: parseFloat(createForm.price) || 0,
      isBookmarked: false,
    };

    setEvents(prev => [newEvent, ...prev]);
    handleCreateDialogClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const filteredEvents = categoryFilter === 'all'
    ? events
    : events.filter(event => event.category === categoryFilter);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Event Budaya
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Temukan berbagai event budaya menarik di sekitar Anda
          </Typography>
        </Box>
        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
          >
            Buat Event
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="event view tabs">
          <Tab icon={<ViewList />} label="List" />
          <Tab icon={<CalendarMonth />} label="Kalender" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <FormControl sx={{ mb: 4, minWidth: 200 }}>
          <InputLabel>Kategori</InputLabel>
          <Select
            value={categoryFilter}
            label="Kategori"
            onChange={handleCategoryChange}
          >
            <MenuItem value="all">Semua Kategori</MenuItem>
            <MenuItem value="seni">Seni</MenuItem>
            <MenuItem value="tradisi">Tradisi</MenuItem>
            <MenuItem value="festival">Festival</MenuItem>
            <MenuItem value="workshop">Workshop</MenuItem>
          </Select>
        </FormControl>

        <Stack spacing={3}>
          {filteredEvents.map((event) => (
            <Card key={event.id}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                <CardMedia
                  component="img"
                  sx={{
                    width: { xs: '100%', md: 300 },
                    height: { xs: 200, md: 'auto' }
                  }}
                  image={event.image_url}
                  alt={event.title}
                />
                <Box sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {event.description}
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                      <Chip 
                        label={event.category.charAt(0).toUpperCase() + event.category.slice(1)} 
                        size="small"
                      />
                      <Chip 
                        label={formatPrice(event.price)} 
                        size="small" 
                        color="primary"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📅 {formatDate(event.date)} | 🕒 {event.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 {event.location}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => handleEventClick(event)}
                    >
                      Detail
                    </Button>
                    {user && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleBookmarkToggle(event)}
                        sx={{ ml: 'auto' }}
                      >
                        {event.isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                      </IconButton>
                    )}
                  </CardActions>
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <DateCalendar 
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ width: 320 }}
              />
            </Paper>
          </LocalizationProvider>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Event pada {selectedDate ? formatDate(selectedDate.toISOString()) : '-'}
            </Typography>
            {selectedDateEvents.length > 0 ? (
              <Stack spacing={2}>
                {selectedDateEvents.map((event) => (
                  <Card key={event.id}>
                    <Box sx={{ display: 'flex', p: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 120, height: 120, borderRadius: 1 }}
                        image={event.image_url}
                        alt={event.title}
                      />
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          🕒 {event.time} | 📍 {event.location}
                        </Typography>
                        <Chip 
                          label={event.category.charAt(0).toUpperCase() + event.category.slice(1)} 
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label={formatPrice(event.price)} 
                          size="small" 
                          color="primary"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', ml: 2 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleEventClick(event)}
                        >
                          Detail
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                Tidak ada event pada tanggal ini
              </Typography>
            )}
          </Box>
        </Box>
      </TabPanel>

      {/* Create Event Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={handleCreateDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Buat Event Baru</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Judul Event"
              name="title"
              value={createForm.title}
              onChange={handleCreateFormChange}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Deskripsi"
              name="description"
              value={createForm.description}
              onChange={handleCreateFormChange}
            />
            <TextField
              fullWidth
              type="date"
              label="Tanggal"
              name="date"
              value={createForm.date}
              onChange={handleCreateFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="time"
              label="Waktu"
              name="time"
              value={createForm.time}
              onChange={handleCreateFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Lokasi"
              name="location"
              value={createForm.location}
              onChange={handleCreateFormChange}
            />
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                name="category"
                value={createForm.category}
                label="Kategori"
                onChange={handleCategoryChange}
              >
                <MenuItem value="seni">Seni</MenuItem>
                <MenuItem value="tradisi">Tradisi</MenuItem>
                <MenuItem value="festival">Festival</MenuItem>
                <MenuItem value="workshop">Workshop</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="URL Gambar"
              name="image_url"
              value={createForm.image_url}
              onChange={handleCreateFormChange}
              placeholder="https://example.com/image.jpg"
            />
            <TextField
              fullWidth
              label="Penyelenggara"
              name="organizer"
              value={createForm.organizer}
              onChange={handleCreateFormChange}
            />
            <TextField
              fullWidth
              type="number"
              label="Harga"
              name="price"
              value={createForm.price}
              onChange={handleCreateFormChange}
              InputProps={{
                startAdornment: 'Rp',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Batal</Button>
          <Button 
            variant="contained"
            onClick={handleCreateEvent}
            disabled={!createForm.title || !createForm.description || !createForm.date || !createForm.time || !createForm.location}
          >
            Buat Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog
        open={!!selectedEvent}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
              </Box>
              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Tanggal:</strong> {formatDate(selectedEvent.date)}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Waktu:</strong> {selectedEvent.time}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Lokasi:</strong> {selectedEvent.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Penyelenggara:</strong> {selectedEvent.organizer}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Harga:</strong> {formatPrice(selectedEvent.price)}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Tutup</Button>
              <Button variant="contained" color="primary">
                Daftar Event
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Floating Action Button for mobile */}
      {user && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16, display: { sm: 'none' } }}
          onClick={handleCreateDialogOpen}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default EventsPage; 