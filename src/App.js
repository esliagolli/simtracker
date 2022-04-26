import './App.css';

import AppBar from '@mui/material/AppBar';
import GridViewIcon from '@mui/icons-material/GridView';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SimList from './components/SimList'

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function App() {
  return (
    <div className="App">
        <AppBar position="relative">
            <Toolbar>
                <GridViewIcon sx={{ mr: 2 }} />
                <Typography variant="h6" color="inherit" noWrap>
                    SIM Tracker
                </Typography>
            </Toolbar>
        </AppBar>
        <main>
            <Box sx={{pt: 4, pb: 6}}>
                <Container maxWidth="xl">
                    <SimList/>
                </Container>
            </Box>
        </main>
        {/* Footer */}
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Typography variant="h6" align="center" gutterBottom>
                Sim Tracker Assignment
            </Typography>
            <Copyright />
        </Box>
        {/* End footer */}
    </div>
  );
}

export default App;
