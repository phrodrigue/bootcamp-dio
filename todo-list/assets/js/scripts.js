document.querySelector("#btn-add-task").addEventListener("click", () => {
    var tastInput = document.querySelector("#task-input")
    var numTasks = document.getElementsByName("task").length
    
    var cb = document.createElement("input")
    cb.setAttribute("type", "checkbox")
    cb.setAttribute("name", "task")
    cb.setAttribute("id", `task-${numTasks}`)
    
    var lb = document.createElement("label")
    lb.setAttribute("for", `task-${numTasks}`)
    lb.innerHTML = tastInput.value
    
    var row = document.createElement("li")
    row.appendChild(cb)
    row.appendChild(lb)
    
    document.querySelector("#tasks-list").appendChild(row)
    tastInput.value = ""
})