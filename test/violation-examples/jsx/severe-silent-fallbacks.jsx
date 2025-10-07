//======================================================================
// SEVERE NO_SILENT_FALLBACKS VIOLATIONS - JSX/React
// การซ่อนข้อผิดพลาดใน React Components, Hooks และ Event Handlers
//======================================================================

import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';

// VIOLATION 1: React Error Boundaries ที่ซ่อนข้อผิดพลาด
class SilentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // CRITICAL: Error caught but silently ignored - no logging or reporting
    console.log('Error caught but ignored:', error.message);
    
    // CRITICAL: Always render children as if nothing happened
    this.setState({ hasError: false, error: null });
  }

  render() {
    // CRITICAL: Never shows error state, always renders children
    return this.props.children;
  }
}

// VIOLATION 2: Custom Hooks ที่ซ่อน Error States
const useUserData = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        // CRITICAL: API errors silently ignored, returns null user
        console.log('User fetch failed, returning null');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // CRITICAL: Never returns error state, caller can't know if request failed
  return { user, loading }; // Missing: error
};

const useApiCall = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const makeRequest = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        // CRITICAL: Non-OK responses treated as success with empty data
        console.warn(`API returned ${response.status}, using empty data`);
        setData({});
        return;
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      // CRITICAL: Network errors result in fake success data
      console.error('Request failed, returning fake data:', error);
      setData({ error: false, message: 'Success', data: [] });
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    makeRequest();
  }, dependencies);

  return { data, isLoading, refetch: makeRequest };
};

// VIOLATION 3: Event Handlers ที่ไม่แสดง Error
const FormComponent = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('/api/users', formData);
      
      // CRITICAL: Success assumed even if request might have failed
      console.log('User created successfully (assumed)');
      setFormData({ name: '', email: '', password: '' });
      
    } catch (error) {
      // CRITICAL: All form submission errors silently ignored
      console.log('Form submission failed, but user won\'t know');
      
      // Form appears to succeed even when it fails
      setFormData({ name: '', email: '', password: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await axios.post('/api/upload', formData);
    } catch (error) {
      // CRITICAL: File upload failures silently ignored
      console.log('File upload failed silently');
      // User thinks upload succeeded
    }
  };

  const handleInputChange = (field) => (event) => {
    try {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    } catch (error) {
      // CRITICAL: Input validation errors silently ignored
      console.log('Input validation failed, using previous value');
    }
  };

  return (
    <SilentErrorBoundary>
      <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            style={{ marginLeft: '8px', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            style={{ marginLeft: '8px', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            style={{ marginLeft: '8px', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Profile Picture:</label>
          <input
            type="file"
            onChange={handleFileUpload}
            accept="image/*"
            style={{ marginLeft: '8px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </SilentErrorBoundary>
  );
};

// VIOLATION 4: Context Provider ที่ซ่อน Errors
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [notifications, setNotifications] = useState([]);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      // CRITICAL: Login failures return success
      console.log('Login failed, but returning success');
      setUser({ id: 'guest', name: 'Guest User', role: 'guest' });
      return { success: true }; // Lie about success
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      // CRITICAL: Logout errors silently ignored
      console.log('Logout request failed, proceeding anyway');
    }
    
    setUser(null);
    setSettings({});
    setNotifications([]);
  };

  const updateSettings = async (newSettings) => {
    try {
      await axios.put('/api/settings', newSettings);
      setSettings(newSettings);
    } catch (error) {
      // CRITICAL: Settings update failures ignored, UI shows success
      console.log('Settings update failed, but UI will show success');
      setSettings(newSettings); // Update local state even if server failed
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      settings,
      notifications,
      login,
      logout,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

// VIOLATION 5: Data Fetching Components ที่ซ่อน Loading/Error States
const DataDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchDashboardData = useCallback(async () => {
    try {
      // Multiple concurrent API calls
      const [usersResponse, analyticsResponse, settingsResponse] = await Promise.allSettled([
        fetch('/api/dashboard/users'),
        fetch('/api/dashboard/analytics'),
        fetch('/api/dashboard/settings')
      ]);

      // CRITICAL: Promise.allSettled results processed but failures ignored
      const data = {};
      
      if (usersResponse.status === 'fulfilled' && usersResponse.value.ok) {
        data.users = await usersResponse.value.json();
      } else {
        // CRITICAL: Failed user data replaced with fake data
        console.log('Users API failed, using fake data');
        data.users = { count: 0, list: [] };
      }

      if (analyticsResponse.status === 'fulfilled' && analyticsResponse.value.ok) {
        data.analytics = await analyticsResponse.value.json();
      } else {
        // CRITICAL: Failed analytics replaced with zeros
        console.log('Analytics API failed, using zero data');
        data.analytics = { pageViews: 0, uniqueVisitors: 0, bounceRate: 0 };
      }

      if (settingsResponse.status === 'fulfilled' && settingsResponse.value.ok) {
        data.settings = await settingsResponse.value.json();
      } else {
        // CRITICAL: Failed settings replaced with defaults
        console.log('Settings API failed, using defaults');
        data.settings = { theme: 'light', notifications: true };
      }

      setDashboardData(data);
      setLastUpdated(new Date());

    } catch (error) {
      // CRITICAL: Complete fetch failure results in fake dashboard
      console.log('Dashboard fetch completely failed, showing fake data');
      setDashboardData({
        users: { count: 999, list: [] },
        analytics: { pageViews: 1000000, uniqueVisitors: 50000, bounceRate: 25 },
        settings: { theme: 'light', notifications: true }
      });
      setLastUpdated(new Date());
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // CRITICAL: Component never shows loading or error states
  if (!dashboardData) {
    // Show fake loading data instead of loading spinner
    return (
      <div style={{ padding: '20px' }}>
        <h2>Dashboard (Loading...)</h2>
        <div>Preparing your data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>
      <p>Last updated: {lastUpdated.toLocaleString()}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>Users</h3>
          <p>Total: {dashboardData.users.count}</p>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>Analytics</h3>
          <p>Page Views: {dashboardData.analytics.pageViews.toLocaleString()}</p>
          <p>Unique Visitors: {dashboardData.analytics.uniqueVisitors.toLocaleString()}</p>
          <p>Bounce Rate: {dashboardData.analytics.bounceRate}%</p>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>Settings</h3>
          <p>Theme: {dashboardData.settings.theme}</p>
          <p>Notifications: {dashboardData.settings.notifications ? 'Enabled' : 'Disabled'}</p>
        </div>
      </div>

      <button 
        onClick={fetchDashboardData}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Refresh Dashboard
      </button>
    </div>
  );
};

// VIOLATION 6: List Component ที่ไม่แสดง Error States
const UserList = () => {
  const { user, loading } = useUserData('current');
  const { data: users, isLoading: usersLoading, refetch } = useApiCall('/api/users');

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      // CRITICAL: Assume deletion succeeded, refresh list
      refetch();
    } catch (error) {
      // CRITICAL: Delete failures silently ignored
      console.log('Delete failed but refreshing list anyway');
      refetch(); // Still refresh, user thinks delete worked
    }
  };

  const handleEditUser = async (userId, updates) => {
    try {
      await axios.put(`/api/users/${userId}`, updates);
      refetch();
    } catch (error) {
      // CRITICAL: Edit failures ignored, list refreshed anyway
      console.log('Edit failed but list will refresh');
      refetch();
    }
  };

  // CRITICAL: Never shows error states, always renders content or loading
  if (loading || usersLoading) {
    return <div>Loading users...</div>;
  }

  const userList = users?.data || [];

  return (
    <SilentErrorBoundary>
      <div style={{ padding: '20px' }}>
        <h2>User Management</h2>
        
        {userList.length === 0 ? (
          <p>No users found (or API failed silently)</p>
        ) : (
          <div>
            {userList.map((user, index) => (
              <div key={user.id || index} style={{
                border: '1px solid #ddd',
                margin: '8px 0',
                padding: '12px',
                borderRadius: '4px'
              }}>
                <h4>{user.name || 'Unknown User'}</h4>
                <p>Email: {user.email || 'No email'}</p>
                <button 
                  onClick={() => handleEditUser(user.id, { name: 'Updated Name' })}
                  style={{ marginRight: '8px', padding: '4px 8px' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  style={{ 
                    padding: '4px 8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '2px'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={refetch}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Refresh List
        </button>
      </div>
    </SilentErrorBoundary>
  );
};

// Main App Component
const App = () => {
  return (
    <AppProvider>
      <div>
        <DataDashboard />
        <FormComponent />
        <UserList />
      </div>
    </AppProvider>
  );
};

export default App;