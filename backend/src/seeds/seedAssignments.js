const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');
require('dotenv').config();

const assignments = [
  {
    title: 'Find All Employees in Sales Department',
    description: 'Write a SQL query to retrieve all employees who work in the Sales department. Return their names, salaries, and hire dates.',
    difficulty: 'easy',
    postgresSchema: 'assignment_1',
    tables: ['employees', 'departments'],
    expectedColumns: ['name', 'department', 'salary', 'hire_date'],
    hints: [
      'Think about using the WHERE clause to filter results',
      'Check the department column in the employees table'
    ]
  },
  {
    title: 'Find Products Over $50',
    description: 'Write a SQL query to find all products with a price greater than $50. Include the product name, price, and category.',
    difficulty: 'easy',
    postgresSchema: 'assignment_2',
    tables: ['products', 'categories'],
    expectedColumns: ['name', 'price', 'category'],
    hints: [
      'Use the WHERE clause with a comparison operator',
      'The price column contains numeric values'
    ]
  },
  {
    title: 'Find Customers with Multiple Orders',
    description: 'Write a SQL query to find customers who have placed more than one order. Show their names and the total number of orders.',
    difficulty: 'medium',
    postgresSchema: 'assignment_3',
    tables: ['customers', 'orders'],
    expectedColumns: ['name', 'order_count'],
    hints: [
      'You will need to use GROUP BY and HAVING',
      'Count the number of orders per customer'
    ]
  },
  {
    title: 'Calculate Total Revenue Per Customer',
    description: 'Write a SQL query to calculate the total amount spent by each customer. Return the customer name and total revenue.',
    difficulty: 'medium',
    postgresSchema: 'assignment_3',
    tables: ['customers', 'orders'],
    expectedColumns: ['name', 'total_revenue'],
    hints: [
      'Use JOIN to connect customers and orders',
      'Aggregate using SUM and GROUP BY'
    ]
  },
  {
    title: 'Find Orders with Multiple Items',
    description: 'Write a SQL query to find orders that contain more than one item. Show the order ID, customer name, and number of items.',
    difficulty: 'hard',
    postgresSchema: 'assignment_3',
    tables: ['customers', 'orders', 'order_items'],
    expectedColumns: ['order_id', 'customer_name', 'item_count'],
    hints: [
      'You will need to join three tables',
      'Use GROUP BY with HAVING to filter'
    ]
  }
];

const seedAssignments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersql');
    console.log('Connected to MongoDB');

    await Assignment.deleteMany({});
    console.log('Cleared existing assignments');

    await Assignment.insertMany(assignments);
    console.log('Seeded assignments successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
    process.exit(1);
  }
};

seedAssignments();
