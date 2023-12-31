import React, {useState} from "react";
import * as scroll from "./enableDisableScroll"
import { TaskDataContext } from "./taskDataContext";
import deleteIcon from "../assets/icon-cross.svg"

let selectedTaskData
let initalSelectedTaskData

function EditTaskModal(props) {
    
    scroll.disableScroll()
    let currentData = props.currentBoardData
    const [subtaskCount, setSubtaskCount] = useState()
    const {dark} = React.useContext(TaskDataContext)
    const [darkMode, setDarkMode] = dark
    
    if (selectedTaskData === undefined) {
        selectedTaskData = props.editTaskSelectedTaskData
        setSubtaskCount(selectedTaskData.subtasks.length)
        initalSelectedTaskData = props.editTaskSelectedTaskData
    }

    const [currentTaskData, setCurrentTaskData] = useState(selectedTaskData)

    function renderColumnOptions() {
        let columnNameOptions = []
        for (let i = 0; i < currentData.columns.length; i++) {
            columnNameOptions.push( <option key={i} value={currentData.columns[i].name}> {currentData.columns[i].name} </option>)
        }
        return columnNameOptions
    }

    function addNewSubtask() {
        selectedTaskData = {
            ...selectedTaskData,
            subtasks: [
                ...selectedTaskData.subtasks,
                {
                    title: "",
                    isCompleted: false
                }
            ]
        }
        setCurrentTaskData(selectedTaskData)
    }

    function removeSubtaskInput(event) {
        selectedTaskData = {
            ...selectedTaskData,
            subtasks: selectedTaskData.subtasks.filter(subtask => subtask.title != event.target.previousElementSibling.value)
        }
        setCurrentTaskData(selectedTaskData)
    }

    function renderSubtasks() {
        let subtaskElements = []

        for (let i = 0; i < selectedTaskData.subtasks.length; i++) {
            subtaskElements.push(
                <div className="input-with-x-container" key={i}> 
                    <input required className={darkMode ? "subtask-input dark-grey-background text-color-white" : "subtask-input"} onChange={handleSubtaskChange} type="text" name={`subtask${i}`} value={selectedTaskData.subtasks[i].title} placeholder="e.g. Make coffee"/>
                    <img alt="x icon allowing deletion of input box" className="subtask-delete-btn-img" src={deleteIcon} onClick={removeSubtaskInput}/>
                </div>
            )
        }
        return subtaskElements
    }

    function handleTitleChange(event) {
        selectedTaskData = {
            ...selectedTaskData,
            title: event.target.value
        }
        setCurrentTaskData(selectedTaskData)
    }

    function handleDescriptionChange(event) {
        selectedTaskData = {
            ...selectedTaskData,
            description: event.target.value
        }
        setCurrentTaskData(selectedTaskData)
    }

    function handleSubtaskChange(event) {
    
        selectedTaskData = {
            ...selectedTaskData,
            subtasks: selectedTaskData.subtasks.map((subtask, index) => {
                if (`subtask${index}` === event.target.name) {
                    return {
                        isCompleted: false,
                        title: event.target.value
                    }
                }else {
                    return subtask
                }
            })
        }
        setCurrentTaskData(selectedTaskData)
    }

    function handleTaskStatusChange(event) {

        selectedTaskData = {
            ...selectedTaskData,
            status: event.target.value
        }
        setCurrentTaskData(selectedTaskData)
    }

    function handleEditTaskSubmit(event) {
        event.preventDefault()

        //// Pushing all task names in the board into an array for further use
        let taskNames = []
        for (let i = 0; i < props.allTasks.length; i++) {
            taskNames.push(props.allTasks[i].title)
        }

        //// Checking if there is already a task by the same name
        if (taskNames.includes(selectedTaskData.title) === true && selectedTaskData.title !== initalSelectedTaskData.title) {
            alert(`${selectedTaskData.title} is already a task, please select a different name.`)
        }else {
            props.setTaskData(prevState => {
                return {
                    boards: prevState.boards.map((board, index) => { 
                        if(board.name === props.currentBoardData.name) {
                            return {
                                ...prevState.boards[index],
                                columns: prevState.boards[index].columns.map((column, index) => {
                                    if(column.name === initalSelectedTaskData.status) {
                                        if (column.name === selectedTaskData.status) {
                                            return {
                                                ...column,
                                                tasks: column.tasks.map((task, index) => {
                                                    if (task.title === initalSelectedTaskData.title) {
                                                        return selectedTaskData
                                                    }else {
                                                        return task
                                                    }
                                                })
                                            }  
                                        }else {
                                            return {
                                                ...column,
                                                tasks: column.tasks.filter((task) => task.title != initalSelectedTaskData.title)
                                            }  
                                        }
                                    }else if(column.name === selectedTaskData.status) {
                                        if (column.tasks != undefined) {
                                            return {
                                                ...column,
                                                tasks: [
                                                    ...column.tasks,
                                                    selectedTaskData
                                                ]
                                            }  
                                        }else {
                                            return {
                                                ...column,
                                                tasks: [
                                                    selectedTaskData
                                                ]
                                            }  
                                        } 
                                    }else {
                                        return column
                                    }
                                })
                            }
                        }else {
                            return board
                        }  
                    })
                }
            })
            selectedTaskData = undefined
            props.setEditTaskOpen(false)
            scroll.enableScroll()
        }
    }

    return (
        <div className="add-task-modal">
            <div className="modal-page-cover"> </div>
            <div className={darkMode ? "modal-content dark-grey-background text-color-white" : "modal-content"}>
                <form onSubmit={handleEditTaskSubmit}> 
                    <h1 className="modal-title"> Edit Task</h1>
                    <div className="modal-input-container">
                        <label className="modal-label"> Title </label>
                        <input className={darkMode ? "text-box-normal dark-grey-background text-color-white" : "text-box-normal"} type="text" onChange={handleTitleChange} value={selectedTaskData.title} placeholder="e.g. Take coffee break" />
                    </div>
                    <div className="modal-input-container">
                        <label className="modal-label"> Description </label>
                        <textarea className={darkMode ? "text-box-large desc-box dark-grey-background text-color-white" : "text-box-large desc-box"} type="text" value={selectedTaskData.description} onChange={handleDescriptionChange} placeholder="e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little."/>
                    </div>

                    <div className="modal-input-container">
                        <h3 className="modal-label"> Subtasks </h3>
                        <div>
                            {renderSubtasks()}
                        </div>
                        <button className={darkMode ? "modal-add-new-btn white-background-hover" : "modal-add-new-btn"} onClick={addNewSubtask}> +Add New Subtask </button>
                    </div>

                    <div className="modal-input-container">
                        <label className="modal-label"> Status </label>
                        <select onChange={handleTaskStatusChange} className={darkMode ? "select-menu dark-grey-background text-color-white" : "select-menu"}> 
                            {renderColumnOptions()}
                        </select>
                    </div>

                    <button type="submit" className="modal-final-btn"> Update Task</button>
                </form>
            </div>
        </div>
    )
}

export default EditTaskModal