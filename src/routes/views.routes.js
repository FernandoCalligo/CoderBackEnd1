import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

router.get('/', async (req, res) => {
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    let products = [];

    if (fs.existsSync(productsPath)) {
        const data = fs.readFileSync(productsPath, 'utf-8');
        products = JSON.parse(data);
    }

    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;
