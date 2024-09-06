import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const BarList = () => {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await axios.get('/api/v1/bars');
        setBars(response.data.bars || []);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };

    fetchBars();
  }, []);

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Bars
          </Typography>
        </Toolbar>
      </AppBar>
      <TextField
        label="Enter name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <List>
        {filteredBars.map((bar) => (
          <ListItem key={bar.id}>
            <ListItemAvatar>
              <Avatar src={bar.image} alt={bar.name} />
            </ListItemAvatar>
            <ListItemText
              primary={bar.name}
              secondary={bar.phone}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default BarList;
