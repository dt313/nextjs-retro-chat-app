import { Fragment } from 'react';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import Avatar from '../avatar/Avatar';

const cx = classNames.bind(styles);

function Message({ children, className, isSender }) {
    const classes = cx('wrapper', {
        [className]: className,
        isSender,
    });

    const formattedContent = children.split('\n').map((line, index) => (
        <Fragment key={index}>
            {line}
            <br />
        </Fragment>
    ));

    return (
        <div className={classes}>
            <div className={cx('message')}>
                {!isSender && <Avatar className={cx('avatar')} size={36} />}
                <p className={cx('m-content')}>{formattedContent}</p>
            </div>
        </div>
    );
}

export default Message;
