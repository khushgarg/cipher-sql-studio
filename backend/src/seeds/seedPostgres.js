const pool = require('../config/postgres');

const seedPostgres = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('CREATE SCHEMA IF NOT EXISTS assignment_1');
    await client.query('CREATE SCHEMA IF NOT EXISTS assignment_2');
    await client.query('CREATE SCHEMA IF NOT EXISTS assignment_3');

    await client.query(`
      DROP TABLE IF EXISTS assignment_1.employees CASCADE;
      DROP TABLE IF EXISTS assignment_1.departments CASCADE;
      DROP TABLE IF EXISTS assignment_2.products CASCADE;
      DROP TABLE IF EXISTS assignment_2.categories CASCADE;
      DROP TABLE IF EXISTS assignment_3.customers CASCADE;
      DROP TABLE IF EXISTS assignment_3.orders CASCADE;
      DROP TABLE IF EXISTS assignment_3.order_items CASCADE;
    `);

    await client.query(`
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
    `);

    await client.query(`
      INSERT INTO assignment_1.employees (name, department, salary, hire_date) VALUES
      ('Alice Johnson', 'Sales', 75000.00, '2020-01-15'),
      ('Bob Smith', 'Engineering', 95000.00, '2019-03-22'),
      ('Carol Williams', 'Sales', 68000.00, '2021-06-10'),
      ('David Brown', 'Engineering', 85000.00, '2018-11-05'),
      ('Eve Davis', 'Marketing', 62000.00, '2022-02-20'),
      ('Frank Miller', 'Sales', 72000.00, '2020-08-14'),
      ('Grace Wilson', 'Engineering', 98000.00, '2017-04-30'),
      ('Henry Taylor', 'Marketing', 65000.00, '2021-09-25');
    `);

    await client.query(`
      INSERT INTO assignment_1.departments (name, manager_id) VALUES
      ('Sales', 1),
      ('Engineering', 2),
      ('Marketing', 5);
    `);

    await client.query(`
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
    `);

    await client.query(`
      INSERT INTO assignment_2.categories (name) VALUES
      ('Electronics'),
      ('Clothing'),
      ('Books');
    `);

    await client.query(`
      INSERT INTO assignment_2.products (name, price, category_id, stock) VALUES
      ('Laptop', 999.99, 1, 50),
      ('Smartphone', 699.99, 1, 100),
      ('T-Shirt', 29.99, 2, 200),
      ('Jeans', 59.99, 2, 150),
      ('Python Book', 49.99, 3, 75),
      ('JavaScript Guide', 39.99, 3, 60);
    `);

    await client.query(`
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
    `);

    await client.query(`
      INSERT INTO assignment_3.customers (name, email, city) VALUES
      ('John Doe', 'john@example.com', 'New York'),
      ('Jane Smith', 'jane@example.com', 'Los Angeles'),
      ('Mike Johnson', 'mike@example.com', 'Chicago'),
      ('Sarah Williams', 'sarah@example.com', 'New York');
    `);

    await client.query(`
      INSERT INTO assignment_3.orders (customer_id, order_date, total) VALUES
      (1, '2024-01-15', 1049.98),
      (1, '2024-02-20', 89.98),
      (2, '2024-01-10', 699.99),
      (3, '2024-03-05', 149.97);
    `);

    await client.query(`
      INSERT INTO assignment_3.order_items (order_id, product_name, quantity, price) VALUES
      (1, 'Laptop', 1, 999.99),
      (1, 'T-Shirt', 1, 29.99),
      (2, 'T-Shirt', 2, 29.99),
      (3, 'Smartphone', 1, 699.99),
      (4, 'Jeans', 2, 59.99),
      (4, 'Python Book', 1, 49.99);
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
