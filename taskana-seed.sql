INSERT INTO users(
    first_name,
    last_name,
    email,
    password,
    emp_role,
    is_admin
  )
VALUES (
    'Marcellus',
    'Muhammad',
    'marcellustm@yahoo.com',
    '$2b$13$QuJ01WBg5wXScGM/8nu4He6LREmTVghX13Q8kpH717jnP3wXdUB0G',
    'Software Engineer',
    TRUE
  ),
  (
    'Robert',
    'Smith',
    'robert.smith@example.com',
    '$2b$13$fx8yDka0Mb6p/g1DqpsM3.PSvvq0PuCvkGTSa1qnijqRkx6/.VIRe',
    'Software Engineer',
    TRUE
  ),
  (
    'Peggy',
    'Hamilton',
    'peggy.hamilton@example.com',
    '$2b$13$vdEsVhgOvwjqKiNTuEGTSuSZ8PpEy/IaxnFZIQFAUqTli8iGJOBIm',
    'Web Designer',
    FALSE
  ),
  (
    'Lois',
    'Morrison',
    'lois.morrison@example.com',
    '$2b$13$Yi87hvXiwWW2b41Jk35W..r2GVd3Y6mLipqZSOMw9aPj5wWZOjvve',
    'Quality Assurance',
    FALSE
  ),
  (
    'Christian',
    'Fowler',
    'chris.fowler@example.com',
    '$2b$13$OXG086/TZipQKccZmiHus.RC4xBuLxAgWHkAwwI7fZ/rF/aTH4Wgi',
    'Backend Developer',
    FALSE
  ),
  (
    'Renee',
    'Ferguson',
    'renee.ferg@example.com',
    '$2b$13$OZSxvX83kjilvDMTV7j8deJGic6IakurMJ4VOwqwXO8YYBaMZQa0G',
    'Mobile Developer',
    FALSE
  ),
  (
    'Albert',
    'Barrett',
    'albert.barrett@example.com',
    '$2b$13$.5pfRRfuwfSajExGaazTDO5KHeZq6dgrjhfu68bwnYw/CNBaIJCVK',
    'UI/UX Developer',
    FALSE
  ),
  (
    'Test',
    'User',
    'test.user@example.com',
    '$2b$13$BK1csGRlXdx/n8KoBRjt5umDKEcSObEI6R1vVeAyS9sKx5PRLtlte',
    'UI/UX Developer',
    FALSE
  );

INSERT INTO projects (name, description, date, deadline, manager, status)
VALUES (
    'Homestew',
    'A recipe webiste template that allows users to search, share, and print recipes. Includes diet information, blog posts, recipe categories and wine recommendations. Built with React.js client, React Router, Axios, Bootstrap, and Sass. The site utilizes Spoonacular API for recipe information, nutrition analysis, and wine recommendations.',
    '09-17-2022',
    '10-11-2022',
    101,
    'Closed'
  ),
 (
    'Taskana',
    'Full stack project management/bug tracker application. The back-end server uses Node.js + Express for REST API, front-end side is a React.js client with React Router, Axios & Bootstrap. Allows users to manage and track project progess, assign tickets to users for each project or bug issue, and monitor their own submitted tasks or to-do list.',
    '10-28-2022',
    '12-11-2022',
    100,
    'In Progress'
  );

INSERT INTO tasks (title, description, important, status, created_by) 
 VALUES 
 ('Send email to teacher', 'Schedule meeting before PTA night!', true, 'Complete', 107),
 ('Call Mom', 'Give mom a call back.', false, 'Open', 107),
 ('Renew gym membership', 'Change card on file and memebership level.', false, 'Complete', 107),
 ('Contact potential new client', 'Respond to Robert''s email for potential new client', true, 'Open', 107);

 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Brand Logo', 'Design main logo and develop main ui color pallete icons.','Complete', 1, 101, 106, '09-19-2022'),
('Alt Brand Logo', 'Design alt logo for responsive screens.','Complete', 1, 101, 102, '09-19-2022'),
('Footer Logo', 'Design logo for site footer.','Complete', 1, 101, 102, '09-19-2022'),
('Typography', 'Meet with client and decide on site typography and font combinations.','Complete', 1, 101, 106, '09-19-2022'),
('Brand Images', 'Meet with client and decide on site stock images.','Complete', 1, 101, 102, '09-20-2022'),
('API', 'Gather and store API Keys and endpoints for recipe information.','Complete', 1, 101, 104, '09-20-2022'),
('Wireframe', 'Design user flows and wireframe site; Meet with client.','Complete', 1, 101, 106, '09-20-2022'),
('Topbar and Footer', 'Design responsive topbar, navigation, and footer components.','Complete', 1, 101, 100, '09-21-2022'),
('Topbar and Footer Tests', 'Code tests for topbar, navigation, and footer components.','Complete', 1, 101, 100, '09-21-2022'),
('Header', 'Design header with "featured recipes" section component.','Complete', 1, 101, 100, '09-22-2022'),
('Header Tests', 'Code tests for header and "featured recipes" section component.','Complete', 1, 101, 100, '09-22-2022'),
('Latest Recipes', 'Design "latest recipes" section component.','Complete', 1, 101, 102, '09-23-2022'),
('Latest Recipes Tests', 'Code tests for "latest recipes" section component.','Complete', 1, 101, 102, '09-23-2022'),
('Icon bar', 'Design icon bar component with recipe types.','Complete', 1, 101, 102, '09-24-2022'),
('Icon bar Tests', 'Code tests for icon bar component.','Complete', 1, 101, 102, '09-24-2022'),
('Recipe Type page', 'Design recipe "type" page and link to icons in icon bar.','Complete', 1, 101, 100, '09-25-2022'),
('Recipe Type page functionality', 'Implemement recipe type search in component using API. Utilize cuisine component to return search items.','Complete', 1, 101, 100, '09-25-2022'),
('Recipe Type page Tests', 'Test recipe "type" page and api search functionality.','Complete', 1, 101, 100, '09-25-2022'),
('Cuisines', 'Design cuisine component to be re-used across site for recipe search and home page.','Complete', 1, 101, 100, '09-26-2022'),
('Cuisines Tests', 'Code tests for cuisine component.','Complete', 1, 101, 100, '09-26-2022'),
('Recipe Category page', 'Design recipe "category" page and merge to links on home page.','Complete', 1, 101, 102, '09-27-2022'),
('Recipe Category page functionality', 'Implement recipe "category" page and api search functionality. Utilize cuisine component to return search items.','Complete', 1, 101, 102, '09-27-2022'),
('Recipe Category page Tests', 'Test recipe "category" page functionality.','Complete', 1, 101, 102, '09-27-2022'),
('Scroll to top btn', 'Design scroll-to-top component to be used across site.','Complete', 1, 101, 102, '09-27-2022'),
('Scroll to top btn test', 'Code test for scroll-to-top component.','Complete', 1, 101, 102, '09-27-2022'),
('Scroll to top btn test', 'Code test for scroll-to-top component.','Complete', 1, 101, 102, '09-27-2022'),
('Homepage Review', 'Review all links for recipes, navigation, search, and scroll to top. Ensure responsiveness and styling.','Complete', 1, 101, 103, '09-27-2022');

 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('About Section', 'Code "What we are about" heading component with responsive images.','Complete', 1, 101, 100, '09-28-2022'),
 ('About Section Tests', 'Test "What we are about" heading component.','Complete', 1, 101, 100, '09-28-2022'),
  ('About Culinary Section', 'Code "Culinary bullet points" component with responsive image.','Complete', 1, 101, 100, '09-29-2022'),
  ('About Culinary Section Test', 'Test "Culinary bullet points" component.','Complete', 1, 101, 100, '09-29-2022'),
  ('About Testimonial Section', 'Code responsive Testimonials component on about page.','Complete', 1, 101, 102, '09-30-2022'),
  ('About Testimonial Section Tests', 'Test responsive Testimonials component.','Complete', 1, 101, 102, '09-30-2022'),
  ('About Page Review', 'Review all links for search, navigation, and scroll to top. Ensure responsiveness and styling.','Complete', 1, 101, 103, '09-30-2022');
 
 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Recipe Page', 'Design recipe search bar, heading and btn.','Complete', 1, 101, 100, '10-01-2022'),
  ('Recipe Page functionality', 'Implement API search functionality for recipe search and utilize cuisine component for search results.','Complete', 1, 101, 100, '10-01-2022'),
  ('Recipe Page Tests', 'Test recipe search page.','Complete', 1, 101, 100, '10-01-2022'),
  ('Single Recipe Page', 'Design responsive single recipe page with api return info for recipe and wine recommendations.','Complete', 1, 101, 102, '10-02-2022'),
  ('Single Recipe Page Test', 'Test single recipe page component.','Complete', 1, 101, 102, '10-02-2022'),
  ('Loading btn', 'Design loading spinner btn component.','Complete', 1, 101, 102, '10-02-2022'),
  ('Loading btn test', 'Test loading spinner btn component.','Complete', 1, 101, 102, '10-02-2022'),
  ('Recipe Page Review', 'Review recipe search functionality and return info. Ensure responsiveness and styling.','Complete', 1, 101, 103, '10-02-2022');

 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Diets Page', 'Design responsive "special diets" page with diet components and info from API.','Complete', 1, 101, 100, '10-03-2022'),
  ('Diets Page Tests', 'Test diet page components.','Complete', 1, 101, 100, '10-03-2022'),
  ('Diets Page Review', 'Review diets page. Ensure responsiveness and styling.','Complete', 1, 101, 103, '10-03-2022');

 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Blog Page', 'Design responsive "latest posts" heading and subscribe bar.','Complete', 1, 101, 100, '10-04-2022'),
  ('Blog Page Tests', 'Test "latest posts" heading and subscribe bar.','Complete', 1, 101, 100, '10-04-2022'),
  ('Blog Page Extended', 'Design responsive "featured posts" blog section with responsive posts.','Complete', 1, 101, 102, '10-05-2022'),
  ('Blog Page Extended Test', 'Test "featured posts" blog section.','Complete', 1, 101, 102, '10-05-2022'),
  ('Blog Page Review', 'Review blog page. Ensure responsiveness and styling.','Complete', 1, 101, 103, '10-05-2022');

 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Contact Page', 'Design responsive contact card component with responsive image.','Complete', 1, 101, 100, '10-06-2022'),
  ('Contact Page Tests', 'Test contact component and page.','Complete', 1, 101, 100, '10-06-2022'),
  ('Contact Page Review', 'Review contact page. Ensure responsiveness and styling.','Complete', 1, 101, 103, '10-06-2022'),
  ('Homestew Review', 'Review homestew to ensure consistency.','Complete', 1, 101, 103, '10-07-2022'),
  ('Homestew Deploy', 'Deploy Homestew.','Complete', 1, 101, 101, '10-08-2022');

 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Taskana Schema', 'Design database schema for Taskana users, projects, tasks, and tickets.','Complete', 2, 100, 104, '10-28-2022'),
 ('Taskana Seed file', 'Create a seed file for initial data in db for front end.','Complete', 2, 100, 104, '10-28-2022'),
 ('Server Config', 'Code initial express server configuration.','Complete', 2, 100, 101, '10-29-2022'),
 ('Test Server Config', 'Write tests for app and db configuration.','Complete', 2, 100, 101, '10-29-2022'),
 ('Environment variables', 'Add .env file with configuration variables for server.','Complete', 2, 100, 100, '10-29-2022'),
 ('Express Error', 'Add an ExpressError class to add individual instance of errors.','Complete', 2, 100, 100, '10-29-2022');

 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Test Common for models', 'Write initial tests for all model test files. Insert test data into db.','Complete', 2, 100, 100, '10-30-2022'),
 ('User model', 'Code user model class with static functions for CRUD and refresh token actions.','Complete', 2, 100, 104, '10-30-2022'),
 ('Test User model', 'Write tests for user model class static functions and error handling.','Complete', 2, 100, 104, '10-30-2022'),
 ('Sql Helper function', 'Write a function to update data to sql format for PATCH actions.','Complete', 2, 100, 101, '11-01-2022'),
 ('Test Sql Helper function', 'Write tests for sql helper function.','Complete', 2, 100, 101, '11-01-2022'),
 ('Project model', 'Code project model class with static functions for CRUD actions.','Complete', 2, 100, 100, '11-02-2022'),
 ('Test Project model', 'Write tests for project model class static functions and error handling.','Complete', 2, 100, 100, '11-02-2022'),
 ('Date Helper function', 'Write a function to return current date for tests.','Complete', 2, 100, 101, '11-02-2022'),
 ('Test Date Helper function', 'Write tests for date helper function.','Complete', 2, 100, 101, '11-02-2022'),
 ('Task model', 'Code task model class with static functions for CRUD actions.','Complete', 2, 100, 104, '11-03-2022'),
 ('Test Task model', 'Write tests for task model class static functions and error handling.','Complete', 2, 100, 104, '11-03-2022'),
 ('Ticket model', 'Code ticket model class with static functions for CRUD actions.','Complete', 2, 100, 100, '11-03-2022'),
 ('Test Ticket model', 'Write tests for ticket model class static functions and error handling.','Complete', 2, 100, 104, '11-03-2022');

 
 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Middleware functions', 'Code middleware functions to ensure a user is logged in, admin, or have a JWT, and/or the correct user.','Complete', 2, 100, 100, '11-04-2022'),
 ('Test Middleware functions', 'Write tests for middleware functions.','Complete', 2, 100, 100, '11-04-2022'),
 ('User new schema', 'Develop JSON schema for new users.','Complete', 2, 100, 101, '11-05-2022'),
 ('User login schema', 'Develop JSON schema for new users to login.','Complete', 2, 100, 101, '11-05-2022'),
 ('User register schema', 'Develop JSON schema for new users to register.','Complete', 2, 100, 104, '11-06-2022'),
 ('User update schema', 'Develop JSON schema for new users to update.','Complete', 2, 100, 104, '11-06-2022'),
 ('Token new schema', 'Develop JSON schema for new JWT.','Complete', 2, 100, 104, '11-07-2022'),
 ('Project new schema', 'Develop JSON schema for a new project.','Complete', 2, 100, 100, '11-07-2022'),
 ('Project update schema', 'Develop JSON schema to update a new project.','Complete', 2, 100, 100, '11-07-2022'),
 ('Task new schema', 'Develop JSON schema for a new task.','Complete', 2, 100, 101, '11-08-2022'),
 ('Task update schema', 'Develop JSON schema to update a new task.','Complete', 2, 100, 101, '11-08-2022'),
 ('Ticket new schema', 'Develop JSON schema for a new ticket.','Complete', 2, 100, 104, '11-09-2022'),
 ('Ticket update schema', 'Develop JSON schema to update a new ticket.','Complete', 2, 100, 104, '11-09-2022');


 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Token Helper functions', 'Write functions to create JWT and refresh tokens.','Complete', 2, 100, 100, '11-10-2022'),
 ('Test Token Helper function', 'Write tests for token helper function.','Complete', 2, 100, 100, '11-10-2022'),
 ('Test Common for routes', 'Write initial tests for all routes test files. Insert test data into db.','Complete', 2, 100, 100, '11-11-2022'),
 ('Auth routes', 'Code views for users to login, register, logout, and refresh tokens.','Complete', 2, 100, 101, '11-11-2022'),
 ('Test Auth routes', 'Write tests for auth routes.','Complete', 2, 100, 101, '11-11-2022'),
 ('User routes', 'Code views for user CRUD actions.','Complete', 2, 100, 104, '11-12-2022'),
 ('Test User routes', 'Write tests for user routes.','Complete', 2, 100, 104, '11-12-2022'),
 ('Project routes', 'Code views for project CRUD actions.','Complete', 2, 100, 100, '11-13-2022'),
 ('Test Project routes', 'Write tests for project routes.','Complete', 2, 100, 100, '11-13-2022'),
 ('Task routes', 'Code views for task CRUD actions.','Complete', 2, 100, 101, '11-14-2022'),
 ('Test Task routes', 'Write tests for task routes.','Complete', 2, 100, 101, '11-14-2022'),
 ('Ticket routes', 'Code views for ticket CRUD actions.','Complete', 2, 100, 104, '11-14-2022'),
 ('Test Ticket routes', 'Write tests for ticket routes.','Complete', 2, 100, 104, '11-14-2022');
 

 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Initial Config', 'Code initial configuration and ENV variables for Taskana client.','Complete', 2, 100, 100, '11-14-2022'),
 ('Brand Logo light', 'Design main logo for light mode.','Complete', 2, 100, 106, '11-14-2022'),
 ('Brand Logo dark', 'Design main logo for dark mode.','Complete', 2, 100, 106, '11-14-2022'),
 ('Alt Logo', 'Design responsive logo for light/dar mode.','Complete', 2, 100, 106, '11-14-2022'),
 ('Typography and UI Palette', 'Develop ui color palette for light/dark mode and determine a font combination for typography.','Complete', 2, 100, 106, '11-15-2022'),
 ('Wireframe', 'Design user flows and wireframe site; Meet with client.','Complete', 2, 100, 106, '11-15-2022');

 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Breadcrumb component', 'Code breadcrumb component for top of page navigations.','Complete', 2, 100, 100, '11-15-2022'),
 ('Test Breadcrumb component', 'Write tests for breadcrumb component.','Complete', 2, 100, 100, '11-15-2022'),
 ('CreateBtn component', 'Code CreateBtn component for creation of data.','Complete', 2, 100, 101, '11-15-2022'),
 ('Test CreateBtn component', 'Write tests for CreateBtn component.','Complete', 2, 100, 101, '11-15-2022'),
 ('ErrorMsg component', 'Code ErrorMsg component to show errors when posting data.','Complete', 2, 100, 102, '11-16-2022'),
 ('Test ErrorMsg component', 'Write tests for ErrorMsg component.','Complete', 2, 100, 102, '11-16-2022'),
 ('SuccessMsg component', 'Code SuccessMsg component to show success when posting data.','Complete', 2, 100, 102, '11-16-2022'),
 ('Test SuccessMsg component', 'Write tests for SuccessMsg component.','Complete', 2, 100, 102, '11-16-2022'),
 ('SuccessMsg component', 'Code SuccessMsg component to show success when posting data.','Complete', 2, 100, 100, '11-17-2022'),
 ('Test SuccessMsg component', 'Write tests for SuccessMsg component.','Complete', 2, 100, 100, '11-17-2022'),
 ('HomeBox component', 'Code HomeBox component to show data on db data on homepage.','Complete', 2, 100, 101, '11-17-2022'),
 ('Test HomeBox component', 'Write tests for HomeBox component.','Complete', 2, 100, 101, '11-17-2022'),
 ('Sidebar component', 'Code Sidebar component to show full site navigation with light/dark mode.','Complete', 2, 100, 102, '11-18-2022'),
 ('Test Sidebar component', 'Write tests for Sidebar component.','Complete', 2, 100, 102, '11-18-2022'),
 ('Spinner component', 'Code Spinner component to show loading spinner when databale is loading.','Complete', 2, 100, 100, '11-18-2022'),
 ('Test Spinner component', 'Write tests for Spinner component.','Complete', 2, 100, 100, '11-18-2022');


 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Homepage Component', 'Code component to show dashboard page.','Complete', 2, 100, 100, '11-19-2022'),
 ('Test Homepage Component', 'Write tests for homepage component.','Complete', 2, 100, 100, '11-19-2022'),
 ('HomeBox Component', 'Code component to show db data on dashboard page.','Complete', 2, 100, 100, '11-19-2022'),
 ('Test HomeBox Component', 'Write tests for homebox component.','Complete', 2, 100, 100, '11-19-2022'),
 ('UserTable Component', 'Code component to show users datatable on dashboard page.','Complete', 2, 100, 101, '11-20-2022'),
 ('Test UserTable Component', 'Write tests for userTable component.','Complete', 2, 100, 101, '11-20-2022'),
 ('ProjectTable Component', 'Code component to show projects datatable on dashboard page.','Complete', 2, 100, 101, '11-20-2022'),
 ('Test ProjectTable Component', 'Write tests for projectTable component.','Complete', 2, 100, 101, '11-20-2022'),
 ('Create user modal', 'Code modal to create a new user.','Complete', 2, 100, 102, '11-21-2022'),
 ('Test Create user modal', 'Write tests for modal to create a new user.','Complete', 2, 100, 102, '11-21-2022'),
 ('Edit user modal', 'Code modal to edit a new user.','Complete', 2, 100, 102, '11-21-2022'),
 ('Test Edit user modal', 'Write tests for modal to edit a new user.','Complete', 2, 100, 102, '11-21-2022'),
 ('Delete user modal', 'Code modal to delete a new user.','Complete', 2, 100, 100, '11-22-2022'),
 ('Test Delete user modal', 'Write tests for modal to delete a new user.','Complete', 2, 100, 100, '11-22-2022'),
 ('Home Page Review', 'Review home page. Ensure responsiveness and styling.','Complete', 2, 101, 103, '11-23-2022');


 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Login Component', 'Code component to show login page and form.','Complete', 2, 100, 100, '11-24-2022'),
 ('Test Login Component', 'Write tests for login component.','Complete', 2, 100, 100, '11-24-2022'),
 ('Register Component', 'Code component to show register page and form for new users.','Complete', 2, 100, 101, '11-24-2022'),
 ('Test Register Component', 'Write tests for register component.','Complete', 2, 100, 101, '11-24-2022'),
 ('Login Page Review', 'Review login page. Ensure responsiveness and styling.','Complete', 2, 101, 103, '11-25-2022'),
 ('Register Page Review', 'Review register page. Ensure responsiveness and styling.','Complete', 2, 101, 103, '11-25-2022');


 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Project Component', 'Code component to show project page.','Complete', 2, 100, 100, '11-26-2022'),
 ('Test Project Component', 'Write tests for project component.','Complete', 2, 100, 100, '11-26-2022'),
 ('ProjectCard Component', 'Code component to show individual project datatable.','Complete', 2, 100, 101, '11-26-2022'),
 ('Test ProjectCard Component', 'Write tests for projectCard component.','Complete', 2, 100, 101, '11-26-2022'),
 ('Create project modal', 'Code modal to create a new project.','Complete', 2, 100, 102, '11-27-2022'),
 ('Test Create project modal', 'Write tests for modal to create a new project.','Complete', 2, 100, 102, '11-27-2022'),
 ('Edit project modal', 'Code modal to edit a new project.','Complete', 2, 100, 102, '11-27-2022'),
 ('Test Edit project modal', 'Write tests for modal to edit a new project.','Complete', 2, 100, 102, '11-27-2022'),
 ('Delete project modal', 'Code modal to delete a new project.','Complete', 2, 100, 100, '11-28-2022'),
 ('Test Delete project modal', 'Write tests for modal to delete a new project.','Complete', 2, 100, 100, '11-28-2022'),
 ('Project Page Review', 'Review project page. Ensure responsiveness and styling.','Complete', 2, 101, 103, '11-29-2022');


 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Task Component', 'Code component to show task page.','Complete', 2, 100, 100, '11-30-2022'),
 ('Test Task Component', 'Write tests for task component.','Complete', 2, 100, 100, '11-30-2022'),
 ('TaskItem Component', 'Code component to show individual task in datatable.','Complete', 2, 100, 101, '11-30-2022'),
 ('Test TaskItem Component', 'Write tests for taskItem component.','Complete', 2, 100, 101, '11-30-2022'),
 ('FilterInput Component', 'Code component to show search bar to filter tasks.','Complete', 2, 100, 102, '12-01-2022'),
 ('Test FilterInput Component', 'Write tests for filter input component.','Complete', 2, 100, 102, '12-01-2022'),
 ('FilterBtn Component', 'Code component to show individual boxes for filtered tasks.','Complete', 2, 100, 100, '12-01-2022'),
 ('Test FilterBtn Component', 'Write tests for filter btn component.','Complete', 2, 100, 100, '12-01-2022'),
 ('Create task modal', 'Code modal to create a new task.','Complete', 2, 100, 102, '12-02-2022'),
 ('Test Create task modal', 'Write tests for modal to create a new task.','Complete', 2, 100, 102, '12-02-2022'),
 ('Edit task modal', 'Code modal to edit a new task.','Complete', 2, 100, 102, '12-02-2022'),
 ('Test Edit task modal', 'Write tests for modal to edit a new task.','Complete', 2, 100, 102, '12-02-2022'),
 ('Delete task modal', 'Code modal to delete a new task.','Complete', 2, 100, 100, '12-03-2022'),
 ('Test Delete task modal', 'Write tests for modal to delete a new task.','Complete', 2, 100, 100, '12-03-2022'),
 ('Task Page Review', 'Review task page. Ensure responsiveness and styling.','Complete', 2, 101, 103, '12-04-2022');


 INSERT INTO tickets (title, description, status, project_id, created_by, assigned_to, date) 
 VALUES ('Ticket Component', 'Code component to show ticket page.','Complete', 2, 100, 100, '12-05-2022'),
 ('Test Ticket Component', 'Write tests for task component.','Complete', 2, 100, 100, '12-05-2022'),
 ('TicketTable Component', 'Code component to show individual tickets in datatable.','Complete', 2, 100, 101, '12-05-2022'),
 ('Test TicketTable Component', 'Write tests for ticket table component.','Complete', 2, 100, 101, '12-05-2022'),
 ('TicketBox Component', 'Code component to show search results from filtered tickets.','Complete', 2, 100, 102, '12-06-2022'),
 ('Test TicketBox Component', 'Write tests for ticket box component.','Complete', 2, 100, 102, '12-06-2022'),
 ('Create ticket modal', 'Code modal to create a new ticket.','Complete', 2, 100, 102, '12-06-2022'),
 ('Test Create ticket modal', 'Write tests for modal to create a new ticket.','Complete', 2, 100, 102, '12-06-2022'),
 ('Edit ticket modal', 'Code modal to edit a new ticket.','Complete', 2, 100, 102, '12-07-2022'),
 ('Test Edit ticket modal', 'Write tests for modal to edit a new ticket.','Complete', 2, 100, 102, '12-07-2022'),
 ('Delete ticket modal', 'Code modal to delete a new ticket.','Complete', 2, 100, 100, '12-07-2022'),
 ('Test Delete ticket modal', 'Write tests for modal to delete a new ticket.','Complete', 2, 100, 100, '12-07-2022'),
 ('Ticket Page Review', 'Review ticket page. Ensure responsiveness and styling.','Complete', 2, 101, 103, '12-08-2022'),
 ('Taskana Review', 'Review taskana to ensure consistency.','Open', 2, 101, 103, '12-08-2022'),
 ('Taskana Deploy', 'Deploy Taskana.','Open', 2, 101, 101, '12-09-2022');





 