import { Container, Typography, Box, Grid } from '@mui/material';
import GlassContainer from '../components/GlassContainer';

const About = () => {
  const skills = [
    'JavaScript (ES6+)',
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'Python',
    'Django',
    'Java',
    'C++',
    'C',
    'HTML & CSS',
    'Material-UI',
    'Git & GitHub',
    'Graphic Design',
  ];

  return (
    <Container sx={{ py: 8 }}>
      <GlassContainer>
        <Typography variant="h2" component="h1" gutterBottom>
          About Me
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <GlassContainer sx={{ height: '100%' }}>
              <Typography paragraph>
                Hello! I'm Tushar, a passionate full-stack developer with expertise in the MERN stack.
                I love creating web applications that solve real-world problems and deliver great user experiences.
              </Typography>
              <Typography paragraph>
                My journey in web development started with HTML and CSS, and I've since
                expanded my skills to include modern JavaScript frameworks, backend technologies,
                and various programming languages like Python, Java, C++, and C.
              </Typography>
            </GlassContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <GlassContainer sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Skills & Technologies
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
                gap: 2 
              }}>
                {skills.map((skill) => (
                  <Typography 
                    key={skill} 
                    variant="body2"
                    sx={{
                      '&:hover': {
                        color: 'primary.light',
                        transform: 'translateX(5px)',
                        transition: 'all 0.3s ease-in-out',
                      },
                    }}
                  >
                    • {skill}
                  </Typography>
                ))}
              </Box>
            </GlassContainer>
          </Grid>
        </Grid>
      </GlassContainer>
    </Container>
  );
};

export default About; 