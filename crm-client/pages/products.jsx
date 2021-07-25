import React, {useState} from "react";
import Layout from '../components/Layout';
import DataTable from "react-data-table-component";
import {useQuery, gql, useMutation} from "@apollo/client";
import { useRouter } from "next/router";
import NumberFormat from "react-number-format";

const GET_ALL_PRODUCTS = gql`
    query getProductList {
      getProductList {
        id
        name
        stock
        price
        create
      }
    }
`;

const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: ID!) {
      deleteProduct(id: $id)
    }
`;

const Products = () => {

    const [ productId, setProductId ] = useState(null);
    const { data, loading, error } =  useQuery(GET_ALL_PRODUCTS);
    const [ deleteCustomer ] = useMutation(DELETE_PRODUCT, {
        update(cache) {
            const { getProductList } = cache.readQuery({ query: DELETE_PRODUCT});
            cache.writeQuery({
                query: DELETE_PRODUCT,
                data: { getCustomerBySeller: getProductList.filter( currentProduct => currentProduct.id !== productId ) }
            });
        }
    });
    const router = useRouter();

    const setColumns = [
        { name: 'Name', selector: 'name', sortable: true },
        { name: 'Stock', selector: 'stock', sortable: true,
            cell: props => <NumberFormat thousandSeparator={true} suffix={ props.stock > 1 ? ' pieces' : ' piece' } value={props.stock} style={{ textAlign:"center"}}  />
        },
        { name: 'Price', selector: 'price', sortable: true,
            cell: props => <NumberFormat thousandSeparator={true} prefix={'$ '} value={props.price} style={{ textAlign:"right"}} />
        },
        { name: 'Actions', selector: 'id', sortable: false,
            cell: (row) =>
                <div className="btn-group">
                    <button type="button" className="btn btn-warning btn-sm fa fa-edit" onClick={() => editAction (row.id)}/>
                    <button type="button" className="btn btn-danger btn-sm fa fa-trash" onClick={() => deleteAction(row.name, row.lastName, row.id)}    />
                </div>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                color: 'black',
                background: 'rgba(147, 197, 253)',
                justifyContent: 'center',
                fontSize: '16px'
            }
        },
        cells: {
            style: {
                justifyContent: 'center',
            }
        },
        rows: {
            style: {
                minHeight: '42px', // override the row height
            }
        },
    };

    const editAction = (id) => {
        router.push({
            pathname: "/edit/product/[id]",
            query: { id }
        })
    }

    const deleteAction = (name, id) => {
        setProductId(id);
        Swal.fire({
            title: 'Are you sure?',
            text: `${name} will be delete`,
            icon: 'warning',
            confirmButtonText: 'Delete',
            confirmButtonColor: '#3085d6',
            showCancelButton:true,
            cancelButtonColor: '#d33',
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await deleteCustomer({
                        variables: {
                            id
                        }
                    });
                    await Swal.fire(
                        'Deleted!',
                        data.deleteCustomer,
                        'success'
                    )
                    setProductId(null);
                } catch (error) {
                    await Swal.fire({
                        title: 'Error',
                        text: `${name} cannot be delete`,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                        showCancelButton: false,
                        cancelButtonColor: '#d33',
                    })
                }
            }
        })
    }

    if (loading) return null;
    if (!data.getProductList) return null;

     return (
         <Layout>
             <h1 className="text-2xl text-gray-800 font-light">Products</h1>
             <button
                 type="button"
                 className="btn btn-success btn-sm justify-end"
                 onClick={() => router.push('/create/product')}
             >
                 <i className="fa fa-plus"></i> New Product
             </button>
             <div className="table-responsive">
                 <DataTable
                     columns={setColumns}
                     data={data.getProductList}
                     pagination
                     fixedHeader
                     fixedHeaderScrollHeight="600px"
                     customStyles={customStyles}
                 />
             </div>
         </Layout>
     )
}

export default Products;