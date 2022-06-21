import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";
import {v4 as myNewId} from "uuid";

import { TodoistApi } from '@doist/todoist-api-typescript';
const BACKEND_URL = "https://api.todoist.com/sync/v8/completed/get_all";


const api = new TodoistApi('9d9580a22b06944b7dbf8b9a97d83fd0305c05a7')

/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    // axios.post(`${BACKEND_URL}/todos`, {
    //     label:itemToAdd,
    //     done: false
    // }).then((response) => {
    //     setItems([ ...items, response.data])
    // })
    // const newItem = {id:myNewId(), content:itemToAdd};
    api.addTask({
      id: myNewId(),
      content: itemToAdd,
      projectId: 2198553603
  })
      .then((task) => setItems([task, ...items]))
      .catch((error) => console.log(error))
      setItemToAdd("");
  };


  

  const toggleItemDone = ({ id, done }) => {
      // axios.put(`${BACKEND_URL}/todos/${id}`, {
      //     done: !done
      // }).then((response) => {
          // setItems(items.map((item) => {
          //     if (item.id === id) {
          //         return {
          //             ...item,
          //             done: !done
          //         }
          //     }
          //     return item
          // }))

      // })
    !done?api.closeTask(id)
    .then((isSuccess) =>
    setItems(items.map((item) => {
      if (item.id === id) {
          return {
              ...item,
              done: !done
          }
      }
      return item
  })))
    .catch((error) => console.log(error))
      :api.reopenTask(id)
    .then((isSuccess) => 
    setItems(items.map((item) => {
      if (item.id === id) {
          return {
              ...item,
              done: !done
          }
      }
      return item
  })))
    .catch((error) => console.log(error))


      
  };

  // N => map => N
    // N => filter => 0...N
  const handleItemDelete = (id) => {
      axios.delete(`${BACKEND_URL}/todos/${id}`).then((response) => {
          const deletedItem = response.data;
          console.log('Было:',items)
          const newItems = items.filter((item) => {
              return deletedItem.id !== item.id
          })
          console.log('Осталось:',newItems)
          setItems(newItems)
      })
  };

  useEffect(() => {
  //     console.log(searchValue)
  //     axios.get(`${'https://api.todoist.com/rest/v1/projects/2198553603'}`, {
  //       headers: {
  //         Authorization: `Bearer 9d9580a22b06944b7dbf8b9a97d83fd0305c05a7`,
  //         'Content-Type': 'application/json'
  //       }
  //     }).then((response) => {
  //         setItems(response);
  //     })
  
  api.getTasks()
    .then((tasks) => {
      setItems(tasks.filter((task) => {
        return task.projectId === 2198553603;
      }));
    })
    .catch((error) => console.log(error))
  }, [])


  const handleGetCompletedItems = () => {
  axios.get(`${BACKEND_URL}`, {
        headers: {
          Authorization: `Bearer 9d9580a22b06944b7dbf8b9a97d83fd0305c05a7`
        }
      }).then((tasks) => {
        console.log(tasks);  
        setItems(tasks.data.items);
      })
  };
  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <button onClick={handleGetCompletedItems}>Get completed items</button>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
