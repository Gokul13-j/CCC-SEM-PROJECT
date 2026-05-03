const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// LCS endpoint
app.post('/api/lcs', (req, res) => {
    const { string1, string2 } = req.body;

    if (!string1 || !string2) {
        return res.status(400).json({ error: 'Both strings are required' });
    }

    // Spawn C++ executable
    const cppProcess = spawn('./lcs.exe', [], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe']
    });

    // Send input to C++ program
    cppProcess.stdin.write(string1 + '\n');
    cppProcess.stdin.write(string2 + '\n');
    cppProcess.stdin.end();

    let result = '';
    let error = '';

    cppProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    cppProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    cppProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('C++ process error:', error);
            return res.status(500).json({ error: 'Error computing LCS' });
        }

        res.json({
            lcs: result.trim(),
            length: result.trim().length
        });
    });

    cppProcess.on('error', (err) => {
        console.error('Failed to start C++ process:', err);
        res.status(500).json({ error: 'Failed to execute LCS computation' });
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'LCS Web API is running' });
});

const server = app.listen(PORT, () => {
    console.log(`LCS Web API server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Try stopping the process using this port or set a different PORT environment variable.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});