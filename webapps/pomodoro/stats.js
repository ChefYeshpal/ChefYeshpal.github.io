// This file's pourpouse is: Stats tracking and data persistence module
// All statistics-related functionality for the Pomodoro Timer including storing data for work and break times

// Global variables that need to be accessible from main.js
let currentTimerSession = null;

// --- Stats Modal ---
const statsBtn = document.getElementById('statsBtn');
const statsModal = document.getElementById('statsModal');
const closeStatsModal = document.getElementById('closeStatsModal');
const statsChart = document.getElementById('statsChart');

// Download controls
const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const downloadChartBtn = document.getElementById('downloadChartBtn');

// Time view controls
const hourlyViewBtn = document.getElementById('hourlyView');
const quarterlyViewBtn = document.getElementById('quarterlyView');
const halfViewBtn = document.getElementById('halfView');
const dailyViewBtn = document.getElementById('dailyView');

let currentTimeView = 'daily'; // Default to daily view

// Download CSV function
function downloadSessionsCSV() {
    const data = JSON.parse(localStorage.getItem('pomodoroData')) || {};
    const sessions = data.sessions || [];
    
    if (sessions.length === 0) {
        alert('No session data available to download.');
        return;
    }
    
    // CSV headers
    const headers = [
        'Date',
        'Start Time', 
        'End Time',
        'Type',
        'Duration (minutes)',
        'Status',
        'Completed',
        'Skipped'
    ];
    
    // Convert sessions to CSV rows
    const rows = sessions.map(session => {
        const startDate = new Date(session.start);
        const endDate = new Date(session.end);
        const duration = ((session.end - session.start) / 1000 / 60).toFixed(2);
        
        let status = 'Completed';
        if (session.skipped) status = 'Skipped';
        else if (session.completed === false) status = 'Incomplete';
        
        return [
            startDate.toLocaleDateString(),
            startDate.toLocaleTimeString(),
            endDate.toLocaleTimeString(),
            session.type.charAt(0).toUpperCase() + session.type.slice(1),
            duration,
            status,
            session.completed !== false ? 'Yes' : 'No',
            session.skipped ? 'Yes' : 'No'
        ];
    });
    
    // Combine headers and data
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pomodoro-sessions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Download Chart as PNG function
function downloadChartAsPNG() {
    // Temporarily switch to daily view for download if not already
    const originalView = currentTimeView;
    const needsViewChange = currentTimeView !== 'daily';
    
    if (needsViewChange) {
        currentTimeView = 'daily';
        renderStatsChart();
    }
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const chartContainer = document.getElementById('statsChart');
    const containerRect = chartContainer.getBoundingClientRect();
    canvas.width = 800;
    canvas.height = 400;
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Pomodoro Sessions - 24 Hour View', canvas.width / 2, 30);
    
    // Draw subtitle with date
    ctx.font = '14px Arial';
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 50);
    
    // Chart area dimensions
    const chartX = 80;
    const chartY = 80;
    const chartWidth = canvas.width - 160;
    const chartHeight = 240;
    
    // Get data
    const data = JSON.parse(localStorage.getItem('pomodoroData')) || {};
    const sessions = data.sessions || [];
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const totalMinutesInDay = 24 * 60;
    
    // Filter sessions for today
    const todaySessions = sessions.filter(s => s.start >= startOfDay && s.start < startOfDay + (totalMinutesInDay * 60 * 1000));
    
    // Categories
    const categories = [
        { name: 'Work', type: 'work', color: '#e57373' },
        { name: 'Short Break', type: 'short', color: '#65a2ff' },
        { name: 'Long Break', type: 'long', color: '#81c784' }
    ];
    
    const rowHeight = chartHeight / categories.length;
    
    // Draw category labels and bars
    categories.forEach((cat, index) => {
        const y = chartY + (index * rowHeight);
        
        // Draw category label
        ctx.fillStyle = '#333333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(cat.name, chartX - 10, y + (rowHeight / 2) + 5);
        
        // Draw horizontal grid line
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartX, y + rowHeight);
        ctx.lineTo(chartX + chartWidth, y + rowHeight);
        ctx.stroke();
        
        // Draw bars for this category
        todaySessions
            .filter(s => s.type === cat.type)
            .forEach(session => {
                const startMinute = (session.start - startOfDay) / (1000 * 60);
                const endMinute = (session.end - startOfDay) / (1000 * 60);
                
                const barX = chartX + (startMinute / totalMinutesInDay) * chartWidth;
                const barWidth = ((endMinute - startMinute) / totalMinutesInDay) * chartWidth;
                const barY = y + 10;
                const barHeight = rowHeight - 20;
                
                // Set color based on session status
                if (session.skipped) {
                    ctx.fillStyle = '#999999';
                } else {
                    ctx.fillStyle = cat.color;
                }
                
                // Draw bar
                ctx.fillRect(barX, barY, barWidth, barHeight);
                
                // Draw border
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(barX, barY, barWidth, barHeight);
            });
    });
    
    // Draw chart border
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.strokeRect(chartX, chartY, chartWidth, chartHeight);
    
    // Draw time labels (every 2 hours for better granularity)
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    for (let hour = 0; hour <= 24; hour += 2) {
        const x = chartX + (hour / 24) * chartWidth;
        ctx.fillText(`${hour}:00`, x, chartY + chartHeight + 20);
        
        // Draw vertical grid lines (lighter for 2-hour intervals)
        if (hour > 0 && hour < 24) {
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, chartY);
            ctx.lineTo(x, chartY + chartHeight);
            ctx.stroke();
        }
    }
    
    // Add lighter grid lines for hourly intervals
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    for (let hour = 1; hour < 24; hour++) {
        if (hour % 2 !== 0) { // Only draw for odd hours (1, 3, 5, etc.)
            const x = chartX + (hour / 24) * chartWidth;
            ctx.beginPath();
            ctx.moveTo(x, chartY);
            ctx.lineTo(x, chartY + chartHeight);
            ctx.stroke();
        }
    }
    
    // Draw legend
    const legendY = chartY + chartHeight + 60;
    let legendX = chartX;
    
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    categories.forEach((cat, index) => {
        // Color box
        ctx.fillStyle = cat.color;
        ctx.fillRect(legendX, legendY, 15, 15);
        
        // Label
        ctx.fillStyle = '#333333';
        ctx.fillText(cat.name, legendX + 20, legendY + 12);
        
        legendX += ctx.measureText(cat.name).width + 40;
    });
    
    // Add skipped indicator
    ctx.fillStyle = '#999999';
    ctx.fillRect(legendX, legendY, 15, 15);
    ctx.fillStyle = '#333333';
    ctx.fillText('Skipped', legendX + 20, legendY + 12);
    
    // Convert canvas to blob and download
    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `pomodoro-chart-${new Date().toISOString().split('T')[0]}.png`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Restore original view if it was changed
        if (needsViewChange) {
            currentTimeView = originalView;
            renderStatsChart();
        }
    });
}

function renderStatsChart() {
    statsChart.innerHTML = ''; // Clear previous chart

    const data = JSON.parse(localStorage.getItem('pomodoroData')) || {};
    const sessions = data.sessions || [];

    const now = new Date();
    let startOfPeriod, totalMinutesInPeriod, stepSize, stepLabel;
    
    // Configure view based on current selection
    switch (currentTimeView) {
        case 'hourly':
            startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()).getTime();
            totalMinutesInPeriod = 60;
            stepSize = 15; // 15-minute intervals
            stepLabel = 'min';
            break;
        case 'quarterly':
            const currentHour = now.getHours();
            const quarterStart = Math.floor(currentHour / 6) * 6;
            startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), quarterStart).getTime();
            totalMinutesInPeriod = 6 * 60; // 6 hours
            stepSize = 60; // 1-hour intervals
            stepLabel = 'hr';
            break;
        case 'half':
            const halfStart = now.getHours() < 12 ? 0 : 12;
            startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), halfStart).getTime();
            totalMinutesInPeriod = 12 * 60; // 12 hours
            stepSize = 120; // 2-hour intervals
            stepLabel = 'hr';
            break;
        case 'daily':
        default:
            startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            totalMinutesInPeriod = 24 * 60; // 24 hours
            stepSize = 240; // 4-hour intervals
            stepLabel = 'hr';
            break;
    }

    // Filter sessions for the selected time period
    const periodSessions = sessions.filter(s => s.start >= startOfPeriod && s.start < startOfPeriod + (totalMinutesInPeriod * 60 * 1000));

    // Define categories, create rows, and set bar colour
    const categories = [
        { name: 'Work', type: 'work', color: '#e57373' },
        { name: 'Short Break', type: 'short', color: '#65a2ff' },
        { name: 'Long Break', type: 'long', color: '#81c784' }
    ];

    categories.forEach((cat, index) => {
        // Y-axis Label
        const yLabel = document.createElement('div');
        yLabel.className = 'chart-y-label';
        yLabel.textContent = cat.name;
        yLabel.style.gridRow = index + 1;
        statsChart.appendChild(yLabel);

        // Row for bars
        const row = document.createElement('div');
        row.className = 'chart-row';
        row.style.gridRow = index + 1;
        statsChart.appendChild(row);

        // Filter sessions for this category and create bars
        periodSessions
            .filter(s => s.type === cat.type)
            .forEach(session => {
                const startMinute = (session.start - startOfPeriod) / (1000 * 60);
                const endMinute = (session.end - startOfPeriod) / (1000 * 60);

                const left = (startMinute / totalMinutesInPeriod) * 100;
                const width = ((endMinute - startMinute) / totalMinutesInPeriod) * 100;

                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.left = `${left}%`;
                bar.style.width = `${width}%`;
                
                // Style based on whether session was completed or skipped
                if (session.skipped) {
                    bar.style.background = '#999999'; // Gray for skipped parts
                    bar.style.opacity = '0.6';
                    const duration = (session.end - session.start) / 1000 / 60;
                    bar.title = `SKIPPED ${cat.name}\nFrom ${new Date(session.start).toLocaleTimeString()} to ${new Date(session.end).toLocaleTimeString()}\nDuration: ${duration.toFixed(1)} minutes (skipped)`;
                } else {
                    bar.style.background = cat.color;
                    const duration = (session.end - session.start) / 1000 / 60;
                    const status = session.completed === false ? ' (incomplete)' : '';
                    bar.title = `${cat.name.toUpperCase()}\nFrom ${new Date(session.start).toLocaleTimeString()} to ${new Date(session.end).toLocaleTimeString()}\nDuration: ${duration.toFixed(1)} minutes${status}`;
                }
                
                // Add glow hover effects
                bar.addEventListener('mouseenter', function(e) {
                    this.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6)';
                    this.style.transition = 'box-shadow 0.2s ease';
                    this.style.zIndex = '10';
                });
                
                bar.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Create a radial glow effect centered on mouse position
                    const glowX = (x / rect.width) * 100;
                    const glowY = (y / rect.height) * 100;
                    
                    this.style.boxShadow = `
                        0 0 15px rgba(255, 255, 255, 0.9),
                        inset ${glowX - 50}% ${glowY - 50}% 30px rgba(255, 255, 255, 0.3)
                    `;
                });
                
                bar.addEventListener('mouseleave', function() {
                    this.style.boxShadow = 'none';
                    this.style.zIndex = '1';
                });
                
                row.appendChild(bar);
            });
    });

    // X-axis labels (time)
    const xLabels = document.createElement('div');
    xLabels.className = 'chart-labels-x';
    
    const numLabels = Math.ceil(totalMinutesInPeriod / stepSize) + 1;
    for (let i = 0; i < numLabels; i++) {
        const label = document.createElement('span');
        const minutesFromStart = i * stepSize;
        const labelTime = new Date(startOfPeriod + minutesFromStart * 60 * 1000);
        
        if (stepLabel === 'min') {
            label.textContent = labelTime.getMinutes() + 'min';
        } else {
            label.textContent = labelTime.getHours() + ':00';
        }
        
        xLabels.appendChild(label);
    }
    
    statsChart.appendChild(xLabels);
}

// Show stats modal
function showStatsModal() {
    // Update title based on current view
    const titleElement = document.querySelector('.stats-modal-header h3');
    const viewTitles = {
        'hourly': 'This Hour\'s Activity',
        'quarterly': 'Last 6 Hours Activity', 
        'half': 'Last 12 Hours Activity',
        'daily': 'Today\'s Activity'
    };
    if (titleElement) {
        titleElement.textContent = viewTitles[currentTimeView] || 'Activity';
    }
    
    renderStatsChart();
    statsModal.style.display = 'flex';
}

function closeStatsModalFunc() {
    statsModal.style.display = 'none';
}

// Event listeners for stats modal
if (statsBtn && statsModal && closeStatsModal) {
    statsBtn.onclick = showStatsModal;
    closeStatsModal.onclick = closeStatsModalFunc;
    statsModal.onclick = (e) => {
        if (e.target === statsModal) {
            closeStatsModalFunc();
        }
    };
}

// Event listeners for download buttons
if (downloadCsvBtn) {
    downloadCsvBtn.onclick = downloadSessionsCSV;
}

if (downloadChartBtn) {
    downloadChartBtn.onclick = downloadChartAsPNG;
}

// Event listeners for time view controls
function setActiveTimeView(selectedView) {
    currentTimeView = selectedView;
    
    // Update button states
    document.querySelectorAll('.time-view-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(selectedView + 'View').classList.add('active');
    
    // Update title
    const titleElement = document.querySelector('.stats-modal-header h3');
    const viewTitles = {
        'hourly': 'This Hour\'s Activity',
        'quarterly': 'Last 6 Hours Activity', 
        'half': 'Last 12 Hours Activity',
        'daily': 'Today\'s Activity'
    };
    if (titleElement) {
        titleElement.textContent = viewTitles[selectedView] || 'Activity';
    }
    
    // Re-render chart
    renderStatsChart();
}

if (hourlyViewBtn) hourlyViewBtn.onclick = () => setActiveTimeView('hourly');
if (quarterlyViewBtn) quarterlyViewBtn.onclick = () => setActiveTimeView('quarterly');
if (halfViewBtn) halfViewBtn.onclick = () => setActiveTimeView('half');
if (dailyViewBtn) dailyViewBtn.onclick = () => setActiveTimeView('daily');

// --- Data Persistence using localStorage ---

function saveData(pomodoroAppState) {
    const existingData = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    
    const data = {
        workDuration: pomodoroAppState.workDuration,
        shortBreak: pomodoroAppState.shortBreak,
        longBreak: pomodoroAppState.longBreak,
        intervals: pomodoroAppState.intervals,
        pomodoros: pomodoroAppState.pomodoros,
        skippedPomodoros: pomodoroAppState.skippedPomodoros,
        totalWorkTime: pomodoroAppState.totalWorkTime,
        totalShortBreakTime: pomodoroAppState.totalShortBreakTime,
        totalLongBreakTime: pomodoroAppState.totalLongBreakTime,
        tasks: pomodoroAppState.tasks,
        sessions: existingData.sessions || [],
        timerState: {
            remaining: pomodoroAppState.timer,
            state: pomodoroAppState.state,
            isRunning: pomodoroAppState.timerInterval !== null,
            endTimestamp: pomodoroAppState.timerEndTimestamp
        }
    };
    localStorage.setItem('pomodoroData', JSON.stringify(data));
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('pomodoroData'));
    if (!data) return null;

    return {
        workDuration: data.workDuration || 25,
        shortBreak: data.shortBreak || 5,
        longBreak: data.longBreak || 15,
        intervals: data.intervals || 4,
        pomodoros: data.pomodoros || 0,
        skippedPomodoros: data.skippedPomodoros || 0,
        totalWorkTime: data.totalWorkTime || 0,
        totalShortBreakTime: data.totalShortBreakTime || 0,
        totalLongBreakTime: data.totalLongBreakTime || 0,
        tasks: data.tasks || [],
        timerState: data.timerState || null
    };
}

// Session tracking functions
function startSession(type) {
    // End any existing session first
    if (currentTimerSession) {
        endSession();
    }
    
    currentTimerSession = {
        type: type,
        start: Date.now()
    };
    console.log(`Started ${type} session at ${new Date().toLocaleTimeString()}`);
}

function endSession() {
    if (currentTimerSession) {
        currentTimerSession.end = Date.now();
        
        const duration = (currentTimerSession.end - currentTimerSession.start) / 1000 / 60; // in minutes
        console.log(`Ended ${currentTimerSession.type} session after ${duration.toFixed(1)} minutes`);
        
        // Add to sessions array
        const data = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
        if (!data.sessions) data.sessions = [];
        data.sessions.push(currentTimerSession);
        localStorage.setItem('pomodoroData', JSON.stringify(data));
        
        currentTimerSession = null;
    }
}

// Skip session - records both completed and skipped parts for showing on the graph
function skipSession() {
    if (currentTimerSession) {
        const now = Date.now();
        const actualDuration = now - currentTimerSession.start;
        
        // Get expected duration based on session type (work/break)
        let expectedDuration;
        if (currentTimerSession.type === 'work') {
            expectedDuration = (window.workDuration || 25) * 60 * 1000;
        } else if (currentTimerSession.type === 'short') {
            expectedDuration = (window.shortBreak || 5) * 60 * 1000;
        } else {
            expectedDuration = (window.longBreak || 15) * 60 * 1000;
        }
        
        console.log(`Skipped ${currentTimerSession.type} session after ${(actualDuration / 1000 / 60).toFixed(1)} minutes (expected ${expectedDuration / 1000 / 60} minutes)`);
        
        const data = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
        if (!data.sessions) data.sessions = [];
        
        // Add the completed part
        data.sessions.push({
            type: currentTimerSession.type,
            start: currentTimerSession.start,
            end: now,
            completed: true
        });
        
        // Add the skipped part (if there was remaining time)
        if (actualDuration < expectedDuration) {
            data.sessions.push({
                type: currentTimerSession.type,
                start: now,
                end: currentTimerSession.start + expectedDuration,
                completed: false,
                skipped: true
            });
        }
        
        localStorage.setItem('pomodoroData', JSON.stringify(data));
        currentTimerSession = null;
    }
}

// Add a function to check and complete any incomplete session
function completeCurrentSession() {
    if (currentTimerSession && !currentTimerSession.end) {
        endSession();
    }
}

// Test function for generating fake sessions
// Generates fake sessions using the current user-configured durations (workDuration, shortBreak, longBreak) and intervals.
function generateFakeSessions() {
    // Get current app state from main.js if available
    const workDuration = window.workDuration || 25;
    const shortBreak = window.shortBreak || 5;
    const longBreak = window.longBreak || 15;
    const intervals = window.intervals || 4;

    const sessions = [];
    const now = new Date();
    // Start generating data from 3 hours ago
    let currentTime = now.getTime() - 3 * 60 * 60 * 1000;

    // Use current configured durations (they are in minutes in the app)
    const workMs = Math.max(1, workDuration) * 60 * 1000;
    const shortMs = Math.max(1, shortBreak) * 60 * 1000;
    const longMs = Math.max(1, longBreak) * 60 * 1000;

    // Number of pomodoro cycles to generate (at least 1)
    const cycles = Math.max(1, intervals);

    for (let i = 0; i < cycles; i++) {
        // Work Session - sometimes skip it for demo
        let start = currentTime;
        let shouldSkip = Math.random() < 0.3; // 30% chance to skip
        
        if (shouldSkip) {
            // Add completed part (70% of expected time)
            let partialEnd = start + workMs * 0.7;
            sessions.push({ 
                type: 'work', 
                start, 
                end: partialEnd, 
                completed: true 
            });
            
            // Add skipped part
            let fullEnd = start + workMs;
            sessions.push({ 
                type: 'work', 
                start: partialEnd, 
                end: fullEnd, 
                completed: false, 
                skipped: true 
            });
            currentTime = fullEnd;
        } else {
            let end = start + workMs;
            sessions.push({ type: 'work', start, end, completed: true });
            currentTime = end;
        }

        // Break Session: make the last break a long one
        start = currentTime;
        let breakMs = (i === cycles - 1) ? longMs : shortMs;
        let breakType = (i === cycles - 1) ? 'long' : 'short';
        
        // Breaks are less likely to be skipped
        shouldSkip = Math.random() < 0.15; // 15% chance to skip
        
        if (shouldSkip) {
            // Add completed part (50% of expected time)
            let partialEnd = start + breakMs * 0.5;
            sessions.push({ 
                type: breakType, 
                start, 
                end: partialEnd, 
                completed: true 
            });
            
            // Add skipped part
            let fullEnd = start + breakMs;
            sessions.push({ 
                type: breakType, 
                start: partialEnd, 
                end: fullEnd, 
                completed: false, 
                skipped: true 
            });
            currentTime = fullEnd;
        } else {
            let end = start + breakMs;
            sessions.push({ type: breakType, start, end, completed: true });
            currentTime = end;
        }
    }

    // Save the fake data to localStorage (preserve other saved fields if present)
    const data = JSON.parse(localStorage.getItem('pomodoroData')) || {};
    data.sessions = sessions;
    localStorage.setItem('pomodoroData', JSON.stringify(data));

    console.log(`✅ Fake session data generated using work=${workDuration}min, short=${shortBreak}min, long=${longBreak}min, cycles=${cycles}`);
    console.log(`Generated ${sessions.length} session records (including ${sessions.filter(s => s.skipped).length} skipped segments)`);
    alert('Fake session data has been generated! Please open the stats modal to see the chart with skipped sessions in gray.');

    // Automatically refresh the chart if it's open
    if (document.getElementById('statsModal').style.display === 'flex') {
        renderStatsChart();
    }
}

// Export functions to be used by main.js
window.PomodoroStats = {
    saveData,
    loadData,
    startSession,
    endSession,
    skipSession,
    completeCurrentSession,
    generateFakeSessions,
    showStatsModal,
    closeStatsModal: closeStatsModalFunc,
    get currentTimerSession() { return currentTimerSession; }
};