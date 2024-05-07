import { PlusCircle } from '@phosphor-icons/react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './App.module.css'

import { Header } from './components/Header'
import { Input } from './components/Input'
import { Header as ListHeader } from './components/List/Header'
import { Item } from './components/List/Item'

export interface ITask {
  id: number
  text: string
  isChecked: boolean
}

export function App() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [inputValue, setInputValue] = useState('')

  const checkedTasksCounter = tasks.reduce((prevValue, currentTask) => {
    if (currentTask.isChecked) {
      return prevValue + 1
    }

    return prevValue
  }, 0)

  function handleAddTask() {
    if (!inputValue) {
      return
    }

    const newTask: ITask = {
      id: uuidv4(),
      text: inputValue,
      isChecked: false,
    }

    setTasks((state) => [...state, newTask])
    setInputValue('')
  }

  /**
   * Handle task removal
   *
   * @param {number} id The task id
   */
  function handleRemoveTask(id: number) {
    const filteredTasks = tasks.filter((task) => task.id !== id)

    if (!confirm('Deseja mesmo apagar essa tarefa?')) {
      return
    }

    setTasks(filteredTasks)
  }

  /**
   * Handle task status toggle
   *
   * @param {Object} params The params object
   * @param {number} params.id The task id
   * @param {boolean} params.value The new task status
   */
  function handleToggleTask({ id, value }: { id: number; value: boolean }) {
    // Create a copy of the tasks state
    const updatedTasks = [...tasks]

    // Find the index of the task to update
    const taskIndex = updatedTasks.findIndex((task) => task.id === id)

    // Update the task status in the state
    updatedTasks[taskIndex].isChecked = value

    // Set the updated state
    setTasks(updatedTasks)
  }
  
  const isInputEmpty = inputValue.length === 0;

  return (
    <main>
      <Header />

      <section className={styles.content}>
        <div className={styles.taskInfoContainer}>
          <Input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <button className={styles.buttonCriar} onClick={handleAddTask} disabled={isInputEmpty}>
            Criar
            <PlusCircle size={16} />
          </button>
        </div>

        <div className={styles.tasksList}>
          <ListHeader
            tasksCounter={tasks.length}
            checkedTasksCounter={checkedTasksCounter}
          />

          {tasks.length > 0 ? (<div>{tasks.map((task) => (
                <Item
                  key={task.id}
                  data={task}
                  removeTask={handleRemoveTask}
                  toggleTaskStatus={handleToggleTask}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyDiv}>
              <img src="/clipboard.png" alt="ícone de prancheta" />
              <p>
                <strong>Você ainda não tem tarefas cadastradas</strong>
                Crie tarefas e organize seus itens a fazer
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
