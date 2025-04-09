import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Dropdown.module.scss';
import { useClickOutside } from '@/hooks';

const cx = classNames.bind(styles);

function Dropdown({ children, content, position = 'center' }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useClickOutside(() => {
        setIsOpen(false);
    });

    return (
        <div className={cx('wrapper')} ref={ref}>
            <div className={cx('children')} onClick={() => setIsOpen(true)}>
                {children}
            </div>
            <div className={cx('dropbox', position, isOpen ? 'show' : 'hide')}>
                {content}
                <span className={cx('triangle')}></span>
            </div>
        </div>
    );
}

Dropdown.propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    position: PropTypes.string,
};

export default Dropdown;
