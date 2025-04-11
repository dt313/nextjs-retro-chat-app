import { uniqBy } from 'lodash';

export default function getReactionIconList(list) {
    let newList = uniqBy(list, 'type').map((r) => {
        return r.type;
    });
    return newList;
}
