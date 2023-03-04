const path = require("path");
const Employee = require("../model/Employee");

const data = {};
data.employees = require("../model/employees.json");

const getAllEmployee = async (req, res) => {
  const employees = Employee.find();
  if (!employees)
    return res.send(204).json({
      message: "No employee found.",
    });

  return res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req.body.firstName || !req.body.lastName) {
    return res.send(400).json({
      message: "First name and last name are required!",
    });
  }

  try {
    const result = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    res.send(201).json(result);
  } catch (error) {}
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.send(400).json({
      message: "Id parameter is required!.",
    });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res.send(204).json({
      message: `no employee matches Id ${req.body.id}.`,
    });
  }

  if (req?.body?.firstName) employee.firstName = req?.body?.firstName;
  if (req?.body?.lastName) employee.lastName = req?.body?.lastName;

  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (req?.body?.id) {
    return res.send(400).json({
      message: "Employee Id is required!.",
    });
  }

  const employee = await Employee.findOne({ _id: req?.body?.id }).exec();
  if (!employee) {
    return res.send(204).json({
      message: `no Employee matches Id ${req.body.id}`,
    });
  }

  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.send(400).json({
      message: "Employee Id is required!.",
    });
  }
  const employee = await Employee.findOne({ _id: req?.params?.id }).exec();
  if (!employee) {
    return res.send(204).json({
      message: `no Employee matches Id ${req.param.id}`,
    });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  createNewEmployee,
};
