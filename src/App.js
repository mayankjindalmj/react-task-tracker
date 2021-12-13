import { useState, useEffect } from 'react'
import Header from "./components/Header"
import Footer from "./components/Footer"
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'

function App() {

  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getData = async() => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getData()
  }, [])

  const fetchTasks = async() => {
    const res = await fetch('http://localhost:5500/tasks')
    const data = await res.json()

    console.log(data)

    return data
  }
  const fetchTask = async(id) => {
    const res = await fetch(`http://localhost:5500/tasks/${id}`)
    const data = await res.json()
    return data
  }

const deleteTask = async(id) => {
  await fetch(`http://localhost:5500/tasks/${id}`, {
    method: 'DELETE',
  })

  setTasks(tasks.filter((task) => task.id !== id))
}

const toggleReminder = async(id) => {
  const taskToToggle = await fetchTask(id)
  const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

  const res = await fetch(`http://localhost:5500/tasks/${id}`, {
    method: 'PUT', 
      headers: {
        'Content-type' : 'application/json',
      },
      body: JSON.stringify(updTask),
  })
  const data = await res.json()

  setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
}

const addTask = async(task) => {

  const res = await fetch('http://localhost:5500/tasks', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  const data = await res.json()

  setTasks([...tasks, data])
  // const id = Math.floor( Math.random() * 10000 ) + 1
  // const newTask = {id, ...task}
  // setTasks([...tasks, newTask])
}


  return (
    <div className="App">
      <Header  onAddTask={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      {showAddTask && <AddTask onAddTask={addTask} />}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : "Good to go!"}
      <Footer />
    </div>
  )
}



export default App;
