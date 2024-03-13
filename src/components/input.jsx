const Input = (props) =>{
    const {light,value,handlesetnewvalue} = props;
    

    return (
      <input
        value={value}
        onChange={handlesetnewvalue}
        style={
          !light
            ? {
                background: "#25273D",
                boxShadow: "  0px 35px 50px -15px rgba(0, 0, 0, 0.50)",
                color: "#C8CBE7",
              }
            : {
                background: "#fff",
                boxShadow: "0px 35px 50px -15px rgba(194, 195, 214, 0.50)",
              }
        }
        id="input"
        type="text"
        placeholder="Create a new todo…"
      />
    );
}


export default Input;