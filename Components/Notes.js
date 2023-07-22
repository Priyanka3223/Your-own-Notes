import React, { useContext, useEffect ,useRef,useState} from "react";
import Notecontext from "../context/notes/NoteContext";
import Noteitem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(Notecontext);
  let navigate=useNavigate();
  const { notes, getNotes,editNote } = context;
  const [note, setnote] = useState({id:"",etitle:"",edescription:"",etag:"default"})
  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    }
    else{
      navigate("/login")
    }
    
  }, );
  const updateNote = (currentnote) => {
    ref.current.click();
    setnote({id:currentnote._id,etitle:currentnote.title,edescription:currentnote.description,etag:currentnote.tag});
    
  };
  const onChange=(e)=>{
    setnote({...note,[e.target.name]:e.target.value})
  }
  const handleClick=(e)=>{
    editNote(note.id,note.etitle,note.edescription,note.etag);
    refClose.current.click();
    console.log("updating");
    e.preventDefault();
    props.showalert("updated succesfully","success");
    // addNote(note.title,note.description,note.tag)
  }
  const ref = useRef(null)
  const refClose = useRef(null)
  return (
    <>
      <AddNote showalert={props.showalert}/>
      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1" 
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input value={note.etitle} type="text" className="form-control" id="etitle" name='etitle'
            aria-describedby="emailHelp" minLength={5} required
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label  htmlFor="description"  className="form-label">
            Description
          </label>
          <input value={note.edescription}
            type="text" className="form-control" minLength={5} required
            id="edescription" name='edescription' onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="tag"  className="form-label">
            Tag
          </label>
          <input value={note.etag}
            type="text" className="form-control"
            id="etag" name='etag' onChange={onChange} minLength={5} required />
        </div>
      </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" onClick={handleClick} className="btn btn-primary">
                Update note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="row my-3">
          <h1>Your Notes</h1>
          <div className="container mx-2">
          {notes.length===0 && 'No notes to display'}
          </div>
          {notes.map((note) => {
            return (
              <Noteitem key={note._id} showalert={props.showalert} updateNote={updateNote} note={note} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Notes;
