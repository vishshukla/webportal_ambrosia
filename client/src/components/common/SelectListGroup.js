import React from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types';
const SelectListGroup = ({
  name,
  value,
  error,
  info,
  options,
}) => {
  //THE MAP ERROR ON THE LEFT
  const selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));
  return (
    <div className="form-group">
      <select
        className={classnames('form-control form-control-md', {
          'is-invalid': error
        })}
        name={name}
        value={value}
      > {selectOptions} </select>
      {info && <small className=""> {info}</small>}
      {error && (<div className="invalid-feedback" > {error}</div>
      )}

    </div>
  )
}

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.array.isRequired
}

export default SelectListGroup;