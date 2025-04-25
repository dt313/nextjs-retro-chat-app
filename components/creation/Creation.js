import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Creation.module.scss';
import Overlay from '@/components/overlay';
import Input from '@/components/input';
import SubmitButton from '@/components/auth-with-password/SubmitButton';
import CloseIcon from '@/components/close-icon';
import InputWithList from '@/components/input-with-list';
import { types, users, groups } from '@/config/ui-config';
import User from '@/components/user';
import Group from '@/components/group';
import { conversationService } from '@/services';
import { useRouter } from 'next/navigation';
const cx = classNames.bind(styles);

function Creation({ onClose }) {
    const [group, setGroup] = useState({
        name: '',
        type: '',
        description: '',
        rule: '',
    });

    const [activeTab, setActiveTab] = useState('user');
    const [list, setList] = useState([]);

    const router = useRouter();

    useEffect(() => {
        setList(activeTab === 'user' ? users : groups);
    }, [activeTab]);

    const handleChange = (e) => {
        setGroup({ ...group, [e.target.name]: e.target.value });
    };

    const handleSelectType = (item) => {
        setGroup({ ...group, type: item.name });
    };

    const handleCreate = async () => {
        const res = await conversationService.create({ ...group, isGroup: true });
        const { _id } = res;

        if (_id) {
            window.location.href = `/message/${_id}`;
        }
    };

    return (
        <Overlay>
            <div className={cx('wrapper')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('l-side')}>
                    <h3 className={cx('ls-title')}>Create a new group</h3>
                    <div className={cx('ls-content')}>
                        <Input
                            className={cx('ls-input')}
                            name="name"
                            value={group.name}
                            onChange={handleChange}
                            label="Group name"
                            placeholder="Group name"
                        />
                        <InputWithList
                            className={cx('ls-input')}
                            label="Type"
                            name="type"
                            placeholder="Type of group"
                            list={types}
                            value={group.type}
                            onChange={handleChange}
                            onSelect={handleSelectType}
                        />

                        <Input
                            inputType="textarea"
                            className={cx('ls-input')}
                            name="description"
                            value={group.description}
                            onChange={handleChange}
                            label="Giới thiệu"
                            placeholder="Giới thiệu về nhóm"
                        />

                        <Input
                            inputType="textarea"
                            className={cx('ls-input')}
                            name="rule"
                            value={group.rule}
                            onChange={handleChange}
                            label="Nội quy"
                            placeholder="Nội quy của nhóm"
                        />
                        <SubmitButton onClick={handleCreate}>Create</SubmitButton>
                    </div>
                </div>

                <div className={cx('r-side')}>
                    <div className={cx('r-side-header')}>
                        <span
                            className={cx('rh-item', { active: activeTab === 'user' })}
                            onClick={() => setActiveTab('user')}
                        >
                            User
                        </span>
                        <span
                            className={cx('rh-item', { active: activeTab === 'group' })}
                            onClick={() => setActiveTab('group')}
                        >
                            Group
                        </span>
                    </div>
                    <div className={cx('r-side-content')}>
                        {list.map((item) => {
                            if (activeTab === 'user') {
                                return <User key={item.id} {...item} />;
                            }
                            return <Group key={item.id} {...item} />;
                        })}
                    </div>
                </div>

                <CloseIcon className={cx('close-icon')} large onClick={onClose} />
            </div>
        </Overlay>
    );
}

export default Creation;
