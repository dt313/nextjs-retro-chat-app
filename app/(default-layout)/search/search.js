'use client';

import { Suspense, useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import { useDebounce } from '@/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import InputSearch from '@/components/input-search';
import { SpinnerLoader } from '@/components/loading';
import { GroupCard, UserCard } from '@/components/search-card';

import { groupService, userService } from '@/services';

import { addToast } from '@/redux/actions/toast-action';

import styles from './search.module.scss';

const cx = classNames.bind(styles);
const LIMIT_ITEM = 30;

function SearchContent() {
    const searchParams = useSearchParams();
    const { user: me } = useSelector((state) => state.auth);

    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
    const [filterValue, setFilterValue] = useState(searchParams.get('filter') || 'user');
    const [page, setPage] = useState(1);
    const lastElement = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [isFinish, setIsFinish] = useState(false);
    const [list, setList] = useState([]);

    const debounceValue = useDebounce(searchValue, 1300);
    const router = useRouter();
    const dispatch = useDispatch();

    const fetchAPI = async (type, q, pageNum = 1) => {
        try {
            if (pageNum === 1) {
                setIsLoading(true);
            } else {
                setIsLoadMore(true);
            }

            if (type === 'user') {
                const res = await userService.getUsers(q, pageNum);
                const users = res.filter((user) => user._id !== me._id);

                if (pageNum === 1) {
                    setList(users);
                } else {
                    setList((prev) => [...prev, ...users]);
                }

                if (users.length < LIMIT_ITEM) {
                    setIsFinish(true);
                } else {
                    setIsFinish(false);
                }
            } else if (type === 'group') {
                const res = await groupService.getGroups(q, pageNum);

                if (pageNum === 1) {
                    setList(res);
                } else {
                    setList((prev) => [...prev, ...res]);
                }

                if (res.length < LIMIT_ITEM) {
                    setIsFinish(true);
                } else {
                    setIsFinish(false);
                }
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
            setIsLoadMore(false);
        }
    };

    // useEffect(() => {
    //     fetchAPI(filterValue, debounceValue);
    // }, [filterValue, debounceValue]);

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

    useEffect(() => {
        if (debounceValue || filterValue) {
            setPage(1);
            setIsFinish(false);
            setList([]);
            fetchAPI(filterValue, debounceValue, 1);
        }
    }, [filterValue, debounceValue]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && !isLoadMore && !isFinish && list.length > 0) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchAPI(filterValue, searchValue, nextPage);
                }
            },
            { threshold: 1.0 },
        );

        const target = lastElement.current;
        if (target) observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [page, isLoading, isLoadMore, isFinish, filterValue, searchValue, list.length]);

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
                        : [...Array(6)].map((_, index) => <UserCard.Skeleton key={`skeleton-${index}`} />)}
                    {/* Load more indicator */}
                    {isLoadMore && [...Array(6)].map((_, index) => <UserCard.Skeleton key={`skeleton-${index}`} />)}
                    <div ref={isFinish ? null : lastElement} style={{ height: '1px' }}></div>
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
