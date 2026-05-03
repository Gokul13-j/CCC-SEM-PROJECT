# LCS Web - Longest Common Subsequence Dynamic Programming Demo

A web application demonstrating the Longest Common Subsequence (LCS) algorithm using dynamic programming. Features a modern HTML/CSS/JavaScript frontend with a Node.js backend that interfaces with a C++ implementation.

## Architecture

```
Browser (HTML/CSS/JS)
        ↓
   API Request (fetch)
        ↓
Backend Server (Node.js/Express)
        ↓
C++ LCS Logic
        ↓
Return Result (JSON)
        ↓
Display in UI
```

## Features

- Interactive web interface for LCS computation
- Real-time computation using C++ backend
- Clean, responsive design
- Error handling and loading states
- Example inputs for quick testing

## Prerequisites

- Node.js (v14 or higher)
- C++ compiler (g++ recommended)
- Windows/Linux/macOS

## Quick Start

1. **Compile and run with one command (Windows):**
   ```bash
   run.bat
   ```

2. **Or manually:**
   ```bash
   npm run build-cpp
   npm start
   ```

3. **Open browser:**
   ```
   http://localhost:3000
   ```

> If port `3000` is already in use, set a different port before starting the server:
> ```bash
> set PORT=4000
> npm start
> ```

## Usage

1. Enter two strings in the input fields
2. Click "Compute LCS" or press Enter
3. View the longest common subsequence and its length

### Example

- String 1: `AGGTAB`
- String 2: `GXTXAYB`
- LCS: `GTAB` (length: 4)

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/lcs` - Compute LCS
  - Body: `{ "string1": "first string", "string2": "second string" }`
  - Response: `{ "lcs": "result", "length": 4 }`

## Development

For development with auto-restart:
```bash
npm run dev
```

## Algorithm Details

The LCS algorithm uses dynamic programming with a 2D table where:
- `dp[i][j]` represents the length of LCS of `X[0..i-1]` and `Y[0..j-1]`
- If characters match: `dp[i][j] = dp[i-1][j-1] + 1`
- If not: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

Time Complexity: O(m*n) where m and n are string lengths
Space Complexity: O(m*n)

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Algorithm:** C++ with STL
- **Communication:** REST API with JSON

## License

MIT License