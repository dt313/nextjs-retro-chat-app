'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './search.module.scss';
import InputSearch from '@/components/input-search';
import SearchCard from '@/components/search-card';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [filterValue, setFilterValue] = useState('user');
    const searchParams = useSearchParams();
    const router = useRouter();

    const changeSearchParams = (q, filter) => {
        const params = new URLSearchParams();

        if (q) {
            params.set('q', q.toString().trim());
        }

        if (filter) {
            params.set('filter', filter.toString().trim());
        }

        router.replace(`/search?${params.toString()}`);
    };

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
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                </div>
            </div>
        </div>
    );
}

export default Search;
