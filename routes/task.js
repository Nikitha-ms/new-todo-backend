// const express = require('express');
// const router = express.Router();
// const Task = require('../models/Task');

// // // Create a new task
// // router.post('/create', async (req, res) => {
// //     const { task } = req.body;
// //     try {
// //         const newTask = new Task({
// //             task
// //         });
// //         await newTask.save();
// //         res.status(200).json({ message: "Task created successfully" });
// //     } catch (err) {
// //         console.error(err.message);
// //         res.status(500).send("Server error");
// //     }
// // });
// // module.exports = router;   
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
// Get all tasks of the user by userid sent in the request while creating the task
router.get('/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const tasks = await Task.find({ userid });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});



// Create a new task
router.post('/create', async (req, res) => {
  try {
    const { task,userid } = req.body;
    const newTask = new Task({ task ,userid});
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});


// Edit a task
router.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { task }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});
//completed task
router.put('/complete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, { completed: true }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});


// Delete a task
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted', deletedTask });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;

