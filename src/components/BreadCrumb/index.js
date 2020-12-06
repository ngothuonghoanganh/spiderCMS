import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './index.css';
import routes from '../../routes';

const Breadcrumbs = ({ breadcrumbs }) => (
  <nav aria-label="breadcrumb">
    <ol className="breadcrumb my-breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        <li className="breadcrumb-item" key={breadcrumb.key}>
          <NavLink to={breadcrumb.props.match.url}>
            {breadcrumb}
          </NavLink>
          {(index < breadcrumbs.length - 1)}
        </li>
      ))}
    </ol>
  </nav>
);
Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array,
};
export default withBreadcrumbs(routes, { disableDefaults: true })(Breadcrumbs);
