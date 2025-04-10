import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Image.module.scss';
import images from '@/assets/images';
import Image from 'next/image';

const cx = classNames.bind(styles);

function AImage({ src, alt = 'default', className, fallback = images.noImage, ...props }) {
    const classes = cx('wrapper', {
        [className]: className,
    });

    // fallback khi ảnh lỗi
    const handleError = (e) => {
        e.target.src = fallback;
    };

    return <Image className={classes} src={src || fallback} alt={alt} onError={handleError} {...props} />;
}

AImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
};

export default AImage;
