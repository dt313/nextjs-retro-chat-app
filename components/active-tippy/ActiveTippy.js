import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react/headless';
import styles from './ActiveTippy.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
const cx = classNames.bind(styles);
function ActiveTippy({ children, tippy, ...props }) {
    const [visible, setVisible] = useState(false);
    return (
        <Tippy
            visible={visible}
            interactive
            onClickOutside={() => setVisible(false)}
            render={(attrs) => (
                <div className={cx('box')} tabIndex="-1" {...attrs}>
                    <div className={cx('container')} onClick={() => setVisible(false)}>
                        {tippy}
                    </div>
                </div>
            )}
            {...props}
        >
            <div className={cx('wrapper')} onClick={() => setVisible(true)}>
                {children}
            </div>
        </Tippy>
    );
}

ActiveTippy.propTypes = {
    children: PropTypes.node.isRequired,
    tippy: PropTypes.node.isRequired,
};

export default ActiveTippy;
