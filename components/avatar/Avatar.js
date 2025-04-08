import classNames from 'classnames/bind';
import styles from './Avatar.module.scss';
import AImage from '@/components/image';
import PropTypes from 'prop-types';
import images from '@/assets/images';

const cx = classNames.bind(styles);

function Avatar({ src, className, size = 60, fallback = images.noUser, ...props }) {
    const classes = cx('wrapper', {
        [className]: className,
    });
    return (
        <AImage
            className={classes}
            src={src}
            fallback={fallback}
            {...props}
            style={{ width: `${size}px`, height: `${size}px` }}
        />
    );
}

Avatar.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    fallback: PropTypes.string,
};
export default Avatar;
