import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import { useDispatch, useSelector } from 'react-redux';

import { groupService, userService } from '@/services';

import { addToast } from '@/redux/actions/toast-action';

import { GroupItem, ItemLoading, UserItem } from '../item';
import styles from './List.module.scss';

const cx = classNames.bind(styles);

function List({ id, tag, type }) {
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user: me } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAPI = async () => {
            try {
                setIsLoading(true);
                let result = [];
                if (type === 'user' && tag === 'friends') {
                    result = await userService.getFriendsByUserId(id);
                }

                if (type === 'user' && tag === 'groups') {
                    result = await groupService.getGroupByUserId(id);
                }

                if (type === 'group' && tag === 'members') {
                    result = await groupService.getMembersOfGroupInProfile(id);
                }
                if (Array.isArray(result)) {
                    setList(result);
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

        fetchAPI();
    }, [tag, type, id]);

    return (
        <div className={cx('wrapper')}>
            {!isLoading
                ? list.length > 0 &&
                  list.map((item) => {
                      if (tag === 'groups') {
                          return (
                              <GroupItem
                                  key={item._id}
                                  id={item._id}
                                  avatar={item.thumbnail}
                                  name={item.name}
                                  isParticipant={item.isMember}
                                  isInvitedByOther={item.isInvited}
                                  isOwner={me._id === item.createdBy}
                                  isPrivate={item.isPrivate}
                              />
                          );
                      }
                      return (
                          <UserItem
                              key={item._id}
                              id={type === 'user' ? item._id : item.user._id}
                              avatar={type === 'user' ? item.avatar : item.user.avatar}
                              name={type === 'user' ? item?.fullName : item.user.fullName}
                              username={type === 'user' ? item.username : item.user.username}
                              isFriend={item.isFriend}
                              isRequestByMe={item.isFriendRequestedByMe}
                              isRequestByOther={item.isFriendRequestedByOther}
                              isMe={type === 'user' ? me._id === item._id : me._id === item.user._id}
                              role={item?.role}
                          />
                      );
                  })
                : [1, 2, 3].map((key) => {
                      return <ItemLoading key={key} />;
                  })}
        </div>
    );
}

export default List;
