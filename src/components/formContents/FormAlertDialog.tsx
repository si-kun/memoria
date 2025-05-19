import React from 'react'

import {

} from "@/components/ui/"

import { Button } from '../ui/button'

interface FormAlertDialogProps {
    submitErrorMessage: string;
    alertDialogOpen: boolean;
    setAlertDialogOpen: (open: boolean) => void;
}

const FormAlertDialog = ({submitErrorMessage, alertDialogOpen, setAlertDialogOpen}: FormAlertDialogProps) => {
  return (
    <AlertDialog open={alertDialogOpen}>
    <AlertDialogTrigger asChild>
      <Button variant="outline">Show Dialog</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Submit Error Dialog</AlertDialogTitle>
        <AlertDialogDescription>
          {submitErrorMessage}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>Close</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default FormAlertDialog