import PropsType from 'prop-types';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './Image.module.scss';
import images from '@/assets/images';

const cx = classNames.bind(styles);

function AImage({ src, alt = 'default', className, fallback = images.noImage, ...props }) {
    const classes = cx('wrapper', {
        [className]: className,
    });

    return <Image className={classes} src={src || fallback} alt={alt} {...props} />;
}

AImage.propTypes = {
    src: PropsType.string.isRequired,
    className: PropsType.string,
    fallback: PropsType.string,
};
export default AImage;
