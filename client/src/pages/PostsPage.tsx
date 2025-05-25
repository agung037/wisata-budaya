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
  Avatar,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  Fab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import { mockPosts, CulturalPost } from '../data/mockPosts';
import { useAuth } from '../context/AuthContext';

interface CreatePostForm {
  title: string;
  content: string;
  image_url: string;
  tags: string;
}

const initialFormState: CreatePostForm = {
  title: '',
  content: '',
  image_url: '',
  tags: '',
};

const defaultAvatarUrl = (name: string) => `https://placehold.co/100x100/3498db/FFFFFF?text=${name.charAt(0)}`;

const PostsPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CulturalPost[]>(mockPosts);
  const [selectedPost, setSelectedPost] = useState<CulturalPost | null>(null);
  const [comment, setComment] = useState('');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreatePostForm>(initialFormState);

  const handlePostClick = (post: CulturalPost) => {
    setSelectedPost(post);
  };

  const handleCloseDialog = () => {
    setSelectedPost(null);
    setComment('');
  };

  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: p.likes - 1 } : p
      ));
    } else {
      setLikedPosts([...likedPosts, postId]);
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
    }
  };

  const handleComment = () => {
    if (!comment.trim() || !selectedPost) return;

    setPosts(posts.map(p => 
      p.id === selectedPost.id ? { ...p, comments: p.comments + 1 } : p
    ));
    setComment('');
    handleCloseDialog();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const handleCreatePost = () => {
    if (!user) return;

    const newPost: CulturalPost = {
      id: posts.length + 1,
      title: createForm.title,
      content: createForm.content,
      author: {
        id: 1,
        name: user.name || 'Anonymous',
        avatar_url: defaultAvatarUrl(user.name || 'A'),
      },
      created_at: new Date().toISOString(),
      image_url: createForm.image_url || undefined,
      likes: 0,
      comments: 0,
      tags: createForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    setPosts(prev => [newPost, ...prev]);
    handleCreateDialogClose();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Berbagi Pengalaman Budaya
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Ceritakan dan bagikan pengalaman budaya Anda dengan komunitas
          </Typography>
        </Box>
        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
          >
            Buat Post
          </Button>
        )}
      </Box>

      <Stack spacing={3}>
        {posts.map((post) => (
          <Card key={post.id} sx={{ overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={post.author.avatar_url}
                  alt={post.author.name}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {post.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(post.created_at)}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                {post.title}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                {post.content}
              </Typography>

              {post.image_url && (
                <Box sx={{ my: 2, borderRadius: 1, overflow: 'hidden' }}>
                  <img
                    src={post.image_url}
                    alt={post.title}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleLike(post.id)}
                    color={likedPosts.includes(post.id) ? 'primary' : 'default'}
                  >
                    {likedPosts.includes(post.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {post.likes}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    size="small"
                    onClick={() => handlePostClick(post)}
                  >
                    <CommentIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {post.comments}
                  </Typography>
                </Box>

                <IconButton size="small">
                  <ShareIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Create Post Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={handleCreateDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Buat Post Baru</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Judul"
              name="title"
              value={createForm.title}
              onChange={handleCreateFormChange}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Konten"
              name="content"
              value={createForm.content}
              onChange={handleCreateFormChange}
              placeholder="Bagikan pengalaman budaya Anda..."
            />
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
              label="Tags"
              name="tags"
              value={createForm.tags}
              onChange={handleCreateFormChange}
              placeholder="budaya, seni, tradisi (pisahkan dengan koma)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Batal</Button>
          <Button 
            variant="contained"
            onClick={handleCreatePost}
            disabled={!createForm.title || !createForm.content}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog
        open={!!selectedPost}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedPost && (
          <>
            <DialogTitle>
              Tambahkan Komentar
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedPost.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPost.content}
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Tulis komentar Anda..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Batal</Button>
              <Button 
                variant="contained" 
                onClick={handleComment}
                disabled={!comment.trim()}
              >
                Kirim Komentar
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

export default PostsPage; 