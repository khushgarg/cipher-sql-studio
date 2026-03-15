const pool = require('../config/postgres');

const seedPostgres = async () => {
  const client = await pool.connect();

  try {
    // ═══════════════════════════════════════════════════════════════════
    // Create all schemas
    // ═══════════════════════════════════════════════════════════════════
    const schemas = [
      'assignment_1', 'assignment_2', 'assignment_3',
      'school', 'hospital', 'library', 'ecommerce'
    ];
    for (const s of schemas) {
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${s}`);
    }

    // ═══════════════════════════════════════════════════════════════════
    // ASSIGNMENT_1 — Employees & Departments
    // ═══════════════════════════════════════════════════════════════════
    await client.query(`
      DROP TABLE IF EXISTS assignment_1.employees CASCADE;
      DROP TABLE IF EXISTS assignment_1.departments CASCADE;

      CREATE TABLE assignment_1.employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        department VARCHAR(50),
        salary NUMERIC(10,2),
        hire_date DATE
      );

      CREATE TABLE assignment_1.departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        manager_id INT
      );

      INSERT INTO assignment_1.employees (name, department, salary, hire_date) VALUES
      ('Alice Johnson', 'Sales', 75000.00, '2020-01-15'),
      ('Bob Smith', 'Engineering', 95000.00, '2019-03-22'),
      ('Carol Williams', 'Sales', 68000.00, '2021-06-10'),
      ('David Brown', 'Engineering', 85000.00, '2018-11-05'),
      ('Eve Davis', 'Marketing', 62000.00, '2022-02-20'),
      ('Frank Miller', 'Sales', 72000.00, '2020-08-14'),
      ('Grace Wilson', 'Engineering', 98000.00, '2017-04-30'),
      ('Henry Taylor', 'Marketing', 65000.00, '2021-09-25');

      INSERT INTO assignment_1.departments (name, manager_id) VALUES
      ('Sales', 1),
      ('Engineering', 2),
      ('Marketing', 5);
    `);

    // ═══════════════════════════════════════════════════════════════════
    // ASSIGNMENT_2 — Products & Categories
    // ═══════════════════════════════════════════════════════════════════
    await client.query(`
      DROP TABLE IF EXISTS assignment_2.products CASCADE;
      DROP TABLE IF EXISTS assignment_2.categories CASCADE;

      CREATE TABLE assignment_2.products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        price NUMERIC(10,2),
        category_id INT,
        stock INT
      );

      CREATE TABLE assignment_2.categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50)
      );

      INSERT INTO assignment_2.categories (name) VALUES
      ('Electronics'), ('Clothing'), ('Books');

      INSERT INTO assignment_2.products (name, price, category_id, stock) VALUES
      ('Laptop', 999.99, 1, 50),
      ('Smartphone', 699.99, 1, 100),
      ('T-Shirt', 29.99, 2, 200),
      ('Jeans', 59.99, 2, 150),
      ('Python Book', 49.99, 3, 75),
      ('JavaScript Guide', 39.99, 3, 60);
    `);

    // ═══════════════════════════════════════════════════════════════════
    // ASSIGNMENT_3 — Customers, Orders, Order Items
    // ═══════════════════════════════════════════════════════════════════
    await client.query(`
      DROP TABLE IF EXISTS assignment_3.order_items CASCADE;
      DROP TABLE IF EXISTS assignment_3.orders CASCADE;
      DROP TABLE IF EXISTS assignment_3.customers CASCADE;

      CREATE TABLE assignment_3.customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        city VARCHAR(50)
      );

      CREATE TABLE assignment_3.orders (
        id SERIAL PRIMARY KEY,
        customer_id INT,
        order_date DATE,
        total NUMERIC(10,2)
      );

      CREATE TABLE assignment_3.order_items (
        id SERIAL PRIMARY KEY,
        order_id INT,
        product_name VARCHAR(100),
        quantity INT,
        price NUMERIC(10,2)
      );

      INSERT INTO assignment_3.customers (name, email, city) VALUES
      ('John Doe', 'john@example.com', 'New York'),
      ('Jane Smith', 'jane@example.com', 'Los Angeles'),
      ('Mike Johnson', 'mike@example.com', 'Chicago'),
      ('Sarah Williams', 'sarah@example.com', 'New York');

      INSERT INTO assignment_3.orders (customer_id, order_date, total) VALUES
      (1, '2024-01-15', 1049.98),
      (1, '2024-02-20', 89.98),
      (2, '2024-01-10', 699.99),
      (3, '2024-03-05', 149.97);

      INSERT INTO assignment_3.order_items (order_id, product_name, quantity, price) VALUES
      (1, 'Laptop', 1, 999.99),
      (1, 'T-Shirt', 1, 29.99),
      (2, 'T-Shirt', 2, 29.99),
      (3, 'Smartphone', 1, 699.99),
      (4, 'Jeans', 2, 59.99),
      (4, 'Python Book', 1, 49.99);
    `);

    // ═══════════════════════════════════════════════════════════════════
    // SCHOOL — Students, Courses, Teachers, Enrollments
    // ═══════════════════════════════════════════════════════════════════
    await client.query(`
      DROP TABLE IF EXISTS school.enrollments CASCADE;
      DROP TABLE IF EXISTS school.courses CASCADE;
      DROP TABLE IF EXISTS school.teachers CASCADE;
      DROP TABLE IF EXISTS school.students CASCADE;

      CREATE TABLE school.students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        grade_level INT,
        gpa NUMERIC(3,2),
        enrollment_date DATE
      );

      CREATE TABLE school.teachers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        subject VARCHAR(50),
        years_experience INT
      );

      CREATE TABLE school.courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        teacher_id INT REFERENCES school.teachers(id),
        credits INT,
        max_capacity INT
      );

      CREATE TABLE school.enrollments (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES school.students(id),
        course_id INT REFERENCES school.courses(id),
        grade VARCHAR(2),
        enrolled_date DATE
      );

      INSERT INTO school.teachers (name, subject, years_experience) VALUES
      ('Dr. Sarah Chen', 'Mathematics', 12),
      ('Prof. James Wilson', 'Computer Science', 8),
      ('Dr. Maria Garcia', 'Physics', 15),
      ('Prof. Alan Turing', 'Computer Science', 20),
      ('Dr. Emily Roberts', 'Mathematics', 6);

      INSERT INTO school.students (name, email, grade_level, gpa, enrollment_date) VALUES
      ('Emma Thompson', 'emma@school.edu', 10, 3.80, '2023-09-01'),
      ('Liam Parker', 'liam@school.edu', 11, 3.45, '2022-09-01'),
      ('Olivia Martinez', 'olivia@school.edu', 10, 3.92, '2023-09-01'),
      ('Noah Kim', 'noah@school.edu', 12, 3.10, '2021-09-01'),
      ('Ava Patel', 'ava@school.edu', 11, 3.65, '2022-09-01'),
      ('Ethan Brown', 'ethan@school.edu', 10, 2.90, '2023-09-01'),
      ('Sophia Lee', 'sophia@school.edu', 12, 3.75, '2021-09-01'),
      ('Mason Davis', 'mason@school.edu', 11, 3.20, '2022-09-01');

      INSERT INTO school.courses (name, teacher_id, credits, max_capacity) VALUES
      ('Calculus I', 1, 4, 30),
      ('Intro to Programming', 2, 3, 35),
      ('Physics 101', 3, 4, 25),
      ('Data Structures', 4, 3, 30),
      ('Linear Algebra', 5, 3, 28),
      ('Advanced Physics', 3, 4, 20);

      INSERT INTO school.enrollments (student_id, course_id, grade, enrolled_date) VALUES
      (1, 1, 'A', '2024-01-15'),
      (1, 2, 'A-', '2024-01-15'),
      (2, 2, 'B+', '2024-01-16'),
      (2, 4, 'B', '2024-01-16'),
      (3, 1, 'A', '2024-01-15'),
      (3, 3, 'A-', '2024-01-15'),
      (4, 4, 'C+', '2024-01-17'),
      (4, 6, 'B-', '2024-01-17'),
      (5, 2, 'A', '2024-01-16'),
      (5, 5, 'B+', '2024-01-16'),
      (6, 1, 'C', '2024-01-15'),
      (6, 3, 'C+', '2024-01-15'),
      (7, 4, 'A-', '2024-01-17'),
      (7, 6, 'A', '2024-01-17'),
      (8, 2, 'B', '2024-01-16'),
      (8, 5, 'B-', '2024-01-16');
    `);

    // ═══════════════════════════════════════════════════════════════════
    // HOSPITAL — Patients, Doctors, Appointments, Prescriptions
    // ═══════════════════════════════════════════════════════════════════
    await client.query(`
      DROP TABLE IF EXISTS hospital.prescriptions CASCADE;
      DROP TABLE IF EXISTS hospital.appointments CASCADE;
      DROP TABLE IF EXISTS hospital.doctors CASCADE;
      DROP TABLE IF EXISTS hospital.patients CASCADE;

      CREATE TABLE hospital.patients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        age INT,
        gender VARCHAR(10),
        blood_type VARCHAR(5),
        admission_date DATE
      );

      CREATE TABLE hospital.doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        specialty VARCHAR(50),
        years_practice INT,
        department VARCHAR(50)
      );

      CREATE TABLE hospital.appointments (
        id SERIAL PRIMARY KEY,
        patient_id INT REFERENCES hospital.patients(id),
        doctor_id INT REFERENCES hospital.doctors(id),
        appointment_date DATE,
        diagnosis VARCHAR(200),
        status VARCHAR(20) DEFAULT 'completed'
      );

      CREATE TABLE hospital.prescriptions (
        id SERIAL PRIMARY KEY,
        appointment_id INT REFERENCES hospital.appointments(id),
        medicine VARCHAR(100),
        dosage VARCHAR(50),
        duration_days INT
      );

      INSERT INTO hospital.doctors (name, specialty, years_practice, department) VALUES
      ('Dr. House', 'Internal Medicine', 20, 'Diagnostics'),
      ('Dr. Grey', 'Surgery', 8, 'General Surgery'),
      ('Dr. Watson', 'General Practice', 15, 'Family Medicine'),
      ('Dr. Strange', 'Neurology', 12, 'Neuroscience'),
      ('Dr. Zhivago', 'Cardiology', 18, 'Cardiac Care');

      INSERT INTO hospital.patients (name, age, gender, blood_type, admission_date) VALUES
      ('Alice Rivera', 34, 'Female', 'A+', '2024-01-10'),
      ('Bob Chang', 55, 'Male', 'O+', '2024-01-12'),
      ('Clara Nguyen', 28, 'Female', 'B-', '2024-02-01'),
      ('Derek Foster', 67, 'Male', 'AB+', '2024-02-15'),
      ('Elena Kowalski', 42, 'Female', 'O-', '2024-03-01'),
      ('Frank Olsen', 19, 'Male', 'A-', '2024-03-10'),
      ('Gina Torres', 51, 'Female', 'B+', '2024-03-20'),
      ('Hiro Tanaka', 73, 'Male', 'O+', '2024-04-01');

      INSERT INTO hospital.appointments (patient_id, doctor_id, appointment_date, diagnosis, status) VALUES
      (1, 1, '2024-01-15', 'Flu', 'completed'),
      (2, 5, '2024-01-20', 'Hypertension', 'completed'),
      (3, 3, '2024-02-05', 'Routine Checkup', 'completed'),
      (4, 4, '2024-02-20', 'Migraine', 'completed'),
      (5, 2, '2024-03-05', 'Appendicitis', 'completed'),
      (1, 3, '2024-03-15', 'Follow-up', 'completed'),
      (6, 1, '2024-03-15', 'Sprained Ankle', 'completed'),
      (7, 5, '2024-03-25', 'Arrhythmia', 'completed'),
      (8, 4, '2024-04-05', 'Memory Concerns', 'completed'),
      (2, 5, '2024-04-10', 'Hypertension Follow-up', 'completed');

      INSERT INTO hospital.prescriptions (appointment_id, medicine, dosage, duration_days) VALUES
      (1, 'Tamiflu', '75mg twice daily', 5),
      (2, 'Lisinopril', '10mg daily', 90),
      (2, 'Aspirin', '81mg daily', 90),
      (4, 'Sumatriptan', '50mg as needed', 30),
      (7, 'Ibuprofen', '400mg 3x daily', 10),
      (8, 'Metoprolol', '25mg daily', 60),
      (10, 'Lisinopril', '20mg daily', 90);
    `);

    // ═══════════════════════════════════════════════════════════════════
    // LIBRARY — Books, Members, Loans
    // ═══════════════════════════════════════════════════════════════════
    await client.query(`
      DROP TABLE IF EXISTS library.loans CASCADE;
      DROP TABLE IF EXISTS library.books CASCADE;
      DROP TABLE IF EXISTS library.members CASCADE;

      CREATE TABLE library.members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        membership_type VARCHAR(20),
        join_date DATE
      );

      CREATE TABLE library.books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200),
        author VARCHAR(100),
        genre VARCHAR(50),
        published_year INT,
        copies_available INT
      );

      CREATE TABLE library.loans (
        id SERIAL PRIMARY KEY,
        book_id INT REFERENCES library.books(id),
        member_id INT REFERENCES library.members(id),
        loan_date DATE,
        return_date DATE,
        returned BOOLEAN DEFAULT FALSE
      );

      INSERT INTO library.members (name, email, membership_type, join_date) VALUES
      ('Anna Lee', 'anna@lib.com', 'premium', '2022-01-10'),
      ('Brian Hart', 'brian@lib.com', 'basic', '2023-03-15'),
      ('Carla Ruiz', 'carla@lib.com', 'premium', '2021-07-22'),
      ('Dan Scott', 'dan@lib.com', 'basic', '2023-11-01'),
      ('Elena Voss', 'elena@lib.com', 'premium', '2020-05-18');

      INSERT INTO library.books (title, author, genre, published_year, copies_available) VALUES
      ('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 1925, 3),
      ('Clean Code', 'Robert C. Martin', 'Technology', 2008, 5),
      ('Sapiens', 'Yuval Noah Harari', 'Non-Fiction', 2011, 4),
      ('Dune', 'Frank Herbert', 'Science Fiction', 1965, 2),
      ('1984', 'George Orwell', 'Fiction', 1949, 6),
      ('Design Patterns', 'Gang of Four', 'Technology', 1994, 3),
      ('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 1937, 4),
      ('Thinking Fast and Slow', 'Daniel Kahneman', 'Non-Fiction', 2011, 2);

      INSERT INTO library.loans (book_id, member_id, loan_date, return_date, returned) VALUES
      (1, 1, '2024-01-10', '2024-01-24', TRUE),
      (2, 1, '2024-01-10', '2024-02-10', TRUE),
      (3, 2, '2024-02-01', '2024-02-15', TRUE),
      (4, 3, '2024-02-10', '2024-03-10', FALSE),
      (5, 3, '2024-02-10', '2024-02-24', TRUE),
      (2, 4, '2024-03-01', '2024-03-15', FALSE),
      (7, 5, '2024-03-05', '2024-03-19', TRUE),
      (1, 2, '2024-03-10', '2024-03-24', FALSE),
      (6, 1, '2024-03-15', '2024-04-15', FALSE),
      (8, 5, '2024-03-20', '2024-04-03', TRUE);
    `);

    // ═══════════════════════════════════════════════════════════════════
    // ECOMMERCE — Users, Products, Reviews, Wishlists
    // ═══════════════════════════════════════════════════════════════════
    await client.query(`
      DROP TABLE IF EXISTS ecommerce.wishlists CASCADE;
      DROP TABLE IF EXISTS ecommerce.reviews CASCADE;
      DROP TABLE IF EXISTS ecommerce.products CASCADE;
      DROP TABLE IF EXISTS ecommerce.users CASCADE;

      CREATE TABLE ecommerce.users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50),
        email VARCHAR(100),
        country VARCHAR(50),
        signup_date DATE
      );

      CREATE TABLE ecommerce.products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        category VARCHAR(50),
        price NUMERIC(10,2),
        rating NUMERIC(2,1),
        total_sales INT
      );

      CREATE TABLE ecommerce.reviews (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES ecommerce.users(id),
        product_id INT REFERENCES ecommerce.products(id),
        rating INT CHECK (rating BETWEEN 1 AND 5),
        review_text TEXT,
        review_date DATE
      );

      CREATE TABLE ecommerce.wishlists (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES ecommerce.users(id),
        product_id INT REFERENCES ecommerce.products(id),
        added_date DATE
      );

      INSERT INTO ecommerce.users (username, email, country, signup_date) VALUES
      ('techguru', 'tech@mail.com', 'USA', '2023-01-05'),
      ('bookworm', 'books@mail.com', 'UK', '2023-02-14'),
      ('shopaholic', 'shop@mail.com', 'Canada', '2023-03-20'),
      ('gadgetfan', 'gadget@mail.com', 'USA', '2023-05-11'),
      ('minimalist', 'mini@mail.com', 'Germany', '2023-07-30'),
      ('reviewer99', 'review@mail.com', 'India', '2023-09-15');

      INSERT INTO ecommerce.products (name, category, price, rating, total_sales) VALUES
      ('Wireless Earbuds', 'Electronics', 79.99, 4.5, 1200),
      ('Running Shoes', 'Sports', 129.99, 4.2, 800),
      ('Coffee Maker', 'Home', 49.99, 4.7, 2000),
      ('Yoga Mat', 'Sports', 24.99, 4.0, 1500),
      ('Mechanical Keyboard', 'Electronics', 149.99, 4.8, 600),
      ('Backpack', 'Travel', 69.99, 4.3, 950),
      ('Water Bottle', 'Sports', 19.99, 4.1, 3000),
      ('Desk Lamp', 'Home', 34.99, 4.4, 700);

      INSERT INTO ecommerce.reviews (user_id, product_id, rating, review_text, review_date) VALUES
      (1, 1, 5, 'Amazing sound quality!', '2024-01-10'),
      (1, 5, 5, 'Best keyboard I have ever used', '2024-01-15'),
      (2, 3, 4, 'Good coffee maker, easy to use', '2024-02-01'),
      (3, 2, 3, 'Decent shoes but sizing runs small', '2024-02-10'),
      (3, 4, 5, 'Perfect for daily yoga', '2024-02-15'),
      (4, 1, 4, 'Great value for the price', '2024-03-01'),
      (4, 5, 5, 'Cherry MX switches are awesome', '2024-03-05'),
      (5, 7, 4, 'Keeps water cold all day', '2024-03-10'),
      (6, 3, 5, 'Must have for coffee lovers', '2024-03-15'),
      (6, 6, 4, 'Spacious and comfortable', '2024-03-20'),
      (2, 8, 3, 'Good lamp but a bit dim', '2024-04-01'),
      (1, 6, 4, 'Great travel companion', '2024-04-05');

      INSERT INTO ecommerce.wishlists (user_id, product_id, added_date) VALUES
      (1, 2, '2024-01-20'),
      (2, 5, '2024-02-05'),
      (3, 1, '2024-02-20'),
      (4, 3, '2024-03-10'),
      (5, 5, '2024-03-15'),
      (6, 2, '2024-03-25');
    `);

    console.log('PostgreSQL seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding PostgreSQL:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

seedPostgres();
