import axios from 'axios';

const BASE_URL ="http://127.0.0.1:8000";

export const insertProduct = (data) =>  {

    const response =  axios.post('http://127.0.0.1:8000/api/product', data).then( 
    (response) => {
    
    return response;
      
    }).catch( 
    (error) => {
        return error;
    });

    return response;
}


export const  getProduct = async () => {

    const response = await axios.get('http://127.0.0.1:8000/api/product').then(
    (response) => {
        
        return response;
    }

    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}


export const  getProductDetail = async (id) => {

    const response = await axios.get(`http://127.0.0.1:8000/api/product/${id}`).then(
    (response) => {
        
        return response;
    }
    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}

export const updateProduct = (data,id) => {

    const response = axios.put(`http://127.0.0.1:8000/api/product/${id}`,data).then(
    (response) => {
        
        return response;
    }
    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}


export const DeleteProduct = (id) => {

    const response = axios.delete(`http://127.0.0.1:8000/api/product/${id}`).then(
    (response) => {
        
        return response;
    }
    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}


export const  getPurchaseCreate = async () => {

    const response = await axios.get('http://127.0.0.1:8000/api/purchase/create').then(
    (response) => {
        
        return response;
    }

    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}

export const insertPurchase = (data) => {
    const response =  axios.post('http://127.0.0.1:8000/api/purchase',data).then(
    (response) => {
        
        return response;
    }

    ).catch(
        (error) => {
            return error;
        }
    );

    return response;
}

export const GetPurchase = () => {

    const response =  axios.get('http://127.0.0.1:8000/api/purchase').then(
        (response) => {
            
            return response;
        }
    
        ).catch(
            (error) => {
                return error;
            }
        );
    
        return response;
}


export const getPurchaseDetail = async (id) => {

    const response = await axios.get(`http://127.0.0.1:8000/api/purchase/${id}/edit`).then(
    (response) => {
        
        return response;
    }
    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}

export const updatePurchase = (data,id) => {

    const response = axios.put(`http://127.0.0.1:8000/api/purchase/${id}`,data).then(
    (response) => {
        
        return response;
    }
    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}

export const DeletePurchase = (id) => {

    const response = axios.delete(`http://127.0.0.1:8000/api/purchase/${id}`).then(
    (response) => {
        
        return response;
    }
    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}


export const  getMenu = async () => {

    const response = await axios.get('http://127.0.0.1:8000/api/menus').then(
    (response) => {
        
        return response;
    }

    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}


export const insertMenu = async (data) => {
    const response =  await axios.post('http://127.0.0.1:8000/api/menus',data).then(
    (response) => {
        
        return response;
    }

    ).catch(
        (error) => {
            return error;
        }
    );

    return response;
}


export const getMenuDetail = async (id) => {

    const response = await axios.get(`http://127.0.0.1:8000/api/menus/${id}`).then(
    (response) => {
        
        return response;
    }
    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}


export const updateMenu = (data,id) => {

    const response = axios.put(`http://127.0.0.1:8000/api/menus/${id}`,data).then(
    (response) => {
        
        return response;
    }
    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}

export const DeleteMenu = (id) => {

    const response = axios.delete(`http://127.0.0.1:8000/api/menus/${id}`).then(
    (response) => {
        
        return response;
    }
    ).catch(
        (error) => {
            return error;
        }
    );

    return response;

}






