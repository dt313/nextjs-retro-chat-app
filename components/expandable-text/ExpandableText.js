import { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import styles from './ExpandableText.module.scss';

const cx = classNames.bind(styles);
function ExpandableText({ children, className, lineClamp = 5 }) {
    const contentRef = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [showToggle, setShowToggle] = useState(false);

    useEffect(() => {
        if (!contentRef.current) return;

        const computedStyle = getComputedStyle(contentRef.current);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const maxHeight = lineHeight * lineClamp;

        if (contentRef.current.scrollHeight > maxHeight) {
            setShowToggle(true);
        } else {
            setShowToggle(false);
        }
    }, [children, lineClamp]);

    return (
        <div className={cx('wrapper')}>
            <p
                ref={contentRef}
                className={cx('text', { expanded }, className)}
                style={{ WebkitLineClamp: expanded ? 'unset' : lineClamp }}
            >
                {children}
            </p>
            {showToggle && (
                <span className={cx('toggle-btn')} onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Ẩn bớt' : 'Xem thêm'}
                </span>
            )}
        </div>
    );
}

ExpandableText.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    lineClamp: PropTypes.number,
};

ExpandableText.defaultProps = {
    lineClamp: 5,
};

export default ExpandableText;
