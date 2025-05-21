'use client';

import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';

function ThemeWrapper({ children }) {
    const { theme } = useSelector((state) => state.theme);
    return <div data-theme={theme}>{children}</div>;
}

ThemeWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ThemeWrapper;
