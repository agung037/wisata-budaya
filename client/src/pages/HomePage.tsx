import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card, 
  CardMedia, 
  CardContent,
  CardActions,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExploreIcon from '@mui/icons-material/Explore';
import EventIcon from '@mui/icons-material/Event';
import MapIcon from '@mui/icons-material/Map';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Temukan Wisata Budaya',
      description: 'Jelajahi berbagai tempat wisata budaya terdekat dari lokasi Anda.',
      icon: <ExploreIcon sx={{ fontSize: 60 }} />,
      action: () => navigate('/map')
    },
    {
      title: 'Event Budaya Terkini',
      description: 'Dapatkan informasi tentang event dan pertunjukan budaya yang akan datang.',
      icon: <EventIcon sx={{ fontSize: 60 }} />,
      action: () => navigate('/events')
    },
    {
      title: 'Berbagi Pengalaman',
      description: 'Bagikan pengalaman wisata budaya Anda dan baca pengalaman dari pengguna lain.',
      icon: <MapIcon sx={{ fontSize: 60 }} />,
      action: () => navigate('/posts')
    }
  ];

  const popularPlaces = [
    {
      id: 1,
      name: 'Candi Borobudur',
      description: 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-9.',
      image: 'https://placehold.co/600x400/3498db/FFFFFF?text=Candi+Borobudur',
      category: 'sejarah'
    },
    {
      id: 2,
      name: 'Keraton Yogyakarta',
      description: 'Istana resmi Kesultanan Ngayogyakarta Hadiningrat yang masih berfungsi.',
      image: 'https://placehold.co/600x400/e74c3c/FFFFFF?text=Keraton+Yogyakarta',
      category: 'budaya'
    },
    {
      id: 3,
      name: 'Pantai Kuta',
      description: 'Pantai yang terkenal di Bali dengan pemandangan matahari terbenam yang indah.',
      image: 'https://placehold.co/600x400/27ae60/FFFFFF?text=Pantai+Kuta',
      category: 'alam'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          p: 4,
          mb: 6
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Jelajahi Keindahan Budaya Indonesia
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ maxWidth: 800, mb: 4 }}>
          Temukan tempat wisata budaya dan event menarik di sekitar Anda.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          color="secondary"
          onClick={() => navigate('/map')}
        >
          Mulai Jelajahi
        </Button>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Fitur Utama
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 3,
                    cursor: 'pointer'
                  }
                }}
                onClick={feature.action}
              >
                {feature.icon}
                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Popular Places Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Tempat Wisata Populer
          </Typography>
          <Grid container spacing={4}>
            {popularPlaces.map((place) => (
              <Grid size={{ xs: 12, md: 4 }} key={place.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={place.image}
                    alt={place.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {place.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {place.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/map?focus=${place.id}`)}>
                      Lihat Detail
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/map')}
            >
              Lihat Semua Tempat
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 