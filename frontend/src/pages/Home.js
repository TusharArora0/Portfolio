import { Box, Typography, Container, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';

const glassStyles = {
  background: 'rgba(18, 18, 18, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(186, 104, 200, 0.1)',
  padding: '2rem',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
};

const Home = () => {
  const navigate = useNavigate();

  const buttonStyles = {
    contained: {
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
    },
    outlined: {
      borderRadius: '25px',
      border: '2px solid',
      borderColor: '#ba68c8',
      color: '#ba68c8',
      padding: '10px 28px',
      background: 'rgba(186, 104, 200, 0.05)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        borderColor: '#9c27b0',
        background: 'rgba(156, 39, 176, 0.15)',
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 10px 4px rgba(156, 39, 176, .1)',
      },
    },
  };

  return (
    <Container>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          ...glassStyles,
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(106, 27, 154, 0.1) 100%)',
            transform: 'translateY(-50%)',
            filter: 'blur(20px)',
            zIndex: -1,
          }
        }}
      >
        <Typography 
          variant="h1" 
          component={motion.h1}
          whileHover={{ scale: 1.05 }}
          gutterBottom
          sx={{ color: 'primary.light' }}
        >
          Hi, I'm Tushar
        </Typography>
        <Box sx={{ height: '80px', mb: 2 }}>
          <TypeAnimation
            sequence={[
              'Full Stack Developer',
              2000,
              'MERN Stack Developer',
              2000,
              'Graphic Designer',
              2000,
              'Freelancer',
              2000,
            ]}
            wrapper="span"
            speed={50}
            deletionSpeed={65}
            repeat={Infinity}
            style={{
              fontSize: '2.5rem',
              display: 'inline-block',
              color: '#ba68c8',
              fontWeight: 500,
            }}
          />
        </Box>
        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            maxWidth: 600, 
            mb: 4,
            color: 'text.secondary',
          }}
        >
          I create beautiful and functional web applications using modern technologies.
          Specialized in MERN stack development and passionate about creating user-friendly experiences.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/projects')}
            sx={buttonStyles.contained}
          >
            View My Work
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            onClick={() => navigate('/contact')}
            sx={buttonStyles.outlined}
          >
            Contact Me
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home; 