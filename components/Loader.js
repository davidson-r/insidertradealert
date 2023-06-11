import React from 'react';

const Loader = () => {
    return (
        <div style={{display:'flex',
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center',
        minHeight:'70vh'
        }}>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    );
};

export default Loader;