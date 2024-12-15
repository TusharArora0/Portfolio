import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { GitHub, Launch } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  return (
    <Card
      component={motion.div}
      whileHover={{ y: -10 }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardMedia
        component="img"
        height="200"
        image={project.imageUrl}
        alt={project.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {project.title}
        </Typography>
        <Typography paragraph>{project.description}</Typography>
        <Box sx={{ mt: 2 }}>
          {project.technologies.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              sx={{ mr: 1, mb: 1 }}
              size="small"
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        {project.githubLink && (
          <Button 
            size="small" 
            startIcon={<GitHub />}
            href={project.githubLink}
            target="_blank"
          >
            Code
          </Button>
        )}
        {project.liveLink && (
          <Button
            size="small"
            startIcon={<Launch />}
            href={project.liveLink}
            target="_blank"
          >
            Live Demo
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProjectCard; 