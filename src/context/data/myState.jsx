import myContext from "./myContext";
import React, { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { Navigate } from 'react-router';

const myState = (props) => {
  
  //* creating a loading state
  const [loading, setLoading] = useState(false);
  
  //* creating a all Notes state
  const [allNotes, setAllNotes] = useState([]);
  
  //* creating a getAllNotes function
  const getAllNotes = async () => {
    
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/fetchallnotes`,
        {
          method : 'GET',
          headers : {  
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token')
          }
        }
      );
      const notesData = await res.json();
      console.log(notesData)
      setAllNotes(notesData);
      setLoading(false)
    }
    catch (error) {
      console.log(error);
      setLoading(false);
    }
    
  };
    
    
  //* Add Note state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  
  //* Add note Function
  const addNote = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/addnote`,
      {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json',
          'auth-token' : localStorage.getItem('token')
        },
        body : JSON.stringify({ title, description, tag })
      }
    );

    //* receiving response
    const notedata = await res.json();
    // console.log(noteData)
    getAllNotes();
    
    //* condition
    if(notedata.error){
      toast.error(notedata.error)
    }
    else{
      toast.success(notedata.success)
    }

    setTitle('');
    setDescription('');
    setTag('');
  }

  //* deletion of note
  const deleteNote = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/deletenote/${id}`,
      {
        method : 'DELETE',
        headers : {
          'Content-Type': 'application/json',
          'auth-token' : localStorage.getItem('token')
        },
        body : JSON.stringify({ id })
      }
    );
    //* response
    const noteData = await res.json();
    getAllNotes();
    // console.log(noteData)
    toast.success(noteData.success);
  };
  
  //* edit note
  const editNotesHandle = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/updatenote/${id}`,
      {
        method : 'PUT',
        headers : {
          'Content-Type': 'application/json',
          'auth-token' : localStorage.getItem('token')
        },
        body : JSON.stringify({ id })
      }
    );

    //* response
    const editData = await res.json();
    getAllNotes();
    // console.log(editData)
    toast.success(editData.success);
  }

  return (
    <myContext.Provider value={{ allNotes, getAllNotes, loading, title, setTitle, description, setDescription, tag, setTag, addNote, deleteNote, editNotesHandle }}>
        {props.children}
    </myContext.Provider>
  )
};

export default myState;