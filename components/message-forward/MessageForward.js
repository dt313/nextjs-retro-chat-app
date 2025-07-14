import { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useDebounce } from '@/hooks';
import { IoSearch } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

import { conversationService, messageService } from '@/services';

import { addToast } from '@/redux/actions/toast-action';

import CloseIcon from '../close-icon';
import ExtraDescription from '../extra-description';
import Icon from '../icon';
import Overlay from '../overlay';
import User from '../user';
import styles from './MessageForward.module.scss';

const cx = classNames.bind(styles);

function MessageForward({ messageId, messageType, onClose }) {
    const [list, setList] = useState([]);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const debounceValue = useDebounce(value, 1300);

    const dispatch = useDispatch();
    const fetchFriends = async (value) => {
        try {
            setIsLoading(true);
            const res = await conversationService.getForwardConversation(value);
            if (res) setList(res);
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchFriends(debounceValue);
    }, [debounceValue]);

    const handleForwardMessage = useCallback(
        async (id, isConversation) => {
            try {
                const res = await messageService.forwardMessage(messageId, {
                    id,
                    isConversation,
                    messageType: messageType === 'video' || messageType === 'audio' ? 'file' : messageType,
                });
                if (res) {
                    return true;
                }
                return false;
            } catch (error) {
                dispatch(
                    addToast({
                        type: 'error',
                        content: error.message,
                    }),
                );
                return false;
            }
        },
        [messageId],
    );

    const handleOnChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <Overlay className={cx('wrapper')} onClick={onClose}>
            <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('header')}>
                    <h4 className={cx('title')}>Chuyển tiếp</h4>
                    <CloseIcon className={cx('close-icon')} large onClick={onClose} />
                </div>

                <div className={cx('search')}>
                    <Icon className={cx('search-icon')} element={<IoSearch />} medium />
                    <input
                        className={cx('search-input')}
                        placeholder="Tìm kiếm bạn bè"
                        value={value}
                        onChange={handleOnChange}
                    />
                </div>

                <div className={cx('list')}>
                    {!isLoading
                        ? list.map((item) => {
                              return (
                                  <User
                                      key={item._id}
                                      type="forward"
                                      name={item.name}
                                      id={item._id}
                                      avatar={item.thumbnail}
                                      isGroup={item?.isGroup}
                                      isConversation={item?.isConversation}
                                      onClickForward={handleForwardMessage}
                                  />
                              );
                          })
                        : [1, 2].map((key) => <User.Skeleton key={key} />)}

                    {!isLoading && debounceValue && !list.length && (
                        <ExtraDescription>Không tìm thấy bạn bè</ExtraDescription>
                    )}

                    {!isLoading && !debounceValue && !list.length && (
                        <ExtraDescription>Không có bạn bè</ExtraDescription>
                    )}
                </div>
            </div>
        </Overlay>
    );
}

MessageForward.propTypes = {
    messageId: PropTypes.string.isRequired,
    messageType: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default MessageForward;
