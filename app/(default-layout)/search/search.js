'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './search.module.scss';
import InputSearch from '@/components/input-search';
import SearchCard from '@/components/search-card';
import { userService, groupService } from '@/services';
import { getSocket } from '@/config/ws';
import { useSelector } from 'react-redux';
const cx = classNames.bind(styles);

function SearchContent() {
    const searchParams = useSearchParams();
    const { user: me } = useSelector((state) => state.auth);

    const [searchValue, setSearchValue] = useState('');
    const [filterValue, setFilterValue] = useState(searchParams.get('filter') || 'user');
    const [list, setList] = useState([]);
    const router = useRouter();

    const fetchAPI = async (type) => {
        if (type === 'user') {
            const res = await userService.getUsers();
            const users = res.filter((user) => user._id !== me._id);
            setList(users);
        } else if (type === 'group') {
            const res = await groupService.getGroups();
            setList(res);
        }
    };

    useEffect(() => {
        fetchAPI(filterValue);

        const socket = getSocket();
        console.log(socket);
    }, [filterValue]);

    function changeSearchParams(q, filter) {
        const params = new URLSearchParams();

        if (q) {
            params.set('q', q.toString().trim());
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
        setSearchValue(queryValue);
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
                        Search for person, group chat or channel in{' '}
                        <strong className={cx('title-strong')}>Retro</strong>
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
                        USER
                    </span>
                    <span
                        className={cx('filter-item', filterValue === 'group' && 'active')}
                        onClick={() => handleChangeFilterValue('group')}
                    >
                        GROUP
                    </span>
                </div>

                <div className={cx('list')}>
                    {list.map((item) => {
                        return (
                            <SearchCard
                                key={item._id}
                                id={item._id}
                                type={filterValue}
                                slug={filterValue === 'user' ? item.username : item._id}
                                name={filterValue === 'user' ? item.fullName : item.name}
                                email={item?.email || null}
                                members={item?.participants?.length || 1}
                                createdAt={item.createdAt}
                                avatar={item.avatar}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function Search() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <SearchContent />
        </Suspense>
    );
}
