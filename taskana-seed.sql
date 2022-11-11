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
  );

INSERT INTO projects (name, description, deadline, manager)
VALUES (
    'Homestew',
    'A webiste template that allows users to search, share, and print recipes. Front-end side is a React.js client with React Router, Axios & Bootstrap. The site utilizes Spoonacular API for recipe information, nutrition analysis, and wine recommendations.',
    '12-11-2022',
    101
  ),
 (
    'Taskana',
    'Full stack project management/bug tracker application. The back-end server uses Node.js + Express for REST API, front-end side is a React.js client with React Router, Axios & Bootstrap. Allows users to manage and track project progess, assign tickets to users for each project or bug issue, and monitor their own submitted tasks or to-do list.',
    '12-31-2022',
    100
  );

INSERT INTO tasks (title, description, important, created_by) 
 VALUES 
 ('Send email to Alieah''s teacher', 'Schedule meeting before PTA night!', true, 100),
 ('Call Mom', 'Give mom a call back.', false, 100),
 ('Renew gym membership', 'Change card on file and memebership level.', false, 100),
 ('Contact potential new client', 'Respond to Robert''s email for potential new client', true, 100);

 INSERT INTO tickets (title, description, project_id, created_by, assigned_to) 
 VALUES ('Brand Logo', 'Design main logo and develop main ui color pallete icons.', 1, 101, 106),
('Alt Brand Logo', 'Design alt logo for responsive screens.', 1, 101, 102),
('Footer Logo', 'Design logo for site footer.', 1, 101, 102),
('Typography', 'Meet with client and decide on site typography and font combinations.', 1, 101, 106),
('Brand Images', 'Meet with client and decide on site stock images.', 1, 101, 102),
('API', 'Gather and store API Keys and endpoints for recipe information.', 1, 101, 104),
('Wireframe', 'Design user flows and wireframe site; Meet with client.', 1, 101, 106),
('Topbar and Footer', 'Design responsive topbar, navigation, and footer components.', 1, 101, 100),
('Topbar and Footer Tests', 'Code tests for topbar, navigation, and footer components.', 1, 101, 100),
('Header', 'Design header with "featured recipes" section component.', 1, 101, 100),
('Header Tests', 'Code tests for header and "featured recipes" section component.', 1, 101, 100),
('Latest Recipes', 'Design "latest recipes" section component.', 1, 101, 102),
('Latest Recipes Tests', 'Code tests for "latest recipes" section component.', 1, 101, 102),
('Icon bar', 'Design icon bar component with recipe types.', 1, 101, 102),
('Icon bar Tests', 'Code tests for icon bar component.', 1, 101, 102),
('Recipe Type page', 'Design recipe "type" page and link to icons in icon bar.', 1, 101, 100),
('Recipe Type page functionality', 'Implemement recipe type search in component using API. Utilize cuisine component to return search items.', 1, 101, 100),
('Recipe Type page Tests', 'Test recipe "type" page and api search functionality.', 1, 101, 100),
('Cuisines', 'Design cuisine component to be re-used across site for recipe search and home page.', 1, 101, 100),
('Cuisines Tests', 'Code tests for cuisine component.', 1, 101, 100),
('Recipe Category page', 'Design recipe "category" page and merge to links on home page.', 1, 101, 102),
('Recipe Category page functionality', 'Implement recipe "category" page and api search functionality. Utilize cuisine component to return search items.', 1, 101, 102),
('Recipe Category page Tests', 'Test recipe "category" page functionality.', 1, 101, 102),
('Scroll to top btn', 'Design scroll-to-top component to be used across site.', 1, 101, 102),
('Scroll to top btn test', 'Code test for scroll-to-top component.', 1, 101, 102),
('Scroll to top btn test', 'Code test for scroll-to-top component.', 1, 101, 102),
('Homepage Review', 'Review all links for recipes, navigation, search, and scroll to top. Ensure responsiveness and styling.', 1, 101, 103);

 INSERT INTO tickets (title, description, project_id, created_by, assigned_to) 
 VALUES ('About Section', 'Code "What we are about" heading component with responsive images.', 1, 101, 100),
 ('About Section Tests', 'Test "What we are about" heading component.', 1, 101, 100),
  ('About Culinary Section', 'Code "Culinary bullet points" component with responsive image.', 1, 101, 100),
  ('About Culinary Section Test', 'Test "Culinary bullet points" component.', 1, 101, 100),
  ('About Testimonial Section', 'Code responsive Testimonials component on about page.', 1, 101, 102),
  ('About Testimonial Section Tests', 'Test responsive Testimonials component.', 1, 101, 102),
  ('About Page Review', 'Review all links for search, navigation, and scroll to top. Ensure responsiveness and styling.', 1, 101, 103);
 
 INSERT INTO tickets (title, description, project_id, created_by, assigned_to) 
 VALUES ('Recipe Page', 'Design recipe search bar, heading and btn.', 1, 101, 100),
  ('Recipe Page functionality', 'Implement API search functionality for recipe search and utilize cuisine component for search results.', 1, 101, 100),
  ('Recipe Page Tests', 'Test recipe search page.', 1, 101, 100),
  ('Single Recipe Page', 'Design responsive single recipe page with api return info for recipe and wine recommendations.', 1, 101, 102),
  ('Single Recipe Page Test', 'Test single recipe page component.', 1, 101, 102),
  ('Loading btn', 'Design loading spinner btn component.', 1, 101, 102),
  ('Loading btn test', 'Test loading spinner btn component.', 1, 101, 102),
  ('Recipe Page Review', 'Review recipe search functionality and return info. Ensure responsiveness and styling.', 1, 101, 103);

 INSERT INTO tickets (title, description, project_id, created_by, assigned_to) 
 VALUES ('Diets Page', 'Design responsive "special diets" page with diet components and info from API.', 1, 101, 100),
  ('Diets Page Tests', 'Test diet page components.', 1, 101, 100),
  ('Diets Page Review', 'Review diets page. Ensure responsiveness and styling.', 1, 101, 103);

 INSERT INTO tickets (title, description, project_id, created_by, assigned_to) 
 VALUES ('Blog Page', 'Design responsive "latest posts" heading and subscribe bar.', 1, 101, 100),
  ('Blog Page Tests', 'Test "latest posts" heading and subscribe bar.', 1, 101, 100),
  ('Blog Page Extended', 'Design responsive "featured posts" blog section with responsive posts.', 1, 101, 102),
  ('Blog Page Extended Test', 'Test "featured posts" blog section.', 1, 101, 102),
  ('Blog Page Review', 'Review blog page. Ensure responsiveness and styling.', 1, 101, 103);

 INSERT INTO tickets (title, description, project_id, created_by, assigned_to) 
 VALUES ('Contact Page', 'Design responsive contact card component with responsive image.', 1, 101, 100),
  ('Contact Page Tests', 'Test contact component and page.', 1, 101, 100),
  ('Contact Page Review', 'Review contact page. Ensure responsiveness and styling.', 1, 101, 103),
  ('Homestew Review', 'Review homestew to ensure consistency.', 1, 101, 103),
  ('Homestew Deploy', 'Deploy Homestew.', 1, 101, 101);




 