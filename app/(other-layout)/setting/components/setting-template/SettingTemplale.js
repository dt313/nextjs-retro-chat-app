import { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useDispatch } from 'react-redux';

// import SettingItem from '../settingItem';
import Overlay from '@/components/overlay';
import SettingBox from '@/components/setting-box';

import { userService } from '@/services';

import { storageUtils } from '@/utils';

import { updateUser } from '@/redux/actions/auth-action';
import { FORGET_PASSWORD_BOX, openAuthBox } from '@/redux/actions/auth-box-action';
import { addToast } from '@/redux/actions/toast-action';

import SettingItem from '../setting-item';
import styles from './SettingTemplate.module.scss';

const cx = classNames.bind(styles);

function SettingTemplate({ list = [], headerText, desText }) {
    const [isOpenOverlay, setIsOpenOverlay] = useState(false);
    const [content, setContent] = useState({});
    const [editedName, setEditedName] = useState('');
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        setItems(list);
    }, [list]);

    const handleClickSettingItem = useCallback(
        (name) => {
            if (name === 'password') {
                dispatch(openAuthBox(FORGET_PASSWORD_BOX));
                return;
            }
            setIsOpenOverlay(true);
            setContent(items.find((item) => item.name === name));
        },
        [items],
    );

    useEffect(() => {
        if (editedName) {
            const timer = setTimeout(() => {
                setEditedName('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [editedName]);

    const changeItemsProperty = (value) => {
        setItems((pre) => {
            return pre.map((item) => {
                if (item.name === content.name) {
                    return {
                        ...item,
                        content: value,
                        box: { ...item.box, value },
                    };
                }
                return item;
            });
        });
    };

    const handleSubmit = async (type, value) => {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('value', value);

        try {
            setIsLoading(true);
            const res = await userService.updateProfile(formData);

            if (res) {
                storageUtils.setUser(res);
                dispatch(updateUser(res));
                changeItemsProperty(res[type]);
                setEditedName(content.name);
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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>{headerText}</h3>
                <p className={cx('des')}>{desText}</p>
            </div>

            <div className={cx('content')}>
                {items.map((item, index) => (
                    <SettingItem
                        key={index}
                        className={cx('item', editedName === item.name && 'edited')}
                        content={item}
                        isImage={item?.isImage}
                        isColor={item?.isColor}
                        onClick={handleClickSettingItem}
                    />
                ))}
            </div>

            {isOpenOverlay && (
                <Overlay state={isOpenOverlay} onClick={() => setIsOpenOverlay(false)}>
                    <SettingBox
                        onClose={() => setIsOpenOverlay(false)}
                        content={content.box}
                        onSubmit={handleSubmit}
                        large={content.isImage || content.isLarge}
                        isLoading={isLoading}
                    />
                </Overlay>
            )}
        </div>
    );
}

SettingTemplate.propTypes = {
    list: PropTypes.array,
    headerText: PropTypes.string,
    desText: PropTypes.string,
};

export default SettingTemplate;
