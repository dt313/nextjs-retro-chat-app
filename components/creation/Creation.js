'use client';

import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { types } from '@/config/ui-config';
import { throttle } from 'lodash';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import SubmitButton from '@/components/auth-with-password/SubmitButton';
import CloseIcon from '@/components/close-icon';
import ImageInput from '@/components/image-input';
import Input from '@/components/input';
import InputWithList from '@/components/input-with-list';
import Overlay from '@/components/overlay';
import ToggleSwitch from '@/components/toggle-switch';

import { conversationService } from '@/services';

import Validation from '@/utils/input-validation';

import { addToast } from '@/redux/actions/toast-action';

import { SpinnerLoader } from '../loading';
import styles from './Creation.module.scss';

const cx = classNames.bind(styles);

function Creation({ onClose }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [group, setGroup] = useState({
        name: '',
        thumbnail: '',
        type: '',
        description: '',
        rules: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        thumbnail: '',
        type: '',
        description: '',
        rules: '',
        password: '',
    });

    const [buttonDisable, setButtonDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // const [activeTab, setActiveTab] = useState('user');
    // const [list, setList] = useState([]);

    const router = useRouter();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     setList(activeTab === 'user' ? users : groups);
    // }, [activeTab]);

    const handleChange = (e) => {
        if (e.target.name === 'thumbnail') {
            const file = e.target.files[0];
            setGroup({ ...group, thumbnail: file });
            return;
        }
        setGroup({ ...group, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSelectType = (item) => {
        setGroup({ ...group, type: item.name });
        setErrors({ ...errors, type: '' });
    };

    const handleCreate = async () => {
        if (isLoading) return;
        try {
            setIsLoading(true);
            const formData = new FormData();
            if (group.thumbnail) formData.append('thumbnail', group.thumbnail);
            formData.append('name', group.name);
            formData.append('type', group.type);
            formData.append('description', group.description);
            formData.append('rules', group.rules);
            formData.append('password', group.password);

            const res = await conversationService.createGroupConversation(formData);
            const { _id } = res;

            if (_id) {
                onClose();
                router.push(`/conversation/${_id}`);
            }
        } catch (error) {
            dispatch(
                addToast({
                    type: 'error',
                    content: error.message,
                }),
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';

        switch (name) {
            case 'name':
                errorMessage = Validation({
                    value,
                    rules: [Validation.isRequired(), Validation.minLetter(4)],
                });
                break;

            case 'type':
                errorMessage = Validation({
                    value,
                    rules: [Validation.isRequired(), Validation.minLetter(2), Validation.minLetterEachWord(2)],
                });
                break;

            case 'description':
                errorMessage = Validation({
                    value,
                    rules: [Validation.maxLength(150)],
                });
                break;

            case 'rules':
                errorMessage = Validation({
                    value,
                    rules: [Validation.maxLength(1000)],
                });
                break;
            case 'password':
                errorMessage = Validation({
                    value,
                    rules: [Validation.isRequired(), Validation.minLetter(4), Validation.maxLength(4)],
                });
                break;
            default:
                break;
        }

        setErrors({
            ...errors,
            [name]: errorMessage,
        });
    };

    useEffect(() => {
        const errorName = Validation({
            value: group.name,
            rules: [Validation.isRequired(), Validation.minLetter(4)],
        });

        const errorType = Validation({
            value: group.type,
            rules: [Validation.isRequired(), Validation.minLetter(2), Validation.minLetterEachWord(2)],
        });

        const errorDescription = Validation({
            value: group.description,
            rules: [Validation.maxLength(150)],
        });

        const errorRule = Validation({
            value: group.rules,
            rules: [Validation.maxLength(1000)],
        });

        const errorPassword = Validation({
            value: group.password,
            rules: [Validation.isRequired(), Validation.minLetter(4), Validation.maxLength(4)],
        });

        if (isPasswordVisible) {
            setButtonDisable(!!(errorName || errorDescription || errorType || errorRule || errorPassword));
        } else {
            setButtonDisable(!!(errorName || errorDescription || errorType || errorRule));
        }
    }, [group]);

    return (
        <Overlay>
            <div className={cx('wrapper')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('l-side')}>
                    <h3 className={cx('ls-title')}>Tạo nhóm</h3>
                    <div className={cx('ls-content')}>
                        <ImageInput
                            className={cx('image-input')}
                            value={group.thumbnail}
                            name="thumbnail"
                            onChange={handleChange}
                        />
                        <Input
                            className={cx('ls-input')}
                            name="name"
                            value={group.name}
                            onChange={handleChange}
                            label="Tên nhóm *"
                            placeholder="Tên nhóm"
                            onBlur={handleBlur}
                            errorMessage={errors.name}
                        />
                        <InputWithList
                            className={cx('ls-input')}
                            label="Chủ đề *"
                            name="type"
                            placeholder="Chủ đề của nhóm"
                            onBlur={handleBlur}
                            errorMessage={errors.type}
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
                            onBlur={handleBlur}
                            errorMessage={errors.description}
                        />
                        <Input
                            inputType="textarea"
                            className={cx('ls-input')}
                            name="rules"
                            value={group.rules}
                            onChange={handleChange}
                            label="Nội quy"
                            placeholder="Nội quy của nhóm"
                            onBlur={handleBlur}
                            errorMessage={errors.rules}
                        />
                        <div className={cx('password-option')}>
                            <ToggleSwitch
                                small
                                id="toggleSwitch"
                                checked={isPasswordVisible}
                                onChange={() => {
                                    setIsPasswordVisible(!isPasswordVisible);
                                    setGroup({ ...group, password: '' });
                                    setErrors({ ...errors, password: '' });
                                }}
                            />
                            <span className={cx('toggle-label')}>Thiết lập mật khẩu</span>
                        </div>
                        {isPasswordVisible && (
                            <Input
                                className={cx('ls-input')}
                                name="password"
                                value={group.password}
                                onChange={handleChange}
                                label="Mật khẩu *"
                                placeholder="Nhập mật khẩu"
                                type="password"
                                onBlur={handleBlur}
                                errorMessage={errors.password}
                            />
                        )}
                        <SubmitButton onClick={handleCreate} disable={buttonDisable}>
                            {isLoading ? <SpinnerLoader small /> : 'Tạo'}
                        </SubmitButton>
                    </div>
                </div>
                {/* 
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
                </div> */}

                <CloseIcon className={cx('close-icon')} large onClick={onClose} />
            </div>
        </Overlay>
    );
}

Creation.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default Creation;
