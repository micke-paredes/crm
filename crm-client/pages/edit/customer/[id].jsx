import React from 'react';
import { useRouter } from 'next/dist/client/router';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik } from 'formik';
import Layout from '../../../components/Layout';
import * as Yup from 'yup';
import Swal from "sweetalert2";


const GET_ONLY_CUSTOMER = gql`
    query getOnlyCustomer($id: ID!) {
        getOnlyCustomer(id: $id) {
        name
        lastName
        company
        phone
        email
        }
    }
`;

const UPDATE_CUSTOMER = gql`
    mutation updateCustomer($id: ID!, $input: customerData) {
      updateCustomer(id: $id, input: $input) {
        id
        name
        lastName
        email
        phone
        company
      }
    }
`;

const editCustomer = () => {

    const router = useRouter();
    const { query: { id } } = router;
    const { data, loading, error } = useQuery(GET_ONLY_CUSTOMER,{ variables: { id } });
    const [ updateCustomer ] = useMutation(UPDATE_CUSTOMER);
    const validationSchema =  Yup.object({
        name: Yup.string().required('The name is required'),
        lastName: Yup.string().required('The last name is required'),
        email: Yup.string()
            .email('The email is invalid')
            .required('The email is required'),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'The phone is not valid')
            .required('The phone is required'),
        company: Yup.string().required('The company is required'),
    });

    if (loading) return null;
    if (error) return router.push('/');
    const { getOnlyCustomer } = data;

    const updateCustomerData = async formValues => {
       const { name, lastName, email, phone, company } = formValues;
       try {
           const { data } = await updateCustomer({
               variables: {
                   id,
                   input: {
                       name,
                       lastName,
                       email,
                       phone,
                       company
                   }
               }
           });
           Swal.fire({
               title: 'Success',
               text: "The customer data was updated",
               icon: 'success',
               confirmButtonColor: '#3085d6',
               confirmButtonText: 'OK'
           }).then((result) => {
               if (result.isConfirmed) {
                   window.location = '/';
               }
           })
       } catch (error) {
           await Swal.fire({
               title: 'error',
               text: "The customer data connot be update",
               icon: 'error',
               confirmButtonColor: '#3085d6',
               confirmButtonText: 'OK'
           })
       }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Edit Customer</h1>
            <button 
                type="button" 
                className="btn btn-secondary btn-sm justify-end"
                onClick={() => router.push('/')}
            >
                <i className="fa fa-arrow-left"></i> Back
            </button>

            <div className="flex justify-center mt-3">
                <Formik
                    validationSchema={ validationSchema }
                    enableReinitialize
                    initialValues={ getOnlyCustomer }
                    onSubmit={ (formValues) => { updateCustomerData(formValues) } }
                >
                    {
                        props => {
                            return (
                                <form
                                    className="bg-gray-100 shadow-xl px-8 pt-6 pb-8 mb-4 border rounded  w-full max-w-lg"
                                    onSubmit={ props.handleSubmit }
                                >
                                    <div className="form-row">
                                        <div className="form-group col-md">
                                            <label htmlFor="name">
                                                Name
                                            </label>
                                            <input 
                                                type="text"
                                                id="name"
                                                className="form-control" 
                                                placeholder="Edward"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.name}
                                            />
                                        </div>
            
                                        {
                                            props.touched.name && props.errors.name ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error</p>
                                                    <p>{props.errors.name}</p>
                                                </div>
                                            ) : null
                                        }
            
                                        <div className="form-group col-md">
                                            <label htmlFor="lastName">
                                                Last Name
                                            </label>
                                            <input 
                                                type="text"
                                                id="lastName"
                                                className="form-control" 
                                                placeholder="McLovin"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.lastName}
                                            />
                                        </div>
            
                                        {
                                            props.touched.lastName && props.errors.lastName ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.lastName}</p>
                                            </div>
                                            ) : null
                                        }
            
                                        <div className="form-group col-md">
                                            <label htmlFor="email">
                                                Email
                                            </label>
                                            <input 
                                                type="email"
                                                id="email" 
                                                className="form-control" 
                                                placeholder="mail@example.com"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.email}
                                            />
                                        </div>

                                        {
                                            props.touched.email && props.errors.email ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error</p>
                                                    <p>{props.errors.email}</p>
                                                </div>
                                            ) : null
                                        }

                                        <div className="form-group col-md">
                                            <label htmlFor="phone">
                                                Phone
                                            </label>
                                            <input 
                                                type="text"
                                                id="phone"
                                                maxLength="10"
                                                className="form-control" 
                                                placeholder="5555363737"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.phone}
                                            />
                                        </div>
            
                                        {
                                            props.touched.phone && props.errors.phone ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error</p>
                                                    <p>{props.errors.phone}</p>
                                                </div>
                                            ) : null
                                        }
            
                                        <div className="form-group col-md">
                                            <label htmlFor="company">
                                                Company
                                            </label>
                                            <input 
                                                type="text"
                                                id="company"
                                                className="form-control" 
                                                placeholder="Company S.A. de C.V."
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.company}
                                            />
                                        </div>
                                        
                                        {
                                            props.touched.company && props.errors.company ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error</p>
                                                    <p>{props.errors.company}</p>
                                                </div>
                                            ) : null
                                        }
            
                                    </div>
                                    <br />
                                    <div className="form-group col-md">
                                        <input
                                            className="btn btn-warning btn-sm btn-block mt-3 w-full"
                                            type="submit"
                                            value="Update"
                                        />
                                    </div>
                                </form>
                            )
                        }
                    }
                </Formik>
                   
            </div>
        </Layout>
    )
} 

export default editCustomer;