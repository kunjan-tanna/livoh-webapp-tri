import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => (
    <div className="page-loader d-flex justify-content-center mb-30" style={{
        position:"fixed",
        left: "0px",
        top: "50%",
        width: "100%",
        height: "100%",
        zIndex: "9999"}} >
        <CircularProgress />
    </div>
);

export default Loader;
