import React, {useContext} from "react";
import { TaskDataContext } from "./taskDataContext";

function EditDeleteTaskModal(props) {

    const {dark} = useContext(TaskDataContext)
    const [darkMode, setDarkMode] = dark

    function handleDeleteTaskClick() {
        props.setDeleteTaskOpen(true)
        props.setViewTaskOpen(false)
        props.setEditDeleteTaskOpen(false)
        props.setEditTaskSelectedTaskData(props.selectedTaskData)
    }

    function handleEditTaskClick() {
        props.setEditTaskSelectedTaskData(props.selectedTaskData)
        props.setEditTaskOpen(true)
        props.setViewTaskOpen(false)
        props.setEditDeleteTaskOpen(false)
    }
  
    return (
        <div className={darkMode ? "choose-edit-delete-modal edit-delete-task-modal dark-grey-background" : "choose-edit-delete-modal edit-delete-task-modal"}>
            <h1 onClick={handleEditTaskClick} className="edit-choice"> Edit Task </h1>
            <h1 onClick={handleDeleteTaskClick} className="delete-choice"> Delete Task</h1>
        </div>
    )
}

export default EditDeleteTaskModal