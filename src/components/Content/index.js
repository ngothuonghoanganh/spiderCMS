import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import './index.css';
import BreadCrumb from '../BreadCrumb';
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import routes from '../../routes';
import Header from '../Header';
import { getItemLocalStore } from '../../utils/handleLocalStore';
class Content extends React.Component {
  showContentMenus() {
    let result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.main}
        />
      ));
    }
    return <Switch> {result} </Switch>;
  }
  render() {
    const { visible, minimized, theme, logInResult } = this.props;
    const token = getItemLocalStore('token');
    if (!logInResult && !token) {
      return <Redirect to="/signin" />;
    }
    return (
      <div>
        <Header />
        <div className={`container-fluid ${theme}`}>
          <div className={`row ${minimized ? 'minimized' : ''}`}>
            <Sidebar />
            <main className={`ml-sm-auto p-0 ${!visible ? 'active' : ''}`}>
              <BreadCrumb />
              {this.showContentMenus(routes)}
            </main>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
Content.defaultProps = {
  logInResult: '',
};
Content.propTypes = {
  visible: PropTypes.bool,
  minimized: PropTypes.bool,
  theme: PropTypes.string,
  logInResult: PropTypes.any,
};
const mapStateToProps = (state) => ({
  visible: state.visible,
  minimized: state.minimized,
  logInResult: state.logInResult.login,
  theme: state.theme,
});

export default withRouter(connect(mapStateToProps, null)(Content));
