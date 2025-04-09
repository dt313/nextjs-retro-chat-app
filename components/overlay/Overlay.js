import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Overlay.module.scss';

const cx = classNames.bind(styles);

function Overlay({ children, onClick, nonBackdrop = false, className }) {
    const classes = {
        [className]: className,
        nonBackdrop,
    };

    return (
        <div className={cx('wrapper', classes)} onClick={onClick}>
            {children}
        </div>
    );
}

Overlay.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    nonBackdrop: PropTypes.bool,
    className: PropTypes.string,
};
export default Overlay;
