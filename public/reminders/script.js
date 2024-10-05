// script.js

// Check for Notification permission
if ('Notification' in window) {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
}

// Initialize FullCalendar after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 600,
        selectable: true,
        editable: false,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [], // Events will be loaded from reminders
        eventClick: function (info) {
            // Edit reminder when event is clicked
            const reminderId = info.event.id;
            editReminderById(reminderId);
        }
    });

    // DOM Elements
    const reminderForm = document.getElementById('reminderForm');
    const reminderList = document.getElementById('reminderList');
    const exportBtn = document.getElementById('exportBtn');

    const totalRemindersEl = document.getElementById('totalReminders');
    const pendingRemindersEl = document.getElementById('pendingReminders');
    const completedRemindersEl = document.getElementById('completedReminders');

    // Retrieve reminders from localStorage or initialize empty array
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

    // Function to save reminders to localStorage
    function saveReminders() {
        localStorage.setItem('reminders', JSON.stringify(reminders));
        updateStatistics();
    }

    // Function to format date and time for display
    function formatDateTime(dateTime) {
        const options = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return new Date(dateTime).toLocaleString(undefined, options);
    }

    // Function to display reminders in the list
    function displayReminders() {
        reminderList.innerHTML = '';

        // Sort reminders by nextOccurrence
        const sortedReminders = reminders
            .filter(r => !r.completed)
            .sort((a, b) => new Date(a.nextOccurrence) - new Date(b.nextOccurrence));

        if (sortedReminders.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No upcoming reminders.';
            reminderList.appendChild(li);
            return;
        }

        sortedReminders.forEach((reminder, index) => {
            const li = document.createElement('li');
            li.id = reminder.id;
            if (reminder.completed) {
                li.classList.add('completed');
            }

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('reminder-info');

            const title = document.createElement('span');
            title.textContent = `${reminder.title} (${reminder.category}) - ${reminder.field}`;

            const datetime = document.createElement('span');
            datetime.textContent = formatDateTime(reminder.nextOccurrence);

            infoDiv.appendChild(title);
            infoDiv.appendChild(datetime);

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            const completeBtn = document.createElement('button');
            completeBtn.textContent = reminder.completed ? 'Undo' : 'Complete';
            completeBtn.classList.add('complete');
            completeBtn.addEventListener('click', () => toggleComplete(reminder.id));

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit');
            editBtn.addEventListener('click', () => editReminder(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete');
            deleteBtn.addEventListener('click', () => deleteReminder(index));

            actionsDiv.appendChild(completeBtn);
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(infoDiv);
            li.appendChild(actionsDiv);

            reminderList.appendChild(li);
        });
    }

    // Function to update statistics
    function updateStatistics() {
        const total = reminders.length;
        const completed = reminders.filter(r => r.completed).length;
        const pending = total - completed;

        totalRemindersEl.textContent = total;
        pendingRemindersEl.textContent = pending;
        completedRemindersEl.textContent = completed;
    }

    // Function to add a reminder
    function addReminder(reminder) {
        reminders.push(reminder);
        saveReminders();
        displayReminders();
        addEventToCalendar(reminder);
        scheduleNotification(reminder);
    }

    // Function to delete a reminder
    function deleteReminder(index) {
        if (confirm('Are you sure you want to delete this reminder?')) {
            const [removedReminder] = reminders.splice(index, 1);
            saveReminders();
            displayReminders();
            removeEventFromCalendar(removedReminder.id);
        }
    }

    // Function to edit a reminder
    function editReminder(index) {
        const reminder = reminders[index];

        // Populate form with existing data
        document.getElementById('title').value = reminder.title;
        document.getElementById('category').value = reminder.category;
        document.getElementById('field').value = reminder.field;
        document.getElementById('date').value = reminder.nextOccurrence.split('T')[0];
        document.getElementById('time').value = reminder.nextOccurrence.split('T')[1].substring(0, 5);
        document.getElementById('repeat').value = reminder.repeatEvery || '';

        // Remove the old reminder
        const [removedReminder] = reminders.splice(index, 1);
        saveReminders();
        displayReminders();
        removeEventFromCalendar(removedReminder.id);
    }

    // Function to edit a reminder by event ID (from calendar click)
    function editReminderById(reminderId) {
        const index = reminders.findIndex(r => r.id === reminderId);
        if (index !== -1) {
            editReminder(index);
        }
    }

    // Function to toggle completion status
    function toggleComplete(reminderId) {
        const reminder = reminders.find(r => r.id === reminderId);
        if (reminder) {
            reminder.completed = !reminder.completed;
            saveReminders();
            displayReminders();
            // Update calendar event color
            const event = calendar.getEventById(reminder.id);
            if (event) {
                event.setProp('backgroundColor', reminder.completed ? '#95a5a6' : getCategoryColor(reminder.category));
            }

            // If marked as completed and has a repeat interval, schedule next occurrence
            if (reminder.completed && reminder.repeatEvery && reminder.repeatEvery > 0) {
                scheduleNextOccurrence(reminder);
            }
        }
    }

    // Function to generate unique IDs for reminders
    function generateId() {
        return 'reminder-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    // Function to get color based on category
    function getCategoryColor(category) {
        switch (category) {
            case 'Medicine Spraying':
                return '#e74c3c'; // Red
            case 'Watering':
                return '#3498db'; // Blue
            default:
                return '#2ecc71'; // Green
        }
    }

    // Function to add event to FullCalendar
    function addEventToCalendar(reminder) {
        calendar.addEvent({
            id: reminder.id,
            title: `${reminder.title} (${reminder.category})`,
            start: reminder.nextOccurrence,
            allDay: false,
            backgroundColor: getCategoryColor(reminder.category),
            borderColor: getCategoryColor(reminder.category),
            extendedProps: {
                field: reminder.field
            }
        });
    }

    // Function to remove event from FullCalendar
    function removeEventFromCalendar(reminderId) {
        const event = calendar.getEventById(reminderId);
        if (event) {
            event.remove();
        }
    }

    // Function to schedule notification
    function scheduleNotification(reminder) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const reminderTime = new Date(reminder.nextOccurrence).getTime();
            const currentTime = Date.now();
            const timeout = reminderTime - currentTime;

            if (timeout > 0) {
                setTimeout(() => {
                    if (!reminder.completed) {
                        new Notification('Farmers Reminder', {
                            body: `${reminder.title} (${reminder.category}) for ${reminder.field}`,
                            icon: 'https://img.icons8.com/fluency/48/000000/plant.png'
                        });
                    }

                    // If the reminder is recurring and not completed, schedule the next occurrence
                    if (reminder.repeatEvery && !reminder.completed) {
                        scheduleNextOccurrence(reminder);
                    }
                }, timeout);
            }
        }
    }

    // Function to schedule next occurrence for recurring reminders
    function scheduleNextOccurrence(reminder) {
        const nextDate = new Date(reminder.nextOccurrence);
        nextDate.setDate(nextDate.getDate() + reminder.repeatEvery);

        // Create a new reminder for the next occurrence
        const nextReminder = {
            ...reminder,
            id: generateId(), // Generate a new ID for the new reminder
            nextOccurrence: nextDate.toISOString(), // Set the next occurrence date
            completed: false // Ensure the new reminder is not completed
        };

        // Add the new reminder to the list and save
        addReminder(nextReminder);
    }

    // Function to export reminders as CSV
    function exportToCSV() {
        if (reminders.length === 0) {
            alert('No reminders to export.');
            return;
        }

        const headers = ['Title', 'Category', 'Field', 'DateTime', 'Repeat Every (days)', 'Status'];
        const rows = reminders.map(r => [
            `"${r.title.replace(/"/g, '""')}"`,
            `"${r.category.replace(/"/g, '""')}"`,
            `"${r.field.replace(/"/g, '""')}"`,
            `"${formatDateTime(r.nextOccurrence)}"`,
            r.repeatEvery ? r.repeatEvery : '',
            `"${r.completed ? 'Completed' : 'Pending'}"`
        ]);

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.join(',') + '\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        const currentDate = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `reminders_${currentDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Event Listener for Export Button
    exportBtn.addEventListener('click', exportToCSV);

    // Handle form submission
    reminderForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const field = document.getElementById('field').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const repeatEvery = parseInt(document.getElementById('repeat').value) || null;

        // Validation: Ensure date and time are in the future
        const selectedDateTime = new Date(`${date}T${time}`);
        if (selectedDateTime <= new Date()) {
            alert('Please select a future date and time for the reminder.');
            return;
        }

        const reminder = {
            id: generateId(),
            title,
            category,
            field,
            nextOccurrence: selectedDateTime.toISOString(),
            repeatEvery,
            completed: false
        };
        addReminder(reminder);

        this.reset();
    });

    // Function to load reminders into calendar
    function loadRemindersToCalendar() {
        reminders.forEach(reminder => {
            if (!reminder.completed) {
                addEventToCalendar(reminder);
            }
        });
    }

    // Initialize display and calendar
    displayReminders();
    loadRemindersToCalendar();
    updateStatistics();

    // Schedule notifications for existing reminders
    reminders.forEach(reminder => {
        scheduleNotification(reminder);
    });

    // Render the calendar
    calendar.render();
});
