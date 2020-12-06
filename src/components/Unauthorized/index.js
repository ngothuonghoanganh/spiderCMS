import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div className="container d-flex" style={{ height: '100vh' }}>
    <div className="col-md-12 align-self-center p-0">
      <div className="card card-401 text-center rounded-0">
        <div className="card-header">
          <strong className="text-uppercase text-danger">Error 401: Unauthorized</strong>
        </div>
        <div className="card-body">
          <h5 className="card-title">The page you have requested can not authorized.</h5>
          <p className="card-text">Please check the credentials that you supplied</p>
          <Link to="/signin" className="btn btn-orange">Return to Sign in</Link>
        </div>
      </div>
    </div>
  </div>
);
export default Unauthorized;
