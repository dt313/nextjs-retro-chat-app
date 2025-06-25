import classNames from 'classnames/bind';

import { redirect } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';
import { RiArrowLeftSLine } from 'react-icons/ri';

import Avatar from '@/components/avatar';
import Icon from '@/components/icon';

import styles from './ConversationHeader.module.scss';

const cx = classNames.bind(styles);

function ConversationHeader({ thumbnail, name, status, onlineCount, isGroup, onClickDotIcon, ...props }) {
    const handleClickRedirectToSideBar = () => {
        redirect('/conversation');
    };
    return (
        <div className={cx('c-header')} {...props}>
            <Icon
                className={cx('c-close-btn')}
                element={<RiArrowLeftSLine />}
                onClick={handleClickRedirectToSideBar} // on mobile
            />
            <div className={cx('user-info')}>
                <Avatar src={thumbnail} className={cx('h-avatar')} size={44} />
                <div className={cx('user-info-text')}>
                    <strong className={cx('user-name')}>{name}</strong>

                    <div
                        className={cx('user-status', {
                            online: !isGroup ? status : onlineCount > 0,
                        })}
                    >
                        {!isGroup
                            ? status
                                ? 'Đang hoạt động'
                                : 'Không hoạt động'
                            : onlineCount > 0
                              ? `${onlineCount} người đang hoạt động`
                              : 'Không có ai hoạt động'}
                    </div>
                </div>
            </div>
            <Icon className={cx('dots-icon')} element={<BsThreeDots />} onClick={onClickDotIcon} />
        </div>
    );
}

export default ConversationHeader;
