import { Box, Container, Typography, IconButton, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center" 
          alignItems="center"
        >
          <IconButton 
            color="inherit" 
            href="https://github.com/TusharArora0"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton 
            color="inherit" 
            href="https://www.linkedin.com/in/tushar-arora-1aa02731a/"
            target="_blank"
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton 
            color="inherit" 
            href="mailto:tushararora5741@gmail.com"
          >
            <EmailIcon />
          </IconButton>
        </Stack>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          © {new Date().getFullYear()} Tushar. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 