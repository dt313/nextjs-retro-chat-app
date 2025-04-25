import { formatDistanceToNow } from 'date-fns';
import kr from 'date-fns/locale/vi';

export default function calculateTime(date = null) {
    const startTime = new Date(date);
    let time = formatDistanceToNow(startTime, { addSuffix: true, locale: kr });

    return time;
}
