import { toast } from 'react-toastify';
import './../asset/login.css';

export const toastSuccesss = (message: string) => {
    toast.success(message, {
        className: 'success-toast'
    })
}

export const toastFailure = (message: string) => {
    toast.error(message, {
        className: 'failure-toast'
    })
}