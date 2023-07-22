import React,{useContext,useState} from 'react'
import Notecontext from "../context/notes/NoteContext"

const AddNote = (props) => {
    const context = useContext(Notecontext);
  const {addNote}=context;
  const [note, setnote] = useState({title:"",description:"",tag:""})
  const onChange=(e)=>{
    setnote({...note,[e.target.name]:e.target.value})
  }
  const handleClick=(e)=>{
    e.preventDefault();
    addNote(note.title,note.description,note.tag);
    setnote({title:"",description:"",tag:""});
    props.showalert("added succesfully","success");
  }
  return (
    <div>
      <div className="container my-3">
      <h1>Add a Note</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input type="text" className="form-control" id="title" name='title'
            aria-describedby="emailHelp" value={note.title}
            onChange={onChange}  minLength={5} required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description"  className="form-label">
            Description
          </label>
          <input
            type="text" className="form-control" value={note.description} minLength={5} required
            id="description" name='description' onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="tag"  className="form-label">
            Tag
          </label>
          <input
            type="text" className="form-control" value={note.tag} minLength={5} required
            id="tag" name='tag' onChange={onChange} />
        </div>
        <button disabled={note.title.length<5 || note.description<5} type="submit" className="btn btn-primary" onClick={handleClick}>
          Add Note
        </button>
      </form>
      </div>
    </div>
  )
}

export default AddNote
