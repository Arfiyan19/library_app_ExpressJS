const express = require('express');
const libraryRoutes = require('./routes/libraryRoutes');  // Use the combined routes
const swaggerSetup = require('./swagger');
const app = express();
// Middleware
app.use(express.json());
// Use combined routes
app.use('/api', libraryRoutes);

// Swagger setup
swaggerSetup(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
