import React from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import styles from './ToggleSwitch.module.scss';

const cx = classNames.bind(styles);

/*
Toggle Switch Component
Note: id, checked and onChange are required for ToggleSwitch component to function.
The props name, small, disabled and optionLabels are optional.
Usage: <ToggleSwitch id="id" checked={value} onChange={checked => setValue(checked)}} />
*/

const ToggleSwitch = ({ id, name, checked, onChange, optionLabels = ['Yes', 'No'], small, disabled }) => {
    return (
        <div className={cx('toggle-switch', small && ' small-switch')}>
            <input
                type="checkbox"
                name={name}
                className={cx('toggle-switch-checkbox')}
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            {id ? (
                <label className={cx('toggle-switch-label')} htmlFor={id}>
                    <span
                        className={cx(disabled ? 'toggle-switch-inner toggle-switch-disabled' : 'toggle-switch-inner')}
                        data-yes={optionLabels[0]}
                        data-no={optionLabels[1]}
                    />
                    <span
                        className={cx(
                            disabled ? 'toggle-switch-switch toggle-switch-disabled' : 'toggle-switch-switch',
                        )}
                    />
                </label>
            ) : null}
        </div>
    );
};

// Set optionLabels for rendering.
ToggleSwitch.defaultProps = {
    optionLabels: ['Yes', 'No'],
};

ToggleSwitch.propTypes = {
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
    optionLabels: PropTypes.array,
    small: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default ToggleSwitch;
