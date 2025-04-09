import classNames from 'classnames/bind';
import styles from './RightMessage.module.scss';
import Avatar from '../avatar';
import Information from '../information';
import Details from '../details';
import AttachImages from '../attach-images';
const cx = classNames.bind(styles);

const INFORMATION = [
    {
        name: 'email',
        content: 'danhtuan3103@gmail.com',
    },
    {
        name: 'phone number',
        content: '01048976769',
    },
];

function RightMessage({ hide }) {
    return (
        <div className={cx('wrapper', hide && 'hide')}>
            <div className={cx('header')}>
                <Avatar className={cx('avatar')} size={96} />
                <h4 className={cx('name')}>Danh Tuan</h4>
            </div>

            <div className={cx('information')}>
                {INFORMATION.map((inf, index) => {
                    return <Information key={index} label={inf.name} content={inf.content} />;
                })}
            </div>

            <div className={cx('attachments')}>
                <Details label="chat setting">
                    Ad dolor ex est laborum incididunt quis excepteur. Laborum sunt laborum adipisicing consectetur esse
                    culpa laborum laborum mollit ipsum. Magna aliqua pariatur anim quis fugiat pariatur laborum minim.
                </Details>
                <Details label="File, Attachment">
                    Ad dolor ex est laborum incididunt quis excepteur. Laborum sunt laborum adipisicing consectetur esse
                    culpa laborum laborum mollit ipsum. Magna aliqua pariatur anim quis fugiat pariatur laborum minim.
                </Details>
                <Details label="Images">
                    <AttachImages />
                </Details>
            </div>
        </div>
    );
}

export default RightMessage;
