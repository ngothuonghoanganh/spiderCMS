import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import spider from "../../assets/img/spider-logo.png";
import "./index.css";

class InfoCard extends React.PureComponent {
  render() {
    const { title, description, detail } = this.props;
    return (
      <div className="container d-flex" style={{ height: "100vh" }}>
        <div className="col-md-12 align-self-center p-0">
          <div className="w-form mx-auto">
            <div
              className="card text-center p-2 rounded-0"
              style={{ borderTop: "3px solid #f50" }}
            >
              <div className="card-body">
                <img alt="Spider" src={spider} width="75" height="75" />
                <h1 className="co-name">Spider</h1>
                <h2 className="mt-2 splash-title">{title}</h2>
                <span className="card-text mb-0 splash-description">
                  {description}
                </span>
                <span className="card-text mb-3 splash-description">
                  {detail}
                </span>
                <Link to="/signin" className="btn btn-orange">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
InfoCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  detail: PropTypes.string
};
export default InfoCard;
