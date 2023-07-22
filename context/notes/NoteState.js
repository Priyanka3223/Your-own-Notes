
import noteContext from "./NoteContext";
import { useState } from "react";
const NoteState=(props)=>{
  const host="http://localhost:5000"
    const notesInitial=[]

    const [notes, setNotes] = useState(notesInitial);
    //fetch notes
    const getNotes=async ()=>{
      // TODO: API call
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        }
      });
      const json=await response.json();
      // console.log(json);
      // console.log(localStorage.getItem('token')+"token");
      setNotes(json)
    }

    // Add a Note
    const addNote=async (title,description,tag)=>{
      // TODO: API call
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}), 
      });
      const json= await response.json(); 
      // console.log(json);
      const note=json;
      setNotes(notes.concat(note));
    }
    // Delete a note
    const deleteNote=async (id)=>{
      // API Call
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        }
      }); 
      const json=response.json();
      // console.log(json);
      const newnote=notes.filter(
        (note)=>{return note._id!==id}
      )
      setNotes(newnote);
    }
    // Edit a note
    const editNote=async (id,title,description,tag)=>{
      // API Call
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}), 
      }); 
      const json=response.json();
      // console.log(json);
      // Logic to edit in client
      for(let index=0;index<notes.length;index++){
        const element=notes[index];
        if(element.id===id){
          notes[index].title=title;
          notes[index].description=description;
          notes[index].tag=tag;
        }
      }
    }
    return(
        <noteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;