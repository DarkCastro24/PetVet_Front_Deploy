function AddButton({onClick}){

  const handleClick = () =>{
    onClick()

  }  

return(


    <button type="submit" className='edit-submit' onClick={handleClick}>Agregar nuevo</button>


)


}

export default AddButton