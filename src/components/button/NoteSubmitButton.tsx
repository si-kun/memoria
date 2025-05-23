import React from 'react'
import { Button } from '../ui/button'
import { Import } from 'lucide-react'


const NoteSubmitButton = () => {
  return (
    <Button
    type="submit"
    className="cursor-pointer bg-indigo-400 hover:bg-indigo-500"
  >
    <Import />
    <span>Save</span>
  </Button>
  )
}

export default NoteSubmitButton