import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const GlassContainer = ({ children, sx = {} }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        background: 'rgba(18, 18, 18, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(186, 104, 200, 0.1)',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
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
        },
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default GlassContainer; 