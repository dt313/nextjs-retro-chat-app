function SmilingFace(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 36 36"
            {...props}
            style={{
                boxShadow: '#322402b3 0px 0px 0px 2px',
                borderRadius: '10rem',
            }}
        >
            {/* Icon from Twitter Emoji by Twitter - https://creativecommons.org/licenses/by/4.0/ */}
            <circle cx="18" cy="18" r="18" fill="#FFCC4D" />
            <path
                fill="#664500"
                d="M10.515 23.621C10.56 23.8 11.683 28 18 28s7.44-4.2 7.485-4.379a.5.5 0 0 0-.237-.554a.505.505 0 0 0-.6.077C24.629 23.163 22.694 25 18 25s-6.63-1.837-6.648-1.855a.5.5 0 0 0-.598-.081a.5.5 0 0 0-.239.557"
            />
            <ellipse cx="12" cy="13.5" fill="#664500" rx="2.5" ry="3.5" />
            <ellipse cx="24" cy="13.5" fill="#664500" rx="2.5" ry="3.5" />
        </svg>
    );
}

export default SmilingFace;
