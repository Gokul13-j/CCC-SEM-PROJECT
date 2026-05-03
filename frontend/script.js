// DOM elements
const string1Input = document.getElementById('string1');
const string2Input = document.getElementById('string2');
const computeBtn = document.getElementById('compute-btn');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const lcsResultSpan = document.getElementById('lcs-result');
const lcsLengthSpan = document.getElementById('lcs-length');
const errorMessageP = document.getElementById('error-message');

// API endpoint
const API_BASE = 'http://localhost:3000';

// Event listeners
computeBtn.addEventListener('click', computeLCS);

// Functions
async function computeLCS() {
    const string1 = string1Input.value.trim();
    const string2 = string2Input.value.trim();

    if (!string1 || !string2) {
        showError('Please enter both strings');
        return;
    }

    // Show loading state
    showLoading();

    try {
        const response = await fetch(`${API_BASE}/api/lcs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                string1: string1,
                string2: string2
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Show result
        showResult(data.lcs, data.length);

    } catch (error) {
        console.error('Error computing LCS:', error);
        showError('Failed to compute LCS. Please check if the server is running.');
    }
}

function showLoading() {
    loadingDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    computeBtn.disabled = true;
}

function showResult(lcs, length) {
    loadingDiv.style.display = 'none';
    resultDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    computeBtn.disabled = false;

    lcsResultSpan.textContent = `"${lcs}"`;
    lcsLengthSpan.textContent = length;
}

function showError(message) {
    loadingDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'block';
    computeBtn.disabled = false;

    errorMessageP.textContent = message;
}

// Allow Enter key to trigger computation
[string1Input, string2Input].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            computeLCS();
        }
    });
});

// Initialize with example values
document.addEventListener('DOMContentLoaded', () => {
    // Values are already set in HTML
    console.log('LCS Web App loaded');
});