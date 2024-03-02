import classNames from 'classnames';

function FallbackAvatar({ name = 'A', className }) {
    return (
        <div
            className={classNames(
                'flex h-10 w-10 items-center justify-center rounded-full bg-gray-500',
                className,
            )}
        >
            <span className="text-2xl font-semibold text-white">
                {name.charAt(0).toUpperCase()}
            </span>
        </div>
    );
}

export default FallbackAvatar;
