import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import GlassContainer from '../components/GlassContainer';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Updated password check
    if (password === 'admin@5741') { // Changed password here
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <GlassContainer>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
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
            Login
          </Button>
        </Box>
      </GlassContainer>
    </Container>
  );
};

export default Login; 