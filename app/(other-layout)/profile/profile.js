import classNames from 'classnames/bind';
import styles from './profile.module.scss';
import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import { FiUserPlus } from 'react-icons/fi';
import { FaFacebookMessenger } from 'react-icons/fa';
import { BsQrCode } from 'react-icons/bs';
import Squares from '@/components/squares';

const cx = classNames.bind(styles);

function Profile() {
    return (
        <div className={cx('wrapper')}>
            <Squares
                className={cx('squares-br')}
                speed={0}
                squareSize={200}
                direction="diagonal" // up, down, left, right, diagonal
                borderColor="#ede0d0"
                hoverFillColor="#b54c37"
            />
            <div className={cx('container')}>
                <div className={cx('profile')}>
                    <div className={cx('header')}>
                        <Avatar size={150} className={cx('avatar')} />
                    </div>

                    <div className={cx('info')}>
                        <h1 className={cx('name')}>John Doe</h1>
                        <p className={cx('description')}>Web Developer - Web Designer - New York City , USA</p>
                    </div>

                    <div className={cx('statistics')}>
                        <div className={cx('statistic-item')}>
                            <span className={cx('value')}>23</span>
                            <span className={cx('label')}>Connections</span>
                        </div>
                        <div className={cx('statistic-item')}>
                            <span className={cx('value')}>35</span>
                            <span className={cx('label')}>Friends</span>
                        </div>
                        <div className={cx('statistic-item')}>
                            <span className={cx('value')}>52</span>
                            <span className={cx('label')}>Groups</span>
                        </div>
                    </div>

                    <div className={cx('actions')}>
                        <button className={cx('action-button')}>
                            <Icon element={<FaFacebookMessenger />} />
                            <span className={cx('button-text')}>Chat</span>
                        </button>
                        <button className={cx('action-button')}>
                            <Icon element={<FiUserPlus />} />
                            <span className={cx('button-text')}>Add Friend</span>
                        </button>
                        <button className={cx('action-button')}>
                            <Icon element={<BsQrCode />} />
                            <span className={cx('button-text')}>QR</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
