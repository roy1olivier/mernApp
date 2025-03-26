import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React from "react";

interface DialogProps {
    title: string;
    dialogDescription: string;
    dialogAdditionalText: string;
    isOpen:boolean;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
  }


const ComponentDialogPanel:React.FC<DialogProps>= ({ title, dialogDescription, dialogAdditionalText,  isOpen, setIsOpen }) => {

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">{title}</DialogTitle>
            <Description>{dialogDescription}</Description>
            <p>{dialogAdditionalText}</p>
            <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={() => setIsOpen(false)}>Deactivate</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
export default ComponentDialogPanel;