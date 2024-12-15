import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Projects', path: '/projects' },
    { text: 'Contact', path: '/contact' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navButton = (text, path) => (
    <Button
      color="inherit"
      onClick={() => navigate(path)}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(120deg, transparent, rgba(186, 104, 200, 0.3), transparent)',
          transform: 'translateX(-100%)',
          transition: 'transform 0.6s',
        },
        '&:hover': {
          color: '#ba68c8',
          '&::before': {
            transform: 'translateX(100%)',
          },
        },
      }}
    >
      {text}
    </Button>
  );

  const drawer = (
    <List
      sx={{
        background: 'linear-gradient(145deg, rgba(18, 18, 18, 0.9), rgba(30, 30, 30, 0.9))',
        height: '100%',
        backdropFilter: 'blur(10px)',
      }}
    >
      {menuItems.map((item) => (
        <ListItem 
          button 
          key={item.text}
          onClick={() => {
            navigate(item.path);
            handleDrawerToggle();
          }}
          sx={{
            '&:hover': {
              background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.1), rgba(186, 104, 200, 0.1))',
            },
          }}
        >
          <ListItemText 
            primary={item.text} 
            sx={{
              color: '#ba68c8',
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(186, 104, 200, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'center' }}>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: '#ba68c8',
                  position: 'absolute',
                  left: 0,
                  '&:hover': {
                    background: 'rgba(186, 104, 200, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                PaperProps={{
                  sx: {
                    background: 'transparent',
                  },
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2,
                background: 'linear-gradient(90deg, rgba(156, 39, 176, 0.1), rgba(106, 27, 154, 0.1))',
                padding: '8px 16px',
                borderRadius: '16px',
              }}
            >
              {menuItems.map((item) => navButton(item.text, item.path))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 