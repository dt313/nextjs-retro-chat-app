'use client';

import { Suspense, useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { useDebounce } from '@/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import InputSearch from '@/components/input-search';
import { SpinnerLoader } from '@/components/loading';
import { GroupCard, UserCard } from '@/components/search-card';

import { groupService, userService } from '@/services';

import { newConversation } from '@/redux/actions/conversations-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './search.module.scss';

const cx = classNames.bind(styles);

function SearchContent() {
    const searchParams = useSearchParams();
    const { user: me } = useSelector((state) => state.auth);

    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
    const [filterValue, setFilterValue] = useState(searchParams.get('filter') || 'user');
    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState([]);

    const debounceValue = useDebounce(searchValue, 1300);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleSortConversation = (conversation) => {
            dispatch(newConversation({ conversation, meId: me._id }));
        };

        eventBus.on('last-conversation', handleSortConversation);
        return () => {
            eventBus.off('last-conversation', handleSortConversation);
        };
    }, [list]);

    const fetchAPI = async (type) => {
        try {
            setIsLoading(true);
            if (type === 'user') {
                const res = await userService.getUsers(searchValue);
                const users = res.filter((user) => user._id !== me._id);

                setList(users);
            } else if (type === 'group') {
                const res = await groupService.getGroups(searchValue);
                setList(res);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAPI(filterValue);
    }, [filterValue, debounceValue]);

    function changeSearchParams(q, filter) {
        const params = new URLSearchParams();

        if (q) {
            params.set('q', q.toString().trim() || '');
        }

        if (filter) {
            params.set('filter', filter.toString().trim());
        }

        router.replace(`/search?${params.toString()}`);
    }

    const handleChangeSearchValue = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        changeSearchParams(value, filterValue);
    };

    useEffect(() => {
        const queryValue = searchParams.get('q')?.toString().trim();
        const filterType = searchParams.get('filter')?.toString().trim() || 'user';
        setSearchValue(queryValue || '');
        setFilterValue(filterType);
        changeSearchParams(queryValue, filterType);
    }, []);

    const handleChangeFilterValue = (value) => {
        setFilterValue(value);
        changeSearchParams(searchValue, value);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1 className={cx('title')}>
                        Tìm kiếm bạn bè, nhóm chat trong <strong className={cx('title-strong')}>Retro</strong>
                    </h1>
                    <div className={cx('search-input')}>
                        <InputSearch placeholder="Search" value={searchValue} onChange={handleChangeSearchValue} />
                    </div>
                </div>
                <div className={cx('filter')}>
                    <span
                        className={cx('filter-item', filterValue === 'user' && 'active')}
                        onClick={() => handleChangeFilterValue('user')}
                    >
                        Cá nhân
                    </span>
                    <span
                        className={cx('filter-item', filterValue === 'group' && 'active')}
                        onClick={() => handleChangeFilterValue('group')}
                    >
                        Nhóm chat
                    </span>
                </div>

                <div className={cx('list')}>
                    {!isLoading
                        ? list.map((item) => {
                              if (filterValue === 'user') {
                                  return (
                                      <UserCard
                                          key={item._id}
                                          id={item._id}
                                          slug={item.username}
                                          name={item.fullName}
                                          email={item.email}
                                          avatar={item.avatar}
                                          isFriendRequestByMe={item.isFriendRequestedByMe}
                                          isFriendRequestByOther={item.isFriendRequestedByOther}
                                          isFriend={item.isFriend}
                                          createdAt={item.createdAt}
                                      />
                                  );
                              }
                              if (filterValue === 'group') {
                                  return (
                                      <GroupCard
                                          key={item._id}
                                          id={item._id}
                                          name={item.name}
                                          createdAt={item.createdAt}
                                          members={item.participants?.length}
                                          thumbnail={item.thumbnail}
                                          isJoined={item.isJoined}
                                          isPrivate={item.isPrivate}
                                          participants={item.participants}
                                          isInvited={item.isInvited}
                                      />
                                  );
                              }
                          })
                        : [1, 2, 3, 4].map((key) => <UserCard.Skeleton key={key} />)}
                </div>
            </div>
        </div>
    );
}

export default function Search() {
    return (
        <Suspense
            fallback={
                <div className={cx('loader')}>
                    <SpinnerLoader />
                </div>
            }
        >
            <SearchContent />
        </Suspense>
    );
}
