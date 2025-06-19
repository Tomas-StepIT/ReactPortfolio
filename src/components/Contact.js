import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export let colors = ["rgb(0,255,164)", "rgb(166,104,255)"];
export default function Contact() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [
e.target.name
]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission logic here
      alert('Děkujeme za zprávu!');
      setForm({ name: '', email: '', message: '' });
    };

    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Kontaktujte mě
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Jméno"
              name="name"
              value={
                form.name
              }
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={
              form.email
            }
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Vaše Zpráva"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Odeslat
                    </Button>
                </form>
            </Paper>
        </Box>
    );
} 

