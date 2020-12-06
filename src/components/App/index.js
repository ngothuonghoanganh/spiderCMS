import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Content from '../Content';
import Register from '../../containers/Register';
import Login from '../../containers/Login';
import Forgot from '../../containers/ForgotPassword';
import './index.css';
import './responsive.css';
import UpdatePassword from '../../containers/UpdatePassword';
import ActiveSuccess from '../ActiveSuccess';
import RegisterSuccess from '../RegisterSuccess';
import Curriculum from '../../containers/Curriculum';
import NotFound from '../NotFound';
import Unauthorized from '../Unauthorized';
class App extends React.Component {
  render() {
    const { checkForgot } = this.props;
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/signup" component={Register} />
          <Route path="/signin" component={Login} />
          <Route path="/active-success" component={ActiveSuccess} />
          <Route path="/register-success" component={RegisterSuccess} />
          <Route path="/curriculum/:id" component={({ match, history }) => <Curriculum match={match} history={history} />} />
          <Route path="/forgot" component={Forgot} />
          {checkForgot &&
            <Route exact path="/update-account" component={UpdatePassword} />
          }
          <Route exact path="/error-401" component={Unauthorized} />
          <Route
            path="/"
            render={(props) => (
              <React.Fragment>
                <Content {...props} />
              </React.Fragment>
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  checkForgot: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  checkForgot: state.checkForgot.isTrue,
});
export default connect(mapStateToProps, null)(App);
