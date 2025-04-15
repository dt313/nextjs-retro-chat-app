import classNames from 'classnames/bind';
import styles from './AttachFile.module.scss';
import File from './File';
const cx = classNames.bind(styles);

const FILES = [
    {
        id: 1,
        name: 'file1.pdf',
        size: '1024 KB',
    },
    {
        id: 2,
        name: 'file2.docx',
        size: '1024 MB',
    },
    {
        id: 3,
        name: 'file-test-color.txt',
        size: '1024 MB',
    },
    {
        id: 1,
        name: 'file1.pdf',
        size: '1024 KB',
    },
];
function AttachFile() {
    return (
        <div className={cx('wrapper')}>
            {FILES.map((file, index) => (
                <File key={index} className={cx('attach-file')} name={file.name} size={file.size} />
            ))}
        </div>
    );
}

export default AttachFile;
