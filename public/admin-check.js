// Check if user is admin and show admin button
function checkAdminStatus() {
    const userStr = localStorage.getItem('user');
    const adminBtn = document.getElementById('adminNavBtn');
    
    if (userStr && adminBtn) {
        try {
            const user = JSON.parse(userStr);
            if (user.role === 'admin' || user.role === 'service_admin') {
                adminBtn.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    }
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAdminStatus);
} else {
    checkAdminStatus();
}
