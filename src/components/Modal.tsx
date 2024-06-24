import { Dialog } from '@headlessui/react'
import { useState } from 'react'


function Modal({ isOpen, setIsOpen, todo }) {
    const [input, setInput] = useState(todo.text)
    const dispatch = useDispatch()
    const saveTodo = () => {
        todo = { ...todo, text: input }
        dispatch(updateTodo(todo))
        handleClose()
    }
    const handleClose = () => {
        setIsOpen(false)
    }
    return (
        <Dialog
            className='bg-white max-w-4xl justify-center flex items-center mx-auto z-20 p-4 rounded-md mt-10'
            open={isOpen} onClose={handleClose}>
            <Dialog.Panel
                className='flex flex-col space-y-4'>
                <Dialog.Title
                    className='text-xl text-center font-bold'
                >Edit your todo</Dialog.Title>
                <input
                    className='focus:ring-offset-0 focus:ring-0 outline-none border-2 p-2 rounded-md'
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    value={input}
                />
                <button onClick={saveTodo}>Save changes</button>
                <button onClick={handleClose}>Cancel</button>
            </Dialog.Panel>
        </Dialog>
    )
}

export default Modal