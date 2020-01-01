import PropTypes from "prop-types";

const {func, number, object} = PropTypes;

export const defaultProps = {
  charge: null,
  error: null
};

export const propTypes = {
  charge: object,
  error: object,
  payStart: func.isRequired,
  price: number.isRequired
};
