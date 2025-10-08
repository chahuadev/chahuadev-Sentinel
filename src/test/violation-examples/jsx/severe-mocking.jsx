//======================================================================
// SEVERE NO_MOCKING VIOLATIONS - JSX/React
// การสร้าง Mock Components และ Testing Library Violations ใน JSX
//======================================================================

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import sinon from 'sinon';

// VIOLATION 1: Mock React Components with jest.mock()
// CRITICAL: Mocking entire component modules
jest.mock('../components/UserProfile', () => {
  return function MockUserProfile({ userId, onEdit }) {
    return (
      <div data-testid="mock-user-profile">
        <span>Mock User: {userId}</span>
        <button onClick={() => onEdit('mocked')}>Edit Mock</button>
      </div>
    );
  };
});

jest.mock('../hooks/useUserData', () => ({
  useUserData: jest.fn(() => ({
    user: { id: 'mock123', name: 'Mock User', email: 'mock@test.com' },
    loading: false,
    error: null,
    refetch: jest.fn()
  }))
}));

// VIOLATION 2: Sinon Stubs for React Hooks and Context
const MockReactContext = React.createContext(null);

const ContextProvider = ({ children, mockValue }) => {
  // CRITICAL: Sinon stub replacing real context provider
  const stubbedValue = sinon.stub().returns(mockValue || {
    user: { authenticated: true, role: 'admin' },
    permissions: ['read', 'write', 'delete'],
    logout: sinon.stub().resolves(true)
  });

  return (
    <MockReactContext.Provider value={stubbedValue()}>
      {children}
    </MockReactContext.Provider>
  );
};

// VIOLATION 3: React Testing Library with Extensive Mocking
const MockedUserDashboard = () => {
  // CRITICAL: Mock implementations of real React hooks
  const mockUseEffect = jest.fn();
  const mockUseState = jest.fn(() => [null, jest.fn()]);
  const mockUseContext = jest.fn(() => ({
    currentUser: { id: 'test123', name: 'Test User' },
    isLoading: false
  }));

  React.useEffect = mockUseEffect;
  React.useState = mockUseState;
  React.useContext = mockUseContext;

  return (
    <div data-testid="mocked-dashboard">
      <h1>Mocked User Dashboard</h1>
      <UserProfile userId="mocked-id" />
      <UserSettings onSave={jest.fn()} />
      <NotificationPanel notifications={[]} />
    </div>
  );
};

// VIOLATION 4: Component Prop Mocking and Injection
const TestWrapper = ({ children, mockProps = {} }) => {
  // CRITICAL: Automatic prop mocking for all child components
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const mockedProps = {
        ...child.props,
        // Inject mock functions for all function props
        ...Object.fromEntries(
          Object.entries(child.props)
            .filter(([key, value]) => typeof value === 'function')
            .map(([key]) => [key, jest.fn().mockName(`mock_${key}`)])
        ),
        // Override with explicit mocks
        ...mockProps
      };

      return React.cloneElement(child, mockedProps);
    }
    return child;
  });

  return <div data-testid="mock-wrapper">{enhancedChildren}</div>;
};

// VIOLATION 5: Mock Service Dependencies in Components
const UserService = {
  // CRITICAL: Mocked service methods
  getUserById: sinon.stub().resolves({
    id: 'mock123',
    name: 'Mock User',
    email: 'mock@example.com'
  }),
  updateUser: sinon.stub().resolves({ success: true }),
  deleteUser: sinon.stub().resolves({ deleted: true }),
  searchUsers: sinon.stub().resolves([])
};

const ApiClient = {
  // CRITICAL: Stubbed API calls
  get: sinon.stub().resolves({ data: {} }),
  post: sinon.stub().resolves({ success: true }),
  put: sinon.stub().resolves({ updated: true }),
  delete: sinon.stub().resolves({ deleted: true })
};

// VIOLATION 6: Test Components with Mock Dependencies
const TestUserManagement = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // CRITICAL: Using mocked services in component logic
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await UserService.searchUsers();
      setUsers(response);
    } catch (error) {
      console.error('Mock error:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUserUpdate = async (userId, updates) => {
    // CRITICAL: Mock service call in event handler
    const result = await UserService.updateUser(userId, updates);
    if (result.success) {
      fetchUsers(); // Refresh mocked data
    }
  };

  const handleUserDelete = async (userId) => {
    // CRITICAL: Stubbed delete operation
    const confirmed = window.confirm('Delete user?');
    if (confirmed) {
      await UserService.deleteUser(userId);
      fetchUsers();
    }
  };

  return (
    <div data-testid="user-management">
      <h2>User Management (Mocked)</h2>
      {loading && <div>Loading mocked users...</div>}
      
      <TestWrapper mockProps={{ 
        onEdit: handleUserUpdate,
        onDelete: handleUserDelete 
      }}>
        <UserList users={users} />
        <UserForm onSubmit={jest.fn()} />
        <UserFilters onChange={jest.fn()} />
      </TestWrapper>

      <button 
        onClick={fetchUsers}
        data-testid="fetch-users-btn"
      >
        Fetch Mocked Users
      </button>
    </div>
  );
};

// VIOLATION 7: React Component Testing with Extensive Mocks
describe('UserManagement Component Tests', () => {
  let mockUserService;
  let mockApiClient;

  beforeEach(() => {
    // CRITICAL: Reset and configure mocks before each test
    mockUserService = {
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      searchUsers: jest.fn()
    };

    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };

    // Replace real services with mocks
    Object.assign(UserService, mockUserService);
    Object.assign(ApiClient, mockApiClient);
  });

  test('should render with mocked user data', async () => {
    // CRITICAL: Configure mock responses
    mockUserService.searchUsers.mockResolvedValue([
      { id: '1', name: 'Mock User 1', email: 'user1@mock.com' },
      { id: '2', name: 'Mock User 2', email: 'user2@mock.com' }
    ]);

    render(
      <ContextProvider mockValue={{ user: { role: 'admin' } }}>
        <TestUserManagement />
      </ContextProvider>
    );

    // Test interactions with mocked components
    const fetchButton = screen.getByTestId('fetch-users-btn');
    fireEvent.click(fetchButton);

    // Assertions on mock calls
    expect(mockUserService.searchUsers).toHaveBeenCalledTimes(1);
  });

  test('should handle mocked user interactions', async () => {
    mockUserService.updateUser.mockResolvedValue({ success: true });
    mockUserService.deleteUser.mockResolvedValue({ deleted: true });

    render(<TestUserManagement />);

    // Test mock interactions
    const userProfile = screen.getByTestId('mock-user-profile');
    const editButton = screen.getByText('Edit Mock');
    
    fireEvent.click(editButton);

    // Verify mock calls
    expect(mockUserService.updateUser).toHaveBeenCalledWith('mocked');
  });
});

// Supporting mock components
const UserProfile = jest.fn(({ userId, onEdit }) => (
  <div data-testid="user-profile">User: {userId}</div>
));

const UserSettings = jest.fn(({ onSave }) => (
  <div data-testid="user-settings">
    <button onClick={() => onSave({})}>Save</button>
  </div>
));

const NotificationPanel = jest.fn(({ notifications }) => (
  <div data-testid="notifications">
    {notifications.length} notifications
  </div>
));

const UserList = jest.fn(({ users, onEdit, onDelete }) => (
  <div data-testid="user-list">
    {users.map(user => (
      <div key={user.id}>
        <span>{user.name}</span>
        <button onClick={() => onEdit(user.id)}>Edit</button>
        <button onClick={() => onDelete(user.id)}>Delete</button>
      </div>
    ))}
  </div>
));

const UserForm = jest.fn(({ onSubmit }) => (
  <form onSubmit={onSubmit} data-testid="user-form">
    <input type="text" placeholder="Name" />
    <button type="submit">Create User</button>
  </form>
));

const UserFilters = jest.fn(({ onChange }) => (
  <div data-testid="user-filters">
    <select onChange={onChange}>
      <option value="">All Users</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
));