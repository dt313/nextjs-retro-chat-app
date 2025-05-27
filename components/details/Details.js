import { memo, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import Icon from '../icon';
import styles from './Details.module.scss';

const cx = classNames.bind(styles);

function Details({ label, children, className }) {
    const [isOpen, setIsOpen] = useState(false);

    const classes = cx('wrapper', {
        [className]: className,
    });

    return (
        <div className={classes}>
            <div className={cx('header')} onClick={() => setIsOpen(!isOpen)}>
                <strong className={cx('label')}>{label}</strong>
                <Icon
                    className={cx('icon', isOpen ? 'open-icon' : 'close-icon')}
                    element={isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    medium
                />
            </div>

            {isOpen && <div className={cx('summary')}>{children}</div>}
        </div>
    );
}

Details.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default memo(Details);
