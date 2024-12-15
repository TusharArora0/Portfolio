import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  CircularProgress,
  Slide,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import GlassContainer from '../components/GlassContainer';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showError, setShowError] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/contact', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: 'unread'
      });

      if (response.data) {
        setLoading(false);
        setShowSuccess(true);
        
        // Start progress timer
        const timer = setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress === 100) {
              clearInterval(timer);
              setTimeout(() => {
                setShowSuccess(false);
                setProgress(0);
              }, 500);
              return 100;
            }
            return oldProgress + 2;
          });
        }, 50);

        // Reset form
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setLoading(false);
      setShowError(true);
      console.error('Error details:', err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <GlassContainer>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Contact Me
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(186, 104, 200, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(186, 104, 200, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ba68c8',
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(186, 104, 200, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(186, 104, 200, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ba68c8',
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Message"
            name="message"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange}
            error={!!errors.message}
            helperText={errors.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(186, 104, 200, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(186, 104, 200, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ba68c8',
                },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              background: 'linear-gradient(45deg, #9c27b0 30%, #6a1b9a 90%)',
              borderRadius: '25px',
              border: 0,
              color: 'white',
              padding: '12px 30px',
              boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(45deg, #ba68c8 30%, #9c27b0 90%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 10px 4px rgba(156, 39, 176, .3)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
          </Button>
        </Box>
      </GlassContainer>

      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            background: 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(186, 104, 200, 0.2)',
            borderRadius: '20px',
            padding: '2rem',
            minWidth: '300px',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 60,
                color: '#4caf50',
              }}
            />
          </motion.div>
          <Typography variant="h6" align="center">
            Message Sent Successfully!
          </Typography>
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(156, 39, 176, 0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4caf50',
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Box>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          Failed to send message. Please try again.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact; 