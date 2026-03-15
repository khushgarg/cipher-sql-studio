const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');
require('dotenv').config();

const assignments = [
  // ════════════════════════════════════════════════════════════════════
  // EASY — assignment_1 (Employees / Departments)
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Find All Employees in Sales Department',
    description: 'Write a query to retrieve all employees who work in the Sales department. Return their name, department, salary, and hire_date.',
    difficulty: 'easy',
    postgresSchema: 'assignment_1',
    tables: ['employees', 'departments'],
    expectedColumns: ['name', 'department', 'salary', 'hire_date'],
    solutionQuery: "SELECT name, department, salary, hire_date FROM employees WHERE department = 'Sales'",
    hints: ['Use WHERE to filter by department', 'The department column stores text values like Sales'],
    tags: ['top-100', 'top-50', 'top-20']
  },
  {
    title: 'Sort Employees by Salary',
    description: 'List all employees ordered by salary from highest to lowest. Return name and salary.',
    difficulty: 'easy',
    postgresSchema: 'assignment_1',
    tables: ['employees'],
    expectedColumns: ['name', 'salary'],
    solutionQuery: 'SELECT name, salary FROM employees ORDER BY salary DESC',
    hints: ['Use ORDER BY to sort results', 'DESC keyword sorts in descending order'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'Count Employees Per Department',
    description: 'Write a query to count the number of employees in each department.',
    difficulty: 'easy',
    postgresSchema: 'assignment_1',
    tables: ['employees'],
    expectedColumns: ['department', 'count'],
    solutionQuery: 'SELECT department, COUNT(*) as count FROM employees GROUP BY department',
    hints: ['GROUP BY groups rows by a column', 'COUNT(*) counts rows in each group'],
    tags: ['top-100', 'top-50', 'top-20']
  },
  {
    title: 'Find Highest Salary',
    description: 'Find the employee with the highest salary. Return their name and salary.',
    difficulty: 'easy',
    postgresSchema: 'assignment_1',
    tables: ['employees'],
    expectedColumns: ['name', 'salary'],
    solutionQuery: 'SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 1',
    hints: ['ORDER BY salary DESC puts highest first', 'LIMIT 1 takes only the top result'],
    tags: ['top-100']
  },

  // ════════════════════════════════════════════════════════════════════
  // EASY — assignment_2 (Products / Categories)
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Find Products Over $50',
    description: 'Find all products with a price greater than $50. Show the product name and price.',
    difficulty: 'easy',
    postgresSchema: 'assignment_2',
    tables: ['products', 'categories'],
    expectedColumns: ['name', 'price'],
    solutionQuery: 'SELECT name, price FROM products WHERE price > 50',
    hints: ['Use WHERE with a comparison operator', 'The price column is numeric'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'List Products by Stock Level',
    description: 'List all products ordered by stock from lowest to highest. Show name and stock.',
    difficulty: 'easy',
    postgresSchema: 'assignment_2',
    tables: ['products'],
    expectedColumns: ['name', 'stock'],
    solutionQuery: 'SELECT name, stock FROM products ORDER BY stock ASC',
    hints: ['Use ORDER BY to sort', 'ASC sorts ascending (lowest first)'],
    tags: ['top-100']
  },

  // ════════════════════════════════════════════════════════════════════
  // EASY — school
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Find Honor Roll Students',
    description: 'Find all students with a GPA of 3.5 or higher. Show their name and gpa.',
    difficulty: 'easy',
    postgresSchema: 'school',
    tables: ['students'],
    expectedColumns: ['name', 'gpa'],
    solutionQuery: 'SELECT name, gpa FROM students WHERE gpa >= 3.5',
    hints: ['Use WHERE with >= operator', 'GPA is stored as a decimal number'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'List All Courses and Their Credits',
    description: 'Show all available courses with their name and credits, sorted by credits descending.',
    difficulty: 'easy',
    postgresSchema: 'school',
    tables: ['courses'],
    expectedColumns: ['name', 'credits'],
    solutionQuery: 'SELECT name, credits FROM courses ORDER BY credits DESC',
    hints: ['Simple SELECT with ORDER BY', 'DESC sorts highest first'],
    tags: ['top-100']
  },

  // ════════════════════════════════════════════════════════════════════
  // EASY — hospital
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Find Senior Patients',
    description: 'Find all patients aged 50 or older. Show their name, age, and blood type.',
    difficulty: 'easy',
    postgresSchema: 'hospital',
    tables: ['patients'],
    expectedColumns: ['name', 'age', 'blood_type'],
    solutionQuery: 'SELECT name, age, blood_type FROM patients WHERE age >= 50',
    hints: ['Use WHERE to filter by age', 'The >= operator means greater than or equal to'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'List Doctors by Experience',
    description: 'List all doctors sorted by years of practice, most experienced first. Show name, specialty, and years_practice.',
    difficulty: 'easy',
    postgresSchema: 'hospital',
    tables: ['doctors'],
    expectedColumns: ['name', 'specialty', 'years_practice'],
    solutionQuery: 'SELECT name, specialty, years_practice FROM doctors ORDER BY years_practice DESC',
    hints: ['ORDER BY the years_practice column', 'DESC for most experienced first'],
    tags: ['top-100']
  },

  // ════════════════════════════════════════════════════════════════════
  // EASY — library
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Find Fiction Books',
    description: 'Find all books in the Fiction genre. Show title, author, and published_year.',
    difficulty: 'easy',
    postgresSchema: 'library',
    tables: ['books'],
    expectedColumns: ['title', 'author', 'published_year'],
    solutionQuery: "SELECT title, author, published_year FROM books WHERE genre = 'Fiction'",
    hints: ['Use WHERE to filter by genre', "Values are case-sensitive: use 'Fiction'"],
    tags: ['top-100']
  },
  {
    title: 'Count Books Per Genre',
    description: 'Count how many books are in each genre.',
    difficulty: 'easy',
    postgresSchema: 'library',
    tables: ['books'],
    expectedColumns: ['genre', 'count'],
    solutionQuery: 'SELECT genre, COUNT(*) as count FROM books GROUP BY genre',
    hints: ['Use GROUP BY genre', 'COUNT(*) counts rows per group'],
    tags: ['top-100', 'top-50']
  },

  // ════════════════════════════════════════════════════════════════════
  // EASY — ecommerce
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Find Top-Rated Products',
    description: 'Find products with a rating of 4.5 or higher. Show name, category, and rating.',
    difficulty: 'easy',
    postgresSchema: 'ecommerce',
    tables: ['products'],
    expectedColumns: ['name', 'category', 'rating'],
    solutionQuery: 'SELECT name, category, rating FROM products WHERE rating >= 4.5',
    hints: ['Use WHERE rating >= 4.5', 'Rating is stored as a decimal'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'Find Users From USA',
    description: 'List all users from the USA. Show their username and signup_date.',
    difficulty: 'easy',
    postgresSchema: 'ecommerce',
    tables: ['users'],
    expectedColumns: ['username', 'signup_date'],
    solutionQuery: "SELECT username, signup_date FROM users WHERE country = 'USA'",
    hints: ['Use WHERE to filter by country', "Country values are like 'USA', 'UK', etc."],
    tags: ['top-100']
  },

  // ════════════════════════════════════════════════════════════════════
  // MEDIUM — assignment_3 (Customers / Orders)
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Find Customers with Multiple Orders',
    description: 'Find customers who placed more than one order. Show name and order count.',
    difficulty: 'medium',
    postgresSchema: 'assignment_3',
    tables: ['customers', 'orders'],
    expectedColumns: ['name', 'order_count'],
    solutionQuery: "SELECT c.name, COUNT(o.id) as order_count FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name HAVING COUNT(o.id) > 1",
    hints: ['JOIN customers and orders tables', 'Use GROUP BY and HAVING to filter groups'],
    tags: ['top-100', 'top-50', 'top-20']
  },
  {
    title: 'Calculate Total Revenue Per Customer',
    description: 'Calculate the total amount spent by each customer. Return name and total_revenue.',
    difficulty: 'medium',
    postgresSchema: 'assignment_3',
    tables: ['customers', 'orders'],
    expectedColumns: ['name', 'total_revenue'],
    solutionQuery: 'SELECT c.name, SUM(o.total) as total_revenue FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name',
    hints: ['JOIN customers and orders', 'Use SUM() with GROUP BY'],
    tags: ['top-100']
  },

  // ════════════════════════════════════════════════════════════════════
  // MEDIUM — school
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Students and Their Courses',
    description: 'List each student with the courses they are enrolled in. Show student name, course name, and grade.',
    difficulty: 'medium',
    postgresSchema: 'school',
    tables: ['students', 'courses', 'enrollments'],
    expectedColumns: ['student_name', 'course_name', 'grade'],
    solutionQuery: 'SELECT s.name as student_name, c.name as course_name, e.grade FROM students s JOIN enrollments e ON s.id = e.student_id JOIN courses c ON c.id = e.course_id',
    hints: ['You need to JOIN three tables', 'students → enrollments → courses'],
    tags: ['top-100', 'top-50', 'top-20']
  },
  {
    title: 'Average GPA Per Grade Level',
    description: 'Calculate the average GPA for each grade level. Show grade_level and avg_gpa.',
    difficulty: 'medium',
    postgresSchema: 'school',
    tables: ['students'],
    expectedColumns: ['grade_level', 'avg_gpa'],
    solutionQuery: 'SELECT grade_level, ROUND(AVG(gpa), 2) as avg_gpa FROM students GROUP BY grade_level ORDER BY grade_level',
    hints: ['Use AVG() aggregate function', 'GROUP BY grade_level and use ROUND for cleaner output'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'Most Popular Courses',
    description: 'Find courses with more than 2 enrolled students. Show course name and enrollment_count.',
    difficulty: 'medium',
    postgresSchema: 'school',
    tables: ['courses', 'enrollments'],
    expectedColumns: ['course_name', 'enrollment_count'],
    solutionQuery: 'SELECT c.name as course_name, COUNT(e.id) as enrollment_count FROM courses c JOIN enrollments e ON c.id = e.course_id GROUP BY c.name HAVING COUNT(e.id) > 2',
    hints: ['JOIN courses and enrollments', 'Use HAVING to filter after GROUP BY'],
    tags: ['top-100']
  },

  // ════════════════════════════════════════════════════════════════════
  // MEDIUM — hospital
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Patients and Their Doctors',
    description: 'List each appointment showing the patient name, doctor name, and diagnosis.',
    difficulty: 'medium',
    postgresSchema: 'hospital',
    tables: ['patients', 'doctors', 'appointments'],
    expectedColumns: ['patient_name', 'doctor_name', 'diagnosis'],
    solutionQuery: 'SELECT p.name as patient_name, d.name as doctor_name, a.diagnosis FROM appointments a JOIN patients p ON p.id = a.patient_id JOIN doctors d ON d.id = a.doctor_id',
    hints: ['JOIN three tables: appointments, patients, doctors', 'Use aliases for clarity'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'Count Appointments Per Doctor',
    description: 'Count how many appointments each doctor has had. Show doctor name and appointment_count.',
    difficulty: 'medium',
    postgresSchema: 'hospital',
    tables: ['doctors', 'appointments'],
    expectedColumns: ['doctor_name', 'appointment_count'],
    solutionQuery: 'SELECT d.name as doctor_name, COUNT(a.id) as appointment_count FROM doctors d JOIN appointments a ON d.id = a.doctor_id GROUP BY d.name ORDER BY appointment_count DESC',
    hints: ['JOIN doctors and appointments', 'COUNT and GROUP BY doctor name'],
    tags: ['top-100', 'top-50']
  },

  // ════════════════════════════════════════════════════════════════════
  // MEDIUM — library
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Most Active Readers',
    description: 'Find members who have borrowed more than 2 books. Show name and books_borrowed.',
    difficulty: 'medium',
    postgresSchema: 'library',
    tables: ['members', 'loans'],
    expectedColumns: ['name', 'books_borrowed'],
    solutionQuery: 'SELECT m.name, COUNT(l.id) as books_borrowed FROM members m JOIN loans l ON m.id = l.member_id GROUP BY m.name HAVING COUNT(l.id) > 2',
    hints: ['JOIN members and loans', 'Use HAVING after GROUP BY to filter'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'Overdue Books',
    description: 'Find all loans that have not been returned. Show the book title, member name, and loan_date.',
    difficulty: 'medium',
    postgresSchema: 'library',
    tables: ['books', 'members', 'loans'],
    expectedColumns: ['title', 'name', 'loan_date'],
    solutionQuery: 'SELECT b.title, m.name, l.loan_date FROM loans l JOIN books b ON b.id = l.book_id JOIN members m ON m.id = l.member_id WHERE l.returned = FALSE',
    hints: ['Filter with WHERE returned = FALSE', 'JOIN three tables: loans, books, members'],
    tags: ['top-100', 'top-50', 'top-20']
  },

  // ════════════════════════════════════════════════════════════════════
  // MEDIUM — ecommerce
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Average Rating Per Product',
    description: 'Calculate the average user review rating for each product. Show product name and avg_rating.',
    difficulty: 'medium',
    postgresSchema: 'ecommerce',
    tables: ['products', 'reviews'],
    expectedColumns: ['name', 'avg_rating'],
    solutionQuery: 'SELECT p.name, ROUND(AVG(r.rating), 1) as avg_rating FROM products p JOIN reviews r ON p.id = r.product_id GROUP BY p.name ORDER BY avg_rating DESC',
    hints: ['JOIN products and reviews', 'Use AVG() with GROUP BY, ROUND for clean output'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'Best-Selling Categories',
    description: 'Find the total sales for each product category. Show category and total_sales.',
    difficulty: 'medium',
    postgresSchema: 'ecommerce',
    tables: ['products'],
    expectedColumns: ['category', 'total_sales'],
    solutionQuery: 'SELECT category, SUM(total_sales) as total_sales FROM products GROUP BY category ORDER BY total_sales DESC',
    hints: ['Use SUM() aggregate on total_sales', 'GROUP BY category'],
    tags: ['top-100']
  },

  // ════════════════════════════════════════════════════════════════════
  // HARD — assignment_3
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Find Orders with Multiple Items',
    description: 'Find orders that contain more than one item. Show order_id, customer name, and item count.',
    difficulty: 'hard',
    postgresSchema: 'assignment_3',
    tables: ['customers', 'orders', 'order_items'],
    expectedColumns: ['order_id', 'customer_name', 'item_count'],
    solutionQuery: 'SELECT o.id as order_id, c.name as customer_name, COUNT(oi.id) as item_count FROM orders o JOIN customers c ON c.id = o.customer_id JOIN order_items oi ON oi.order_id = o.id GROUP BY o.id, c.name HAVING COUNT(oi.id) > 1',
    hints: ['Join three tables', 'GROUP BY with HAVING to filter order groups'],
    tags: ['top-100']
  },

  // ════════════════════════════════════════════════════════════════════
  // HARD — school
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Rank Students by GPA',
    description: 'Rank all students by GPA within their grade level using a window function. Show name, grade_level, gpa, and rank.',
    difficulty: 'hard',
    postgresSchema: 'school',
    tables: ['students'],
    expectedColumns: ['name', 'grade_level', 'gpa', 'rank'],
    solutionQuery: 'SELECT name, grade_level, gpa, RANK() OVER (PARTITION BY grade_level ORDER BY gpa DESC) as rank FROM students',
    hints: ['Use RANK() window function', 'PARTITION BY grade_level creates separate rankings per grade'],
    tags: ['top-100', 'top-50', 'top-20']
  },
  {
    title: 'Teachers with Most A-Grade Students',
    description: 'Find teachers whose courses have the most students with grade A or A-. Show teacher name and a_count.',
    difficulty: 'hard',
    postgresSchema: 'school',
    tables: ['teachers', 'courses', 'enrollments'],
    expectedColumns: ['teacher_name', 'a_count'],
    solutionQuery: "SELECT t.name as teacher_name, COUNT(e.id) as a_count FROM teachers t JOIN courses c ON t.id = c.teacher_id JOIN enrollments e ON c.id = e.course_id WHERE e.grade IN ('A', 'A-') GROUP BY t.name ORDER BY a_count DESC",
    hints: ['Join teachers → courses → enrollments', "Filter with WHERE grade IN ('A', 'A-')"],
    tags: ['top-100', 'top-50']
  },

  // ════════════════════════════════════════════════════════════════════
  // HARD — hospital
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Patients with Most Prescriptions',
    description: 'Find patients who have received the most total prescriptions. Show patient name and prescription_count.',
    difficulty: 'hard',
    postgresSchema: 'hospital',
    tables: ['patients', 'appointments', 'prescriptions'],
    expectedColumns: ['patient_name', 'prescription_count'],
    solutionQuery: 'SELECT p.name as patient_name, COUNT(pr.id) as prescription_count FROM patients p JOIN appointments a ON p.id = a.patient_id JOIN prescriptions pr ON a.id = pr.appointment_id GROUP BY p.name ORDER BY prescription_count DESC',
    hints: ['Join patients → appointments → prescriptions', 'COUNT prescriptions and GROUP BY patient'],
    tags: ['top-100', 'top-50', 'top-20']
  },
  {
    title: 'Doctor Workload with CASE',
    description: 'Classify each doctor as "Light" (<=2 appointments), "Moderate" (3-4), or "Heavy" (5+). Show name and workload.',
    difficulty: 'hard',
    postgresSchema: 'hospital',
    tables: ['doctors', 'appointments'],
    expectedColumns: ['doctor_name', 'workload'],
    solutionQuery: "SELECT d.name as doctor_name, CASE WHEN COUNT(a.id) <= 2 THEN 'Light' WHEN COUNT(a.id) <= 4 THEN 'Moderate' ELSE 'Heavy' END as workload FROM doctors d LEFT JOIN appointments a ON d.id = a.doctor_id GROUP BY d.name",
    hints: ['Use CASE WHEN for conditional labels', 'LEFT JOIN to include doctors with 0 appointments'],
    tags: ['top-100', 'top-50']
  },

  // ════════════════════════════════════════════════════════════════════
  // HARD — library
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Book Popularity Ranking',
    description: 'Rank books by total number of loans using a window function. Show title, loan_count, and rank.',
    difficulty: 'hard',
    postgresSchema: 'library',
    tables: ['books', 'loans'],
    expectedColumns: ['title', 'loan_count', 'rank'],
    solutionQuery: 'SELECT b.title, COUNT(l.id) as loan_count, RANK() OVER (ORDER BY COUNT(l.id) DESC) as rank FROM books b LEFT JOIN loans l ON b.id = l.book_id GROUP BY b.title',
    hints: ['Use RANK() OVER (ORDER BY count DESC)', 'LEFT JOIN so books with 0 loans still appear'],
    tags: ['top-100', 'top-20']
  },

  // ════════════════════════════════════════════════════════════════════
  // HARD — ecommerce
  // ════════════════════════════════════════════════════════════════════
  {
    title: 'Top Reviewers with Product Details',
    description: 'Find users who have written 2+ reviews. Show username, review_count, and their avg_rating given.',
    difficulty: 'hard',
    postgresSchema: 'ecommerce',
    tables: ['users', 'reviews'],
    expectedColumns: ['username', 'review_count', 'avg_rating'],
    solutionQuery: 'SELECT u.username, COUNT(r.id) as review_count, ROUND(AVG(r.rating), 1) as avg_rating FROM users u JOIN reviews r ON u.id = r.user_id GROUP BY u.username HAVING COUNT(r.id) >= 2 ORDER BY review_count DESC',
    hints: ['JOIN users and reviews', 'HAVING COUNT >= 2 filters after grouping'],
    tags: ['top-100', 'top-50']
  },
  {
    title: 'Products on Wishlists but Never Reviewed',
    description: 'Find products that appear on wishlists but have never been reviewed. Show product name and wishlist_count.',
    difficulty: 'hard',
    postgresSchema: 'ecommerce',
    tables: ['products', 'wishlists', 'reviews'],
    expectedColumns: ['name', 'wishlist_count'],
    solutionQuery: 'SELECT p.name, COUNT(w.id) as wishlist_count FROM products p JOIN wishlists w ON p.id = w.product_id LEFT JOIN reviews r ON p.id = r.product_id WHERE r.id IS NULL GROUP BY p.name',
    hints: ['Use LEFT JOIN on reviews to find products without reviews', 'WHERE r.id IS NULL filters to only non-reviewed products'],
    tags: ['top-100', 'top-50', 'top-20']
  },
  {
    title: 'Revenue Contribution by Product',
    description: 'Calculate each product\'s percentage contribution to total revenue (price × total_sales). Show name and revenue_pct.',
    difficulty: 'hard',
    postgresSchema: 'ecommerce',
    tables: ['products'],
    expectedColumns: ['name', 'revenue_pct'],
    solutionQuery: "SELECT name, ROUND((price * total_sales) * 100.0 / SUM(price * total_sales) OVER (), 1) as revenue_pct FROM products ORDER BY revenue_pct DESC",
    hints: ['SUM() OVER () computes the total across all rows', 'Multiply price × total_sales for revenue per product'],
    tags: ['top-100', 'top-20']
  }
];

const seedAssignments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersql');
    console.log('Connected to MongoDB');

    await Assignment.deleteMany({});
    console.log('Cleared existing assignments');

    await Assignment.insertMany(assignments);
    console.log(`Seeded ${assignments.length} assignments successfully!`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
    process.exit(1);
  }
};

seedAssignments();
