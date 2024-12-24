import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete, Visibility, Check, Refresh } from '@mui/icons-material';
import axios from 'axios';
import GlassContainer from '../components/GlassContainer';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Admin = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/api/contact`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessages(response.data.data || response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.apiUrl}/api/contact/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessages(messages.filter(msg => msg._id !== id));
    } catch (err) {
      console.error('Failed to delete message:', err);
      setError('Failed to delete message');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await axios.put(`${config.apiUrl}/api/contact/${id}`, {
        status: 'read'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessages(messages.map(msg => 
        msg._id === id ? (response.data.data || response.data) : msg
      ));
    } catch (err) {
      console.error('Failed to update message status:', err);
      setError('Failed to update message status');
    }
  };

  const handleRefresh = () => {
    setRefreshKey(old => old + 1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <GlassContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h2" component="h1">
            Admin Dashboard
          </Typography>
          <Box>
            <IconButton onClick={handleRefresh} color="primary" sx={{ mr: 1 }}>
              <Refresh />
            </IconButton>
            <Button 
              onClick={handleLogout}
              variant="outlined"
              color="error"
              size="small"
            >
              Logout
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ 
            mt: 4,
            background: 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(10px)',
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow key={message._id}>
                      <TableCell>
                        <Chip 
                          label={message.status}
                          color={message.status === 'unread' ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{formatDate(message.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => {
                            setSelectedMessage(message);
                            setOpenDialog(true);
                          }}
                          sx={{ color: 'primary.light' }}
                        >
                          <Visibility />
                        </IconButton>
                        {message.status === 'unread' && (
                          <IconButton 
                            onClick={() => handleMarkAsRead(message._id)}
                            sx={{ color: 'success.main' }}
                          >
                            <Check />
                          </IconButton>
                        )}
                        <IconButton 
                          onClick={() => handleDelete(message._id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Message Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              background: 'rgba(18, 18, 18, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(186, 104, 200, 0.2)',
              minWidth: '300px',
            }
          }}
        >
          {selectedMessage && (
            <>
              <DialogTitle>
                Message from {selectedMessage.name}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography>{selectedMessage.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date:
                  </Typography>
                  <Typography>{formatDate(selectedMessage.createdAt)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Message:
                  </Typography>
                  <Typography>{selectedMessage.message}</Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Error Snackbar */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError('')} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </GlassContainer>
    </Container>
  );
};

export default Admin; 