import { uniqBy } from 'lodash';
import Angry from '@/assets/svg/emoji/angry';
import Care from '@/assets/svg/emoji/care';
import Haha from '@/assets/svg/emoji/haha';
import Like from '@/assets/svg/emoji/like';
import Love from '@/assets/svg/emoji/love';
import Sad from '@/assets/svg/emoji/sad';
import Wow from '@/assets/svg/emoji/wow';
import { RiHeart3Line } from 'react-icons/ri';
import { FaCaretDown } from 'react-icons/fa';
import {
    REACTION_TYPE_ANGRY,
    REACTION_TYPE_CARE,
    REACTION_TYPE_HAHA,
    REACTION_TYPE_LIKE,
    REACTION_TYPE_LOVE,
    REACTION_TYPE_SAD,
    REACTION_TYPE_WOW,
} from '@/config/types';

const getCountPerType = (list = [], type) => {
    return list.filter((r) => r.type === type).length;
};

const listCountPerType = (list = [], type) => {
    return list.filter((r) => r.type === type);
};

const getTabObject = (list, type, test = false) => {
    if (test) {
        return {
            name: type,
            icon: getReactionIcon(type),
            type: type,
            additionIcon: null,
            count: 20,
            list: [
                {
                    reacted_user: {
                        avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKP6d-nCnssMuzmdXrf4l_zi4BwMo9re9E9zAYTBBVYYwkTHjk=s96-c',
                        username: 'Hello',
                    },
                    type: type,
                },
                {
                    reacted_user: {
                        avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKP6d-nCnssMuzmdXrf4l_zi4BwMo9re9E9zAYTBBVYYwkTHjk=s96-c',
                        username: 'Hello',
                    },
                    type: type,
                },
            ],
        };
    }
    return {
        name: type,
        icon: getReactionIcon(type),
        type: type,
        additionIcon: null,
        count: getCountPerType(list, type),
        list: listCountPerType(list, type),
    };
};

export function getReactionIconList(list) {
    let newList = uniqBy(list, 'type').map((r) => {
        return r.type;
    });
    return newList;
}

export function getReactionIcon(type) {
    switch (type) {
        case REACTION_TYPE_LIKE:
            return Like;
        case REACTION_TYPE_LOVE:
            return Love;
        case REACTION_TYPE_ANGRY:
            return Angry;
        case REACTION_TYPE_CARE:
            return Care;
        case REACTION_TYPE_SAD:
            return Sad;
        case REACTION_TYPE_WOW:
            return Wow;
        case REACTION_TYPE_HAHA:
            return Haha;
        default:
            return RiHeart3Line;
    }
}

export function getReactionTabs(list, size) {
    const listIcon = list.length ? getReactionIconList(list) : [];
    let newTabs = [];
    if (listIcon.length <= size) {
        newTabs = listIcon.map((type) => {
            return getTabObject(list, type);
        });
    } else {
        const newListIcon = listIcon.slice(0, size - 1);
        const remainList = listIcon.slice(size - 1);

        newTabs = newListIcon.map((type) => {
            return getTabObject(list, type);
        });

        newTabs = [
            ...newTabs,
            {
                name: 'Xem thêm',
                icon: null,
                type: 'MORE',
                additionIcon: FaCaretDown,
                count: 0,
                tabs: remainList.map((type) => getTabObject(list, type)),
            },
        ];
    }

    return [
        {
            name: 'Tất cả',
            type: 'ALL',
            icon: null,
            additionIcon: null,
            count: 0,
            list: list,
        },
        ...newTabs,
    ];
}
