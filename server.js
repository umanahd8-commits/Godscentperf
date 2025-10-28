const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname)));

// In-memory database
let perfumes = [
    {
        id: '1',
        name: "Baccarat Rouge 540",
        brand: "Maison Francis Kurkdjian",
        description: "A luminous fragrance with notes of jasmine, saffron, and amberwood. An olfactory masterpiece that captures the essence of crystal.",
        price: 450000,
        originalPrice: 675000,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        badge: "Limited Edition"
    },
    {
        id: '2',
        name: "No. 5 Parfum",
        brand: "Chanel",
        description: "The timeless classic with notes of aldehydes, ylang-ylang, and May rose. The epitome of elegance and sophistication.",
        price: 285000,
        originalPrice: 420000,
        image: "https://images.unsplash.com/photo-1590736969955-71ac4460e351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        badge: "Heritage"
    },
    {
        id: '3',
        name: "Aventus",
        brand: "Creed",
        description: "A bold, fruity fragrance with pineapple, birch, and musk. The scent of success, ambition, and power.",
        price: 525000,
        originalPrice: 742500,
        image: "https://images.unsplash.com/photo-1613029226232-93c62f6a967a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        badge: "Exclusive"
    }
];

// Authentication middleware
const authenticateAdmin = (req, res, next) => {
    const { username, password } = req.headers;
    
    if (username === 'admin' && password === 'elegance2024') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// API Routes

// Get all perfumes
app.get('/api/perfumes', (req, res) => {
    res.json(perfumes);
});

// Add new perfume (admin only)
app.post('/api/perfumes', authenticateAdmin, (req, res) => {
    try {
        const { name, brand, description, price, originalPrice, image, badge } = req.body;
        
        const newPerfume = {
            id: uuidv4(),
            name,
            brand,
            description,
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
            image,
            badge: badge || null
        };
        
        perfumes.push(newPerfume);
        res.status(201).json({ success: true, perfume: newPerfume });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete perfume (admin only)
app.delete('/api/perfumes/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const initialLength = perfumes.length;
    
    perfumes = perfumes.filter(perfume => perfume.id !== id);
    
    if (perfumes.length < initialLength) {
        res.json({ success: true, message: 'Perfume deleted successfully' });
    } else {
        res.status(404).json({ success: false, error: 'Perfume not found' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}/`);
    console.log(`API: http://localhost:${PORT}/api`);
});