import React from 'react';
import { connect } from 'react-redux';
import './index.css';

class Footer extends React.Component {
  render() {
    const { minimized } = this.props;
    return (
      <footer className={`footer ${minimized ? 'footer-pd1' : ''}`}>
        <span>Copyright © 2015 - 2018 <strong>Spider Company Limited</strong>. All rights reserved.</span>
      </footer>
    );
  }
}
const mapStateToProps = (state) => ({
  minimized: state.minimized,
});

export default connect(
  mapStateToProps,
  null
)(Footer);

