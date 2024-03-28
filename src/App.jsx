import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import DraggableItem from "./components/DraggableItem";
import Cross from "./assets/images/icon-cross.svg";
import Sun from "./assets/images/icon-sun.svg";
import Moon from "./assets/images/icon-moon.svg";
import Todo from "./assets/images/TODO.svg";
import Input from "./components/input";
import Check from "./components/check";
import axios from "axios";

function App() {
  const [light, setlight] = useState(true);
  const [value, setnewvalue] = useState("");
  const [newitem, setnewitem] = useState([]);

  const postTodo = async () => {
    try {
      const response = await axios.post(
        "https://todo-backend-app.up.railway.app/api/sendTodo",
        {
          name: value,
          status: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getTodo = async () => {
    try {
      const response = await axios.get(
        "https://todo-backend-app.up.railway.app/api/todoList"
      );
      setnewitem(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(
        `https://todo-backend-app.up.railway.app/api/deleteTodo/${id}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodo = async (id) => {
    try {
      const response = await axios.put(
        `https://todo-backend-app.up.railway.app/api/updateTodo/${id}`
      );
    } catch (error) {}
  };

  const deleteInactive = async () => {
    try {
      const response = await axios.delete(
        `https://todo-backend-app.up.railway.app/api/deletedInactive`
      );
    } catch (error) {}
  };

  useEffect(() => {
    getTodo();
  }, [updateTodo, postTodo]);

  const handlesubmit = (e) => {
    e.preventDefault();
    if (value.trim() === "") {
      alert("type something");
    }
    if (value.trim() !== "") {
      setnewitem((previous) => [...previous, { text: value, Checked: false }]);
      setnewvalue("");
    }
  };

  const handleClearCompleted = () => {
    const remainingItems = newitem.filter((item) => !item.status);
    setnewitem(remainingItems);
  };

  const count = () => newitem.filter((item) => item.status).length;

  const isChecked = (index) => {
    const updatedItems = [...newitem];
    updatedItems[index] = {
      ...updatedItems[index],
      Checked: !updatedItems[index].Checked,
    };
    setnewitem(updatedItems);
  };

  const handleDelete = (e, index) => {
    e.stopPropagation();
    const items = [...newitem];
    items.splice(index, 1);
    setnewitem(items);
  };

  const handlesetnewvalue = (e) => {
    setnewvalue(e.target.value);
  };

  const handlesetlight = () => {
    setlight(!light);
  };

  const [filter, setFilter] = useState("all");

  const handleFilter = (filterType) => {
    setFilter(filterType);
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...newitem];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setnewitem(updatedItems);
  };

  const filteredItems = () => {
    switch (filter) {
      case "active":
        return newitem.filter((item) => !item.status);
      case "completed":
        return newitem.filter((item) => item.status);
      default:
        return newitem;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <main style={!light ? { background: "#171823" } : {}}>
          <img
            className="mobile"
            src={`${light ? "/bg-mobile-dark.jpg" : "/bg-mobile-dark.jpg"}`}
            alt="Mobile Background"
          />
          <img
            className="desktop"
            src={`${light ? "/bg-desktop-light.jpg" : "/bg-desktop-dark.jpg"}`}
            alt="Mobile Background"
          />
          <header>
            <img src={Todo} alt="Todo Icon" />
            <img
              className="sun"
              src={light ? Moon : Sun}
              onClick={handlesetlight}
              alt={light ? "Moon Icon" : "Sun Icon"}
            />
          </header>
          <section>
            <form
              onSubmit={(e) => {
                postTodo();
                e.preventDefault();
                setnewvalue("");
              }}
            >
              <Input
                light={light}
                value={value}
                handlesetnewvalue={handlesetnewvalue}
              />
              <label className="inputlabel" htmlFor="input"></label>
            </form>
            <ul className={` ${!light ? "dark" : "light"}`}>
              {filteredItems().map((item, index) => (
                <DraggableItem
                  key={item.id}
                  index={index}
                  item={item}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo}
                  handleDelete={(e) => handleDelete(e, index)}
                  moveItem={moveItem}
                  light={light}
                />
              ))}
              <div className="left">
                <p className="itemsleft leftsize"> {count()} items left</p>
                <div className="middle">
                  <p
                    style={{
                      color: filter === "all" ? "#3A7CFD" : null,
                    }}
                    className={`desktoptxt ${!light ? "footerp" : null}`}
                    onClick={() => handleFilter("all")}
                  >
                    All
                  </p>

                  <p
                    style={{
                      color: filter === "active" ? "#3A7CFD" : null,
                    }}
                    className={` desktoptxt ${!light ? "footerp" : null}`}
                    onClick={() => handleFilter("active")}
                  >
                    Active
                  </p>
                  <p
                    style={{
                      color: filter === "completed" ? "#3A7CFD" : null,
                    }}
                    className={`desktoptxt  ${!light ? "footerp" : null}`}
                    onClick={() => handleFilter("completed")}
                  >
                    Completed
                  </p>
                </div>
                <p
                  className={`itemsleft hover right ${
                    !light ? "footerp" : null
                  }`}
                  style={{ marginLeft: "auto", cursor: "pointer" }}
                  onClick={() => deleteInactive()}
                >
                  Clear Completed
                </p>
              </div>
            </ul>
            <footer className={`${!light ? "dark" : "light"}`}>
              <p
                style={{
                  color: filter === "all" ? "#3A7CFD" : null,
                }}
                className={`${!light ? "footerp" : null}`}
                onClick={() => handleFilter("all")}
              >
                All
              </p>
              <p
                style={{
                  color: filter === "active" ? "#3A7CFD" : null,
                }}
                className={`${!light ? "footerp" : null}`}
                onClick={() => handleFilter("active")}
              >
                Active
              </p>
              <p
                style={{
                  color: filter === "completed" ? "#3A7CFD" : null,
                }}
                className={`${!light ? "footerp" : null}`}
                onClick={() => handleFilter("completed")}
              >
                Completed
              </p>
            </footer>
          </section>
          <p className="drag">Drag and drop to reorder list</p>
        </main>
      </>
    </DndProvider>
  );
}

export default App;
