//======================================================================
// SEVERE NO_HARDCODE VIOLATIONS - JSX/React
// การฝังค่าคงที่ใน JSX Components, Props และ Inline Styles
//======================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// VIOLATION 1: API Endpoints และ Configuration Hardcoded ใน Components
const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // CRITICAL: Hardcoded API endpoints ใน component
  const API_BASE_URL = "https://api.production-app.com/v2";
  const API_KEY = "sk_live_4eC39HqLyjWDarjtT1zdp7dc8f9e2b3c";
  const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // CRITICAL: Hardcoded URL และ headers
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': AUTH_TOKEN,
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 30000, // CRITICAL: Hardcoded timeout
        maxRetries: 3   // CRITICAL: Hardcoded retry count
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>
      {loading ? <div>Loading...</div> : <UserList users={users} />}
    </div>
  );
};

// VIOLATION 2: Hardcoded Styles และ CSS Values ใน JSX
const StyledComponents = () => {
  // CRITICAL: Hardcoded style objects
  const headerStyle = {
    backgroundColor: '#1a365d',
    color: '#ffffff',
    padding: '24px 32px',
    fontSize: '28px',
    fontWeight: '700',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '32px'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  };

  const buttonPrimaryStyle = {
    backgroundColor: '#3182ce',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  };

  const buttonDangerStyle = {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    marginLeft: '8px'
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Application Header</h1>
      </header>
      
      {/* CRITICAL: Inline styles with hardcoded values */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        marginTop: '32px'
      }}>
        <div style={{
          backgroundColor: '#f7fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          minHeight: '200px'
        }}>
          <h3 style={{ color: '#2d3748', marginBottom: '16px' }}>Card 1</h3>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>Card content here</p>
          <button style={buttonPrimaryStyle}>Action</button>
          <button style={buttonDangerStyle}>Delete</button>
        </div>
      </div>
    </div>
  );
};

// VIOLATION 3: Business Logic Constants Hardcoded
const PaymentComponent = () => {
  // CRITICAL: Payment configuration hardcoded
  const STRIPE_PUBLISHABLE_KEY = "pk_live_51H7z2cSIc7r4cq9s8X9Y7Z6A5B4C3D2E1F0";
  const PAYMENT_GATEWAY_URL = "https://api.stripe.com/v1/payment_intents";
  
  // CRITICAL: Business rules hardcoded
  const SUBSCRIPTION_PLANS = {
    basic: { price: 9.99, currency: 'USD', features: ['Feature 1', 'Feature 2'] },
    premium: { price: 19.99, currency: 'USD', features: ['All Basic', 'Feature 3', 'Feature 4'] },
    enterprise: { price: 49.99, currency: 'USD', features: ['All Premium', 'Advanced Support'] }
  };

  const TAX_RATES = {
    'US': 0.08,
    'CA': 0.13,
    'GB': 0.20,
    'DE': 0.19,
    'FR': 0.20
  };

  const DISCOUNT_CODES = {
    'WELCOME20': { discount: 0.20, maxUses: 1000, expires: '2024-12-31' },
    'STUDENT50': { discount: 0.50, maxUses: 500, expires: '2024-06-30' },
    'EARLYBIRD': { discount: 0.15, maxUses: 2000, expires: '2024-03-31' }
  };

  const calculateTotal = (planType, country, discountCode) => {
    const plan = SUBSCRIPTION_PLANS[planType];
    if (!plan) return 0;

    let total = plan.price;
    
    // Apply tax
    const taxRate = TAX_RATES[country] || 0;
    total += total * taxRate;
    
    // Apply discount
    if (discountCode && DISCOUNT_CODES[discountCode]) {
      const discount = DISCOUNT_CODES[discountCode].discount;
      total -= total * discount;
    }

    return total.toFixed(2);
  };

  return (
    <div className="payment-component">
      <h2>Choose Your Plan</h2>
      {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
        <div key={key} style={{
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          margin: '16px 0',
          backgroundColor: key === 'premium' ? '#f0fff4' : '#ffffff'
        }}>
          <h3 style={{ 
            color: '#1a202c', 
            fontSize: '24px', 
            marginBottom: '12px',
            textTransform: 'capitalize'
          }}>
            {key} Plan
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#38a169',
            marginBottom: '16px'
          }}>
            ${plan.price}/month
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {plan.features.map((feature, index) => (
              <li key={index} style={{
                padding: '8px 0',
                borderBottom: '1px solid #edf2f7',
                color: '#4a5568'
              }}>
                ✓ {feature}
              </li>
            ))}
          </ul>
          <button style={{
            backgroundColor: '#38a169',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '20px',
            width: '100%',
            cursor: 'pointer'
          }}>
            Select {key} Plan
          </button>
        </div>
      ))}
    </div>
  );
};

// VIOLATION 4: Database และ Environment Configuration
const DatabaseConfig = () => {
  // CRITICAL: Database credentials hardcoded
  const DB_CONFIG = {
    host: 'prod-mysql-cluster.us-east-1.amazonaws.com',
    port: 3306,
    database: 'production_ecommerce_db',
    username: 'app_prod_user',
    password: 'Pr0d_MySQL_P@ssw0rd_2024!',
    ssl: true,
    connectionLimit: 100,
    acquireTimeout: 60000,
    timeout: 60000
  };

  const REDIS_CONFIG = {
    host: 'prod-redis-cluster.cache.amazonaws.com',
    port: 6379,
    password: 'redis_prod_password_2024',
    db: 0,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100
  };

  // CRITICAL: External service credentials
  const EXTERNAL_SERVICES = {
    sendgrid: {
      apiKey: 'SG.x1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9',
      fromEmail: 'noreply@myapp.com',
      templateIds: {
        welcome: 'd-f43dacc50e344c4f99f652de265215aa',
        reset: 'd-13937b0e0f1a47d0afc29c87506de334'
      }
    },
    aws: {
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      region: 'us-east-1',
      s3Bucket: 'prod-app-uploads-bucket'
    },
    analytics: {
      googleAnalyticsId: 'UA-123456789-1',
      mixpanelToken: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
      hotjarId: '1234567'
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>System Configuration</h2>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h3>Database Configuration</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(DB_CONFIG, null, 2)}
        </pre>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h3>Redis Configuration</h3>
        <pre style={{ fontSize: '12px' }}>
          {JSON.stringify(REDIS_CONFIG, null, 2)}
        </pre>
      </div>

      <div style={{
        backgroundColor: '#d1ecf1',
        border: '1px solid #bee5eb',
        borderRadius: '4px',
        padding: '16px'
      }}>
        <h3>External Services</h3>
        <pre style={{ fontSize: '12px' }}>
          {JSON.stringify(EXTERNAL_SERVICES, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// VIOLATION 5: Component Props และ Default Values Hardcoded
const UserInterface = () => {
  // CRITICAL: UI configuration hardcoded
  const THEME_COLORS = {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40'
  };

  const BREAKPOINTS = {
    xs: '0px',
    sm: '576px', 
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px'
  };

  const ANIMATION_DURATIONS = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  };

  return (
    <div>
      {/* CRITICAL: Hardcoded component props */}
      <Header 
        title="My Application"
        subtitle="Production Dashboard v2.1.0"
        logoUrl="https://cdn.myapp.com/logo-v2.png"
        backgroundColor={THEME_COLORS.primary}
        height="80px"
        showSearch={true}
        maxWidth="1200px"
      />
      
      <Navigation 
        items={[
          { label: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
          { label: 'Users', url: '/users', icon: 'people', badge: 12 },
          { label: 'Analytics', url: '/analytics', icon: 'chart', roles: ['admin'] },
          { label: 'Settings', url: '/settings', icon: 'settings' }
        ]}
        orientation="horizontal"
        activeColor={THEME_COLORS.primary}
        hoverColor={THEME_COLORS.secondary}
        fontSize="14px"
        padding="12px 20px"
      />

      <Content 
        maxWidth="1200px"
        padding="40px 20px"
        backgroundColor="#ffffff"
        minHeight="calc(100vh - 160px)"
        borderRadius="8px"
        boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      />

      <Footer 
        copyright="© 2024 My Application. All rights reserved."
        links={[
          { label: 'Privacy Policy', url: '/privacy' },
          { label: 'Terms of Service', url: '/terms' },
          { label: 'Contact Us', url: '/contact' }
        ]}
        backgroundColor={THEME_COLORS.dark}
        textColor={THEME_COLORS.light}
        fontSize="12px"
        padding="20px 0"
      />
    </div>
  );
};

// Mock components for demonstration
const Header = (props) => <header style={{...props}}>Header Component</header>;
const Navigation = (props) => <nav>Navigation Component</nav>;  
const Content = (props) => <main style={{...props}}>Content Component</main>;
const Footer = (props) => <footer style={{...props}}>Footer Component</footer>;
const UserList = ({ users }) => <div>User List Component</div>;