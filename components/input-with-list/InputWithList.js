import { memo, useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import Input from '@/components/input';

import useClickOutside from '@/hooks/useClickOutside';

import styles from './InputWithList.module.scss';

const cx = classNames.bind(styles);

function InputWithList({
    className,
    label,
    value,
    placeholder,
    errorMessage,
    list = [],
    onChange,
    onSelect,

    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredList, setFilteredList] = useState([]);
    const wrapperRef = useRef(null);

    const listRef = useClickOutside(() => {
        setIsOpen(false);
    });

    useEffect(() => {
        setFilteredList(list);
    }, [list]);

    const handleChange = (e) => {
        setFilteredList(list.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase())));
        onChange(e);
    };

    return (
        <div className={cx('wrapper', className)} ref={wrapperRef}>
            <Input
                label={label}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onFocus={() => setIsOpen(true)}
                errorMessage={errorMessage}
                {...props}
            />
            {isOpen && filteredList.length > 0 && (
                <div className={cx('options')} onMouseDown={(e) => e.preventDefault()}>
                    <ul className={cx('list')} ref={listRef}>
                        {filteredList.map((item) => (
                            <li
                                key={item.id}
                                className={cx('list-item')}
                                onClick={() => {
                                    setIsOpen(false);
                                    onSelect(item);
                                }}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

InputWithList.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    list: PropTypes.array,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    id: PropTypes.string.isRequired,
};

export default memo(InputWithList);
