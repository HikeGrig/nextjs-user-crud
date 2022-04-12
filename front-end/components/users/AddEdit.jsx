import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { userService } from 'services';
import { useEffect } from 'react';

export { AddEdit };

function AddEdit(props) {
    const user = props?.user;
    const isAddMode = !user;
    console.log(user)
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        address: Yup.string()
            .required('Address is required'),
        number: Yup.number()
            .required('Phone number is required'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (!isAddMode) {
        const { password, confirmPassword, ...defaultValues } = user;
        formOptions.defaultValues = defaultValues;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return isAddMode
            ? createUser(data)
            : updateUser(user.id, data);
    }

    function createUser(data) {
        return userService.create(data)
            .then(() => {
                router.push('/');
            })
            .catch((error)=>{
                    alert('The email has already been taken.');
                }
            );
    }

    function updateUser(id, data) {
        return userService.update(id, data)
            .then(() => {
                router.push('/');
            })
            .catch((error)=>{
                    alert('The email has already been taken.');
                }
            );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
            <div className="form-row">
                <div className="form-group col-6">
                    <label>First Name</label>
                    <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>
                <div className="form-group col-6">
                    <label>Last Name</label>
                    <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-4">
                    <label>Email</label>
                    <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
                <div className="form-group col-4">
                    <label>Address</label>
                    <input name="address" type="text" {...register('address')} className={`form-control ${errors.address ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.address?.message}</div>
                </div>
                <div className="form-group col-4">
                    <label>Phone number</label>
                    <input name="number" type="text" {...register('number')} className={`form-control ${errors.number ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.number?.message}</div>
                </div>
            </div>
            <div className="form-group">
                <button disabled={formState.isSubmitting} className="btn btn-primary">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-2"></span>}
                    Save
                </button>
            </div>
        </form>
    );
}