import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { GoPlusCircle } from 'react-icons/go';

import Avatar from '@/components/avatar';
import Icon from '@/components/icon';

import styles from './Group.module.scss';

const cx = classNames.bind(styles);

function Group({ thumbnail, name, memberCount, id }) {
    return (
        <div className={cx('wrapper')}>
            <Avatar size={40} src={thumbnail} />
            <div className={cx('info')}>
                <span className={cx('name')}>{name}</span>
                <span className={cx('count')}>{memberCount} members</span>
            </div>

            <div className={cx('action')}>
                {/* <Icon className={cx('action-icon')} element={<FaFacebookMessenger />} /> */}
                <Icon className={cx('action-icon')} element={<GoPlusCircle />} />
            </div>
        </div>
    );
}

Group.propTypes = {
    thumbnail: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    memberCount: PropTypes.number.isRequired,
    id: PropTypes.string,
};

export default Group;
