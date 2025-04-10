function Love({ className, width = 28, height = 28 }) {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_3766_16492)">
                <path
                    d="M12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0V0Z"
                    fill="url(#paint0_linear_3766_16492)"
                ></path>
                <path
                    d="M15.7094 6C12.4124 6 11.9999 8.736 11.9999 8.736C11.9999 8.736 11.5889 6 8.29186 6C5.12086 6 4.19686 9.333 4.58386 11.115C5.60386 15.825 11.9999 19.125 11.9999 19.125C11.9999 19.125 18.3974 15.825 19.4174 11.115C19.8029 9.333 18.8774 6 15.7094 6Z"
                    fill="white"
                ></path>
            </g>
            <defs>
                <linearGradient
                    id="paint0_linear_3766_16492"
                    x1="12"
                    y1="0"
                    x2="12"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FF6680"></stop>
                    <stop offset="1" stopColor="#E61739"></stop>
                </linearGradient>
                <clipPath id="clip0_3766_16492">
                    <rect width="24" height="24" fill="white"></rect>
                </clipPath>
            </defs>
        </svg>
    );
}

export default Love;
