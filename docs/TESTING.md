# Testing Documentation

## 1. Testing Strategy Overview

### 1.1 Testing Levels
- Unit Testing
- Integration Testing
- End-to-End Testing
- Performance Testing
- Security Testing

### 1.2 Testing Tools
- Jest (Frontend Unit Testing)
- Django Test Framework (Backend Unit Testing)
- Cypress (E2E Testing)
- Postman (API Testing)
- SonarQube (Code Quality)

## 2. Unit Testing

### 2.1 Frontend Unit Tests

#### Task Component Tests
```typescript
describe('Task Component', () => {
  it('should render task title correctly', () => {
    const task = { id: 1, title: 'Test Task', status: 'pending' };
    const { getByText } = render(<Task task={task} />);
    expect(getByText('Test Task')).toBeInTheDocument();
  });

  it('should handle task status change', () => {
    const task = { id: 1, title: 'Test Task', status: 'pending' };
    const onStatusChange = jest.fn();
    const { getByTestId } = render(
      <Task task={task} onStatusChange={onStatusChange} />
    );
    fireEvent.click(getByTestId('status-button'));
    expect(onStatusChange).toHaveBeenCalledWith(1, 'completed');
  });
});
```

#### Time Tracking Tests
```typescript
describe('TimeTracker', () => {
  it('should start time tracking', () => {
    const { getByTestId } = render(<TimeTracker />);
    fireEvent.click(getByTestId('start-button'));
    expect(getByTestId('timer')).toHaveTextContent('00:00:01');
  });

  it('should pause time tracking', () => {
    const { getByTestId } = render(<TimeTracker />);
    fireEvent.click(getByTestId('start-button'));
    fireEvent.click(getByTestId('pause-button'));
    expect(getByTestId('timer')).toHaveTextContent('00:00:00');
  });
});
```

### 2.2 Backend Unit Tests

#### Task Service Tests
```python
class TaskServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.task_service = TaskService()

    def test_create_task(self):
        task_data = {
            'title': 'Test Task',
            'description': 'Test Description',
            'status': 'pending'
        }
        task = self.task_service.create_task(self.user, task_data)
        self.assertEqual(task.title, 'Test Task')
        self.assertEqual(task.status, 'pending')

    def test_update_task(self):
        task = Task.objects.create(
            user=self.user,
            title='Original Title',
            status='pending'
        )
        updated_data = {'title': 'Updated Title'}
        updated_task = self.task_service.update_task(task.id, updated_data)
        self.assertEqual(updated_task.title, 'Updated Title')
```

#### Time Session Tests
```python
class TimeSessionTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.task = Task.objects.create(
            user=self.user,
            title='Test Task'
        )

    def test_create_time_session(self):
        session = TimeSession.objects.create(
            task=self.task,
            user=self.user,
            start_time=timezone.now()
        )
        self.assertIsNotNone(session.id)
        self.assertIsNone(session.end_time)

    def test_complete_time_session(self):
        session = TimeSession.objects.create(
            task=self.task,
            user=self.user,
            start_time=timezone.now()
        )
        session.complete()
        self.assertIsNotNone(session.end_time)
        self.assertIsNotNone(session.duration)
```

## 3. Integration Testing

### 3.1 API Integration Tests

#### Task API Tests
```python
class TaskAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_task(self):
        data = {
            'title': 'Test Task',
            'description': 'Test Description',
            'status': 'pending'
        }
        response = self.client.post('/api/tasks/', data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Task.objects.count(), 1)

    def test_get_tasks(self):
        Task.objects.create(
            user=self.user,
            title='Test Task',
            status='pending'
        )
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
```

### 3.2 Database Integration Tests

#### Tag Integration Tests
```python
class TagIntegrationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.task = Task.objects.create(
            user=self.user,
            title='Test Task'
        )

    def test_tag_task_relationship(self):
        tag = Tag.objects.create(
            user=self.user,
            name='Test Tag',
            color='#FF0000'
        )
        self.task.tags.add(tag)
        self.assertEqual(self.task.tags.count(), 1)
        self.assertEqual(tag.tasks.count(), 1)
```

## 4. End-to-End Testing

### 4.1 User Flow Tests

#### Task Creation Flow
```javascript
describe('Task Creation Flow', () => {
  it('should create a new task', () => {
    cy.visit('/tasks');
    cy.get('[data-testid="new-task-button"]').click();
    cy.get('[data-testid="task-title"]').type('New Task');
    cy.get('[data-testid="task-description"]').type('Task Description');
    cy.get('[data-testid="save-task"]').click();
    cy.get('[data-testid="task-list"]').should('contain', 'New Task');
  });
});
```

#### Time Tracking Flow
```javascript
describe('Time Tracking Flow', () => {
  it('should track time for a task', () => {
    cy.visit('/tasks');
    cy.get('[data-testid="task-item"]').first().click();
    cy.get('[data-testid="start-tracking"]').click();
    cy.wait(2000);
    cy.get('[data-testid="stop-tracking"]').click();
    cy.get('[data-testid="time-sessions"]').should('contain', '00:00:02');
  });
});
```

## 5. Performance Testing

### 5.1 Load Testing

#### API Performance Tests
```python
class APIPerformanceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_task_list_performance(self):
        # Create 1000 tasks
        for i in range(1000):
            Task.objects.create(
                user=self.user,
                title=f'Task {i}',
                status='pending'
            )
        
        start_time = time.time()
        response = self.client.get('/api/tasks/')
        end_time = time.time()
        
        self.assertEqual(response.status_code, 200)
        self.assertLess(end_time - start_time, 1.0)  # Should respond within 1 second
```

### 5.2 Mobile App Performance

#### React Native Performance Tests
```javascript
describe('App Performance', () => {
  it('should render task list efficiently', () => {
    const tasks = Array(100).fill().map((_, i) => ({
      id: i,
      title: `Task ${i}`,
      status: 'pending'
    }));

    const startTime = performance.now();
    render(<TaskList tasks={tasks} />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100); // Should render within 100ms
  });
});
```

## 6. Security Testing

### 6.1 Authentication Tests

#### JWT Authentication Tests
```python
class JWTAuthenticationTests(TestCase):
    def test_token_validation(self):
        user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        token = get_tokens_for_user(user)
        
        # Test valid token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token["access"]}')
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 200)
        
        # Test invalid token
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 401)
```

### 6.2 Authorization Tests

#### Permission Tests
```python
class PermissionTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            password='pass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            password='pass123'
        )
        self.task = Task.objects.create(
            user=self.user1,
            title='Test Task'
        )

    def test_task_access_permission(self):
        # Test owner access
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(f'/api/tasks/{self.task.id}/')
        self.assertEqual(response.status_code, 200)
        
        # Test non-owner access
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(f'/api/tasks/{self.task.id}/')
        self.assertEqual(response.status_code, 403)
```

## 7. Test Coverage

### 7.1 Coverage Requirements
- Unit Tests: > 80% coverage
- Integration Tests: > 70% coverage
- E2E Tests: Critical user flows
- Security Tests: All authentication and authorization flows

### 7.2 Coverage Reports
```bash
# Generate coverage report for backend
coverage run manage.py test
coverage report

# Generate coverage report for frontend
npm run test -- --coverage
```

## 8. Continuous Integration

### 8.1 GitHub Actions Workflow
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.x'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          
      - name: Run backend tests
        run: |
          python manage.py test
          
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20.x'
          
      - name: Install frontend dependencies
        run: |
          cd frontend
          npm install
          
      - name: Run frontend tests
        run: |
          cd frontend
          npm test
```

## 9. Test Environment

### 9.1 Environment Setup
- Python 3.x
- Node.js 20.x
- PostgreSQL 14
- Redis (for caching)
- Expo CLI

### 9.2 Test Data
- Test database with sample data
- Mock API responses
- Test user accounts
- Sample tasks and time sessions 