import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "http://radioactive.sytes.net:3001"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}));
app.use(morgan('combined'));

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1y',
    immutable: true
}));

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
