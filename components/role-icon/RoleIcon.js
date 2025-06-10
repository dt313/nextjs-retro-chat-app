import classNames from 'classnames/bind';

import { ADMIN, OWNER } from '@/helpers/conversation-info';

import styles from './RoleIcon.module.scss';

const cx = classNames.bind(styles);
export default function RoleIcon({ role }) {
    switch (role) {
        case OWNER:
            return <span className={cx('role-icon')}>👑</span>;
        case ADMIN:
            return <span className={cx('role-icon')}>⚙️</span>;
        default:
            return;
    }
}
